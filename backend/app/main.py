from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import engine, Base, get_db
from .models import Dispute, Evidence, Decision
from .schemas import DisputeCreate, DisputeOut, EvidenceCreate, EvidenceOut, DecisionOut
from .ocr_service import OCRService
from .agent_workflow import AgenticDisputeWorkflow
from .seed_data import seed_database

# Create DB tables automatically
Base.metadata.create_all(bind=engine)

# Seed DB if empty
try:
    seed_database()
except Exception as e:
    print(f"Seed info: {e}")

app = FastAPI(
    title="ResolveAI API",
    description="Frictionless Chargeback & Dispute Resolution Platform API",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to ResolveAI API - Frictionless Dispute Resolution Platform"}

@app.get("/api/disputes", response_model=List[DisputeOut])
def get_all_disputes(db: Session = Depends(get_db)):
    """Retrieve all dispute records with evidence and decision state."""
    disputes = db.query(Dispute).all()
    return disputes

@app.get("/api/disputes/{dispute_id}", response_model=DisputeOut)
def get_dispute_by_id(dispute_id: int, db: Session = Depends(get_db)):
    """Retrieve a single dispute record by ID."""
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute record not found")
    return dispute

@app.post("/api/disputes", response_model=DisputeOut, status_code=status.HTTP_201_CREATED)
def create_dispute(dispute_in: DisputeCreate, db: Session = Depends(get_db)):
    """Create a new chargeback dispute claim (Card Member Portal)."""
    db_dispute = Dispute(**dispute_in.model_dump())
    db.add(db_dispute)
    db.commit()
    db.refresh(db_dispute)
    return db_dispute

@app.post("/api/disputes/{dispute_id}/evidence", response_model=EvidenceOut)
def upload_evidence(dispute_id: int, evidence_in: EvidenceCreate, db: Session = Depends(get_db)):
    """Upload evidence file content with automated OCR text parsing."""
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute record not found")

    # Run OCR & entity extraction
    parsed_meta = OCRService.extract_text_and_entities(evidence_in.file_name, evidence_in.raw_text)

    db_evidence = Evidence(
        dispute_id=dispute_id,
        submitted_by=evidence_in.submitted_by,
        evidence_type=evidence_in.evidence_type,
        file_name=evidence_in.file_name,
        raw_text=evidence_in.raw_text,
        parsed_metadata=parsed_meta
    )
    db.add(db_evidence)
    
    # Update dispute status
    dispute.status = "UNDER_REVIEW"
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

@app.post("/api/disputes/{dispute_id}/evaluate", response_model=DecisionOut)
def evaluate_dispute_ai(dispute_id: int, db: Session = Depends(get_db)):
    """
    Trigger the 4-Stage Agentic LLM Pipeline & Policy RAG Engine 
    to evaluate dispute evidence, score confidence, and generate decision summary.
    """
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute record not found")

    # Fetch evidence items
    evidence_items = [
        {
            "submitted_by": e.submitted_by,
            "evidence_type": e.evidence_type,
            "file_name": e.file_name,
            "raw_text": e.raw_text,
            "parsed_metadata": e.parsed_metadata
        }
        for e in dispute.evidence_items
    ]

    # Run Agentic Workflow
    result = AgenticDisputeWorkflow.execute_dispute_evaluation(
        dispute_id=dispute.id,
        transaction_id=dispute.transaction_id,
        amount=dispute.amount,
        dispute_reason=dispute.dispute_reason,
        evidence_items=evidence_items
    )

    # Save or update decision
    if dispute.decision:
        db.delete(dispute.decision)
        db.commit()

    decision = Decision(
        dispute_id=dispute.id,
        winner=result["winner"],
        confidence_score=result["confidence_score"],
        reasoning_summary=result["reasoning_summary"],
        policy_code_applied=result["policy_code_applied"],
        audit_trail=result["audit_trail"]
    )
    
    dispute.status = "RESOLVED"
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision
