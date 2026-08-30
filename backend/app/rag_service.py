from typing import List, Dict, Any

class PolicyRAGService:
    """
    RAG & Vector Search Policy Engine.
    Matches dispute claims against embedded AMEX Chargeback policy guidelines.
    """

    POLICY_KNOWLEDGE_BASE = [
        {
            "code": "C401",
            "category": "Item Not Received",
            "title": "Goods/Services Not Provided",
            "policy": "Merchant must provide valid proof of delivery (carrier tracking number showing delivery to card member address) or signed delivery receipt. If valid proof is provided, merchant wins dispute."
        },
        {
            "code": "C402",
            "category": "Unauthorized Charge",
            "title": "Fraudulent / Unrecognized Transaction",
            "policy": "Card member claims transaction was unauthorized. Merchant must provide IP address log, 3DS authentication proof, or AVS zip code match to refute."
        },
        {
            "code": "C403",
            "category": "Damaged/Defective",
            "title": "Not as Described or Defective Goods",
            "policy": "Card member must provide photos of defect or proof of return. Merchant wins if return policy was clearly presented and customer did not initiate return within terms."
        },
        {
            "code": "C404",
            "category": "Cancelled Recurring",
            "title": "Subscription Cancelled",
            "policy": "Merchant must show signed agreement or customer log showing active subscription terms prior to cancellation deadline."
        }
    ]

    @classmethod
    def query_policy(cls, dispute_reason: str, text_context: str) -> Dict[str, Any]:
        """
        Simulates vector embedding retrieval by calculating semantic keyword match
        against AMEX chargeback policy knowledge base.
        """
        dispute_reason_lower = dispute_reason.lower()
        context_lower = text_context.lower()

        best_match = cls.POLICY_KNOWLEDGE_BASE[0] # Default to C401
        highest_score = 0.0

        for policy in cls.POLICY_KNOWLEDGE_BASE:
            score = 0.0
            if policy["category"].lower() in dispute_reason_lower:
                score += 5.0
            if any(word in context_lower for word in policy["policy"].lower().split()):
                score += 2.0
            
            if score > highest_score:
                highest_score = score
                best_match = policy

        return best_match
