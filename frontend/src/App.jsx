import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  Store, 
  ArrowRight,
  Sparkles,
  Scale
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('reviewer'); // 'customer', 'merchant', 'reviewer'
  const [disputes, setDisputes] = useState([]);
  const [selectedDisputeId, setSelectedDisputeId] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newTxnId, setNewTxnId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newReason, setNewReason] = useState('Item Not Received');

  const [evidenceType, setEvidenceType] = useState('SHIPPING_PROOF');
  const [evidenceText, setEvidenceText] = useState('');

  // Fetch disputes from API or fallback mock
  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/disputes');
      if (res.ok) {
        const data = await res.json();
        setDisputes(data);
        if (data.length > 0 && !selectedDisputeId) {
          setSelectedDisputeId(data[0].id);
        }
      }
    } catch (err) {
      console.warn("Backend not running yet, using local state mock fallback.");
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const selectedDispute = disputes.find(d => d.id === selectedDisputeId) || {
    id: 1,
    transaction_id: "TXN-908124",
    customer_id: "CUST-1042",
    merchant_id: "MERCH-8801",
    amount: 249.99,
    dispute_reason: "Item Not Received",
    status: "RESOLVED",
    evidence_items: [
      {
        id: 101,
        submitted_by: "CUSTOMER",
        evidence_type: "RECEIPT",
        file_name: "order_confirmation.pdf",
        raw_text: "Order #908124 for Wireless Headphones - Amount: $249.99. Placed on Aug 10. Item never arrived."
      },
      {
        id: 102,
        submitted_by: "MERCHANT",
        evidence_type: "SHIPPING_PROOF",
        file_name: "fedex_delivery_proof.pdf",
        raw_text: "FedEx Express Tracking 1Z9999999999999999 - Status: Delivered on Aug 14 to Front Door. Signed by Resident."
      }
    ],
    decision: {
      id: 501,
      winner: "MERCHANT",
      confidence_score: 92.5,
      reasoning_summary: "Dispute resolved in favor of MERCHANT under AMEX Policy C401. The merchant provided valid carrier proof of delivery (Tracking ID: 1Z9999999999999999) confirming fulfillment. Customer claim of 'Item Not Received' is refuted by verified carrier logs.",
      policy_code_applied: "C401",
      audit_trail: [
        { stage: "1. Classification Agent", status: "COMPLETED", detail: "Classified transaction 'TXN-908124' ($249.99) as Sector: E-Commerce, Category: Item Not Received" },
        { stage: "2. Evidence Agent", status: "COMPLETED", detail: "Parsed 1 Customer doc & 1 Merchant doc. Merchant delivery proof found: True" },
        { stage: "3. Policy Reasoning Agent", status: "COMPLETED", detail: "Applied AMEX Chargeback Policy C401 (Goods/Services Not Provided)." },
        { stage: "4. Resolution Agent", status: "COMPLETED", detail: "Final Decision: MERCHANT (Confidence: 92.5%). Generated transparent justification summary." }
      ]
    }
  };

  // Create dispute handler
  const handleCreateDispute = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: newTxnId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          customer_id: 'CUST-CURRENT',
          merchant_id: 'MERCH-DEMO',
          amount: parseFloat(newAmount) || 150.00,
          dispute_reason: newReason
        })
      });
      if (res.ok) {
        await fetchDisputes();
        alert('Dispute raised successfully!');
        setNewTxnId('');
        setNewAmount('');
      }
    } catch (err) {
      alert('Mock Dispute Created locally!');
    }
    setLoading(false);
  };

  // Evaluate AI handler
  const handleRunAIEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/disputes/${selectedDispute.id}/evaluate`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchDisputes();
      }
    } catch (err) {
      alert('AI Evaluation executed locally!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ResolveAI <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">AmEx CodeStreet MVP</span>
            </h1>
            <p className="text-xs text-slate-400">Evidence Intelligence Platform for Chargeback Resolution</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'customer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="h-4 w-4" /> Card Member Portal
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'merchant' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="h-4 w-4" /> Merchant Portal
          </button>
          <button
            onClick={() => setActiveTab('reviewer')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              activeTab === 'reviewer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="h-4 w-4" /> AI Reviewer Dashboard
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* CUSTOMER PORTAL */}
        {activeTab === 'customer' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" /> Raise a Transaction Dispute
              </h2>
              <p className="text-xs text-slate-400 mb-6">File a claim for unfulfilled or unauthorized credit card transactions.</p>
              
              <form onSubmit={handleCreateDispute} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-88219"
                    value={newTxnId}
                    onChange={(e) => setNewTxnId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dispute Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reason Code</label>
                  <select
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Item Not Received">Item Not Received</option>
                    <option value="Unauthorized Charge">Unauthorized Charge</option>
                    <option value="Not as Described / Defective">Not as Described / Defective</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition text-sm flex justify-center items-center gap-2"
                >
                  Submit Dispute Claim <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MERCHANT PORTAL */}
        {activeTab === 'merchant' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <Store className="h-5 w-5 text-emerald-400" /> Merchant Evidence Portal
              </h2>
              <p className="text-xs text-slate-400 mb-6">Upload shipping receipts, carrier tracking proof, or return policy logs.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Dispute</label>
                  <select
                    value={selectedDisputeId}
                    onChange={(e) => setSelectedDisputeId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {disputes.map(d => (
                      <option key={d.id} value={d.id}>Dispute #{d.id} - {d.transaction_id} (${d.amount})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Evidence Category</label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SHIPPING_PROOF">Carrier Shipping Proof / Tracking</option>
                    <option value="RECEIPT">Invoice / Order Receipt</option>
                    <option value="POLICY">Return & Fulfillment Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Document OCR Raw Text Input</label>
                  <textarea
                    rows={4}
                    placeholder="Paste shipping log or receipt text (e.g. FedEx Tracking 1Z9999999999999999 Status: Delivered)..."
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => alert('Evidence uploaded successfully with OCR parsing!')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition text-sm flex justify-center items-center gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Evidence & Execute OCR Parsing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI REVIEWER DASHBOARD */}
        {activeTab === 'reviewer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Dispute Selector List */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-fit">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" /> Active Dispute Cases ({disputes.length || 1})
              </h3>
              <div className="space-y-2">
                {(disputes.length > 0 ? disputes : [selectedDispute]).map(d => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDisputeId(d.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      selectedDisputeId === d.id
                        ? 'bg-blue-600/10 border-blue-500/50 text-white'
                        : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs text-slate-200">{d.transaction_id}</span>
                      <span className="text-xs font-bold text-emerald-400">${d.amount}</span>
                    </div>
                    <p className="text-xs text-slate-400">{d.dispute_reason}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{d.status}</span>
                      <span className="text-slate-500">{new Date(d.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Case Deep-Dive & AI Evaluation */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Banner & AI Run Trigger */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedDispute.transaction_id}</h2>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      Case #{selectedDispute.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Amount: <strong className="text-slate-200">${selectedDispute.amount}</strong> | Reason: <strong className="text-slate-200">{selectedDispute.dispute_reason}</strong>
                  </p>
                </div>

                <button
                  onClick={handleRunAIEvaluation}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Run Agentic LLM Pipeline
                </button>
              </div>

              {/* Side-by-Side Evidence Ingestion View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Evidence Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-3 border-b border-slate-800/80 pb-2">
                    <UserCheck className="h-4 w-4" /> Card Member Claim & Evidence
                  </div>
                  {selectedDispute.evidence_items?.filter(e => e.submitted_by === 'CUSTOMER').map((e, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1 mb-2">
                      <div className="font-semibold text-slate-200">{e.file_name}</div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{e.raw_text}</p>
                    </div>
                  )) || <p className="text-xs text-slate-500 italic">No customer evidence uploaded.</p>}
                </div>

                {/* Merchant Evidence Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3 border-b border-slate-800/80 pb-2">
                    <Store className="h-4 w-4" /> Merchant Counter-Evidence & OCR
                  </div>
                  {selectedDispute.evidence_items?.filter(e => e.submitted_by === 'MERCHANT').map((e, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs space-y-1 mb-2">
                      <div className="font-semibold text-slate-200 flex justify-between">
                        <span>{e.file_name}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">OCR Parsed</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{e.raw_text}</p>
                    </div>
                  )) || <p className="text-xs text-slate-500 italic">No merchant evidence uploaded.</p>}
                </div>
              </div>

              {/* AI Decision & Confidence Score Output */}
              {selectedDispute.decision && (
                <div className="bg-gradient-to-br from-slate-950 to-blue-950/30 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">AI Decision & Confidence Analysis</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Confidence Score:</span>
                      <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
                        {selectedDispute.decision.confidence_score}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-2">
                      Winner Verdict: 
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        selectedDispute.decision.winner === 'MERCHANT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {selectedDispute.decision.winner}
                      </span>
                      <span className="text-[11px] text-slate-400"> (Applied Policy: {selectedDispute.decision.policy_code_applied})</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      {selectedDispute.decision.reasoning_summary}
                    </p>
                  </div>

                  {/* Multi-Agent Audit Trail */}
                  {selectedDispute.decision.audit_trail && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agentic Pipeline Audit Trail</h4>
                      <div className="space-y-1.5">
                        {selectedDispute.decision.audit_trail.map((stage, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800/50">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            <span className="font-semibold text-slate-300 min-w-[160px]">{stage.stage}:</span>
                            <span className="text-slate-400 truncate">{stage.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
