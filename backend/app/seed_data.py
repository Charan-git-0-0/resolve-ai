from .database import SessionLocal, engine, Base
from .models import Dispute, Evidence, Decision
from .ocr_service import OCRService
from .agent_workflow import AgenticDisputeWorkflow

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if data already exists
    if db.query(Dispute).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding sample disputes and evidence...")

    # Case 1: Merchant wins (Valid tracking proof)
    dispute1 = Dispute(
        transaction_id="TXN-908124",
        customer_id="CUST-1042",
        merchant_id="MERCH-8801",
        amount=249.99,
        dispute_reason="Item Not Received",
        status="RESOLVED"
    )
    db.add(dispute1)
    db.commit()
    db.refresh(dispute1)

    ev1_cust = Evidence(
        dispute_id=dispute1.id,
        submitted_by="CUSTOMER",
        evidence_type="RECEIPT",
        file_name="order_confirmation.pdf",
        raw_text="Order #908124 for Wireless Headphones - Amount: $249.99. Placed on Aug 10. Item never arrived at my apartment.",
        parsed_metadata=OCRService.extract_text_and_entities("order_confirmation.pdf", "Order #908124 for Wireless Headphones - Amount: $249.99.")
    )

    ev1_merch = Evidence(
        dispute_id=dispute1.id,
        submitted_by="MERCHANT",
        evidence_type="SHIPPING_PROOF",
        file_name="fedex_delivery_proof.pdf",
        raw_text="FedEx Express Tracking 1Z9999999999999999 - Status: Delivered on Aug 14 to Front Door. Signed by Resident. Amount $249.99.",
        parsed_metadata=OCRService.extract_text_and_entities("fedex_delivery_proof.pdf", "FedEx Express Tracking 1Z9999999999999999 - Status: Delivered on Aug 14")
    )
    db.add_all([ev1_cust, ev1_merch])
    db.commit()

    # Evaluate Case 1
    eval_res1 = AgenticDisputeWorkflow.execute_dispute_evaluation(
        dispute_id=dispute1.id,
        transaction_id=dispute1.transaction_id,
        amount=dispute1.amount,
        dispute_reason=dispute1.dispute_reason,
        evidence_items=[
            {"submitted_by": "CUSTOMER", "file_name": ev1_cust.file_name, "raw_text": ev1_cust.raw_text, "parsed_metadata": ev1_cust.parsed_metadata},
            {"submitted_by": "MERCHANT", "file_name": ev1_merch.file_name, "raw_text": ev1_merch.raw_text, "parsed_metadata": ev1_merch.parsed_metadata}
        ]
    )

    dec1 = Decision(
        dispute_id=dispute1.id,
        winner=eval_res1["winner"],
        confidence_score=eval_res1["confidence_score"],
        reasoning_summary=eval_res1["reasoning_summary"],
        policy_code_applied=eval_res1["policy_code_applied"],
        audit_trail=eval_res1["audit_trail"]
    )
    db.add(dec1)

    # Case 2: Customer wins (No merchant shipping proof)
    dispute2 = Dispute(
        transaction_id="TXN-701923",
        customer_id="CUST-3091",
        merchant_id="MERCH-5510",
        amount=120.00,
        dispute_reason="Item Not Received",
        status="PENDING_EVIDENCE"
    )
    db.add(dispute2)
    db.commit()
    db.refresh(dispute2)

    ev2_cust = Evidence(
        dispute_id=dispute2.id,
        submitted_by="CUSTOMER",
        evidence_type="RECEIPT",
        file_name="receipt_120.pdf",
        raw_text="Transaction TXN-701923 charged $120.00 on Aug 2. Merchant has not provided tracking update in 20 days.",
        parsed_metadata=OCRService.extract_text_and_entities("receipt_120.pdf", "Transaction TXN-701923 charged $120.00")
    )
    db.add(ev2_cust)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
