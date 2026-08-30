from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    customer_id = Column(String, index=True)
    merchant_id = Column(String, index=True)
    amount = Column(Float, nullable=False)
    dispute_reason = Column(String, nullable=False)  # e.g., "Item Not Received", "Unauthorized Charge"
    status = Column(String, default="PENDING_EVIDENCE")  # PENDING_EVIDENCE, UNDER_REVIEW, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)

    evidence_items = relationship("Evidence", back_populates="dispute", cascade="all, delete-orphan")
    decision = relationship("Decision", back_populates="dispute", uselist=False, cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    dispute_id = Column(Integer, ForeignKey("disputes.id"))
    submitted_by = Column(String, nullable=False)  # "CUSTOMER" or "MERCHANT"
    evidence_type = Column(String, nullable=False) # "RECEIPT", "SHIPPING_PROOF", "EMAIL_LOG", "POLICY"
    file_name = Column(String, nullable=False)
    raw_text = Column(Text, nullable=True)  # Extracted OCR text
    parsed_metadata = Column(JSON, nullable=True)  # Extracted JSON entities
    created_at = Column(DateTime, default=datetime.utcnow)

    dispute = relationship("Dispute", back_populates="evidence_items")

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    dispute_id = Column(Integer, ForeignKey("disputes.id"))
    winner = Column(String, nullable=False)  # "CUSTOMER" or "MERCHANT"
    confidence_score = Column(Float, nullable=False)  # 0.0 to 100.0
    reasoning_summary = Column(Text, nullable=False)
    policy_code_applied = Column(String, nullable=True)
    audit_trail = Column(JSON, nullable=True)  # Stage-by-stage agent logs
    created_at = Column(DateTime, default=datetime.utcnow)

    dispute = relationship("Dispute", back_populates="decision")
