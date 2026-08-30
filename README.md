# ResolveAI — AI-Powered Dispute & Chargeback Resolution Platform
> **American Express CodeStreet Hackathon Project**
> *Automating chargeback dispute resolution by extracting evidence and evaluating claims with agentic LLM workflows.*

---

## 📌 Project Overview
**ResolveAI** is an intelligent dispute resolution platform designed to accelerate credit card chargeback workflows from weeks down to minutes. It ingests transaction evidence from both Card Members and Merchants, parses uploaded receipts and carrier documents using OCR, retrieves relevant chargeback policy clauses via RAG, and executes a multi-agent LLM pipeline to produce transparent confidence scoring and decision rationales.

---

## 🚀 Key Features

- **Multi-Party Portal**: Distinct interfaces for Card Member dispute filing, Merchant rebuttal submissions, and Reviewer case management.
- **OCR Document Parsing**: Automated text and data extraction from receipts, order confirmations, and tracking documents.
- **Policy RAG Retrieval**: Chargeback rulebook embeddings matched against case facts for grounded decision-making.
- **Agentic Decision Pipeline**: 4-stage reasoning chain (Classification ➔ Evidence Analysis ➔ Policy Grounding ➔ Decision & Rationale).
- **Explainable Scoring**: Win/loss probability breakdowns with clear human-readable justifications and audit trails.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic
- **Database**: SQLite / PostgreSQL with SQLAlchemy ORM
- **AI & NLP**: LangChain, OpenAI / Gemini APIs, Vector Embeddings (FAISS / Cosine Similarity), Tesseract OCR

---

## 📦 Repository Structure

\\	ext
resolve-ai/
├── README.md
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI REST endpoints
│   │   ├── database.py          # Database session & engine
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── ocr_service.py       # Document OCR & text parsing
│   │   ├── rag_service.py       # Policy vector search & RAG engine
│   │   ├── agent_workflow.py    # Multi-stage LLM reasoning pipeline
│   │   └── seed_data.py         # Mock dispute seed data
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx              # Main React Application
        ├── main.jsx
        └── index.css
\
---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
\\ash
cd backend
python -m venv venv
# On Windows:
venv\Scriptsctivate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
python -m app.seed_data
uvicorn app.main:app --reload --port 8000
\- API Docs (Swagger UI): http://localhost:8000/docs

### 2. Frontend Setup
\\ash
cd frontend
npm install
npm run dev
\- Frontend Application: http://localhost:5173

---

## 📄 License
MIT © Charan-git-0-0
