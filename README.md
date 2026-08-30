# ResolveAI — Frictionless Dispute & Chargeback Resolution Platform
> **American Express CodeStreet Hackathon Project**
> *Reducing chargeback processing timelines from one full month down to just a few minutes.*

---

## 📌 Project Overview
**ResolveAI** is an AI-powered evidence intelligence platform designed to automate credit card chargeback and dispute resolution. It automatically collects transaction evidence from both Card Members and Merchants, parses uploaded documents (receipts, carrier tracking, refund policies) using OCR, matches policy rules via Retrieval-Augmented Generation (RAG), and executes a multi-agent LLM pipeline to generate fair confidence scores and transparent decision summaries.

---

## 🎯 Resume Justification & Feature Mapping

This codebase is structured to directly justify both **SDE** and **Gen AI / AI-ML** resume bullet points:

### 1️⃣ SDE Resume Points Alignment
- **React Frontend**: Modern single-page web app with Card Member Submission, Merchant Portal, and Reviewer Dashboard (`frontend/src/App.jsx`).
- **Python (FastAPI) & REST APIs**: Modular backend handling endpoints for dispute lifecycle, evidence uploads, and evaluation (`backend/app/main.py`).
- **PostgreSQL / SQLAlchemy Database**: Relational schema tracking Disputes, Evidence items, Audit logs, and User roles (`backend/app/models.py`).
- **OCR & LLM API Integration**: Automated document text extraction combined with structured API responses (`backend/app/ocr_service.py`, `backend/app/agent_workflow.py`).

### 2️⃣ Gen AI / AI-ML Resume Points Alignment
- **Agentic LLM Pipeline**: 4-stage agentic workflow (`Classification` ➔ `Evidence Analysis` ➔ `Policy Reasoning` ➔ `Decision & Explanation`) executing structured prompt chains (`backend/app/agent_workflow.py`).
- **RAG & Vector Search**: Embedded AMEX Chargeback policy guidelines with vector similarity matching for policy lookup (`backend/app/rag_service.py`).
- **OCR Ingestion**: Automated text extraction from PDF/image uploads to parse dates, amounts, and tracking numbers (`backend/app/ocr_service.py`).
- **Evidence Confidence Scoring & Transparent Reasoning**: Generates percentage-based win probabilities (Card Member vs Merchant) alongside human-readable decision justifications (`backend/app/agent_workflow.py`).

---

## 🏗️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM)
- **AI & NLP**: LangChain / OpenAI API (with built-in offline fallback engine), Vector Embeddings (FAISS / In-Memory similarity), OCR Parser

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate

pip install -r requirements.txt
python -m app.seed_data  # Seeds database with sample disputes
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## 📁 Repository Structure

```text
resolve-ai/
├── README.md
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI REST endpoints
│   │   ├── database.py          # Database session & engine
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic data validation schemas
│   │   ├── ocr_service.py       # Document OCR & text parsing
│   │   ├── rag_service.py       # Policy vector search & RAG engine
│   │   ├── agent_workflow.py    # Agentic LLM reasoning pipeline
│   │   └── seed_data.py         # Initial mock dispute data seeder
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx              # Main React SPA
        ├── main.jsx
        └── index.css
```
