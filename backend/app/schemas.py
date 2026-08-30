from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class DisputeBase(BaseModel):
    transaction_id: str
    customer_id: str
    merchant_id: str
    amount: float
    dispute_reason: str

class DisputeCreate(DisputeBase):
    pass

class EvidenceCreate(BaseModel):
    submitted_by: str  # CUSTOMER or MERCHANT
    evidence_type: str
    file_name: str
    raw_text: str

class EvidenceOut(BaseModel):
    id: int
    submitted_by: str
    evidence_type: str
    file_name: str
    raw_text: Optional[str] = None
    parsed_metadata: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DecisionOut(BaseModel):
    id: int
    winner: str
    confidence_score: float
    reasoning_summary: str
    policy_code_applied: Optional[str] = None
    audit_trail: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DisputeOut(DisputeBase):
    id: int
    status: str
    created_at: datetime
    evidence_items: List[EvidenceOut] = []
    decision: Optional[DecisionOut] = None

    class Config:
        from_attributes = True
