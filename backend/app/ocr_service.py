import re
from typing import Dict, Any

class OCRService:
    """
    Document OCR Ingestion & Text Parsing Engine.
    Parses unstructured raw evidence text (receipts, delivery receipts, emails) into structured entities.
    """
    
    @staticmethod
    def extract_text_and_entities(file_name: str, raw_text: str) -> Dict[str, Any]:
        parsed_metadata: Dict[str, Any] = {
            "file_name": file_name,
            "has_tracking_number": False,
            "tracking_number": None,
            "delivery_status": "UNKNOWN",
            "extracted_amounts": [],
            "date_found": None
        }

        # 1. Regex pattern matching for Tracking IDs (e.g., 1Z..., FedEx/UPS style)
        tracking_match = re.search(r'\b(1Z[0-9A-Z]{16}|[0-9]{12,15}|TRACK-[A-Z0-9]+)\b', raw_text, re.IGNORECASE)
        if tracking_match:
            parsed_metadata["has_tracking_number"] = True
            parsed_metadata["tracking_number"] = tracking_match.group(0)

        # 2. Check for delivery keywords
        lower_text = raw_text.lower()
        if "delivered" in lower_text or "proof of delivery" in lower_text or "signed by" in lower_text:
            parsed_metadata["delivery_status"] = "DELIVERED"
        elif "in transit" in lower_text or "shipped" in lower_text:
            parsed_metadata["delivery_status"] = "IN_TRANSIT"
        elif "returned" in lower_text or "refunded" in lower_text:
            parsed_metadata["delivery_status"] = "RETURNED"

        # 3. Extract dollar amounts
        amounts = re.findall(r'\$\s*([0-9]+(?:\.[0-9]{2})?)', raw_text)
        if amounts:
            parsed_metadata["extracted_amounts"] = [float(a) for a in amounts]

        return parsed_metadata
