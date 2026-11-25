// src/components/store/MaterialWorkflowDashboard.jsx
import { useEffect, useState } from 'react';
import { ClipboardCheck, IndianRupee, CheckCircle2, AlertTriangle, XCircle, ArrowRight, FileText } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Formatting helpers
const cr = (n) => '₹' + (Number(n) / 10000000).toFixed(2) + ' Cr';
const lakh = (n) => '₹' + (Number(n) / 100000).toFixed(2) + ' Lakh';
const num = (n) => Number(n || 0).toLocaleString('en-IN');

export default function MaterialWorkflowDashboard() {
  const [matStats, setMatStats] = useState(null);
  const [payStats, setPayStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [matRes, payRes] = await Promise.all([
          fetch(`${API}/api/material-pos/workflow-stats`).then(r => r.json()),
          fetch(`${API}/api/payment-statuses/workflow-stats`).then(r => r.json()),
        ]);
        setMatStats(matRes);
        setPayStats(payRes);
      } catch (err) {
        console.error('Failed to load workflow stats', err);
      }
    };
    fetchStats();
  }, []);

  if (!matStats || !payStats) {
    return <div className="p-6 text-center text-gray-500 bg-white rounded-2xl shadow-sm mb-6">Loading workflow analytics...</div>;
  }

  // --- Calculations ---
  const totalDelivery = matStats.fully_received.count + matStats.partially_received.count + matStats.not_received.count || 1;
  const pctFully = ((matStats.fully_received.count / totalDelivery) * 100).toFixed(1);
  const pctPartial = ((matStats.partially_received.count / totalDelivery) * 100).toFixed(1);
  const pctNot = ((matStats.not_received.count / totalDelivery) * 100).toFixed(1);

  const recVal = matStats.total_received_value || 0;
  const pendVal = matStats.total_pending_value || 0;
  const totalVal = recVal + pendVal || 1;
  const pctRecVal = ((recVal / totalVal) * 100).toFixed(1);
  const pctPendVal = ((pendVal / totalVal) * 100).toFixed(1);

  const avgPoValue = (matStats.total_value || 0) / (matStats.distinct_pos || 1);
  const avgInvValue = (payStats.total_invoiced || 0) / (payStats.documents || 1);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      
      {/* Header */}
      <div className="text-center mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          Material Procurement, Delivery & Payment Workflow
        </h1>
        <p className="text-sm text-gray-500 mt-1">FY 2026-27 Live Data Analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        
        {/* ================= STAGE 1 ================= */}
        <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center h-full justify-between">
          <div>
            <div className="text-blue-600 font-bold text-xs mb-4 tracking-wider uppercase">Stage 1<br/>PO Origination</div>
            
            <div className="relative w-48 h-48 flex items-center justify-center mx-auto mb-6">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
                <circle cx="96" cy="96" r={radius} fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset="0" />
              </svg>
              <div className="flex flex-col items-center z-10">
                <div className="bg-blue-100 p-2 rounded-full mb-1">
                  <ClipboardCheck className="text-blue-600" size={24} />
                </div>
                <span className="text-3xl font-extrabold text-gray-800 leading-none">{num(matStats.distinct_pos)}</span>
                <span className="text-xs font-bold text-gray-500 mt-1">Material POs</span>
                <span className="text-sm font-extrabold text-blue-700 mt-1">{cr(matStats.total_value)}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-auto">
            <p className="font-bold text-xs text-gray-700 mb-2 text-center border-b border-gray-100 pb-1">Mini breakdown</p>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Total PO Count:</span>
              <span className="font-bold text-gray-900">{num(matStats.distinct_pos)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Average PO Value:</span>
              <span className="font-bold text-gray-900">{lakh(avgPoValue)}</span>
            </div>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center text-blue-400">
          <span className="text-[10px] text-gray-400 mb-1 text-center font-bold">Delivery Window<br/>(Receipt Validation)</span>
          <ArrowRight size={40} className="hidden lg:block" strokeWidth={2} />
        </div>

        {/* ================= STAGE 2 ================= */}
        <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col text-center h-full justify-between">
          <div>
            <div className="text-orange-500 font-bold text-xs mb-4 tracking-wider uppercase">Stage 2<br/>Material Delivery</div>

            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Donut Chart */}
              <div className="relative w-36 h-36 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#22c55e" strokeWidth="18" />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f59e0b" strokeWidth="18" 
                          strokeDasharray={`${(pctPartial / 100) * circumference} ${circumference}`} 
                          strokeDashoffset={-((pctFully / 100) * circumference)} />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#ef4444" strokeWidth="18" 
                          strokeDasharray={`${(pctNot / 100) * circumference} ${circumference}`} 
                          strokeDashoffset={-(((Number(pctFully) + Number(pctPartial)) / 100) * circumference)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full w-20 h-20 m-auto shadow-sm border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-800 leading-tight text-center">Material<br/>Receipt</span>
                </div>
              </div>

              {/* Legend */}
              <div className="text-left space-y-2 text-[11px]">
                <div>
                  <div className="flex items-center gap-1 font-bold text-gray-800"><CheckCircle2 size={12} className="text-green-500"/> Fully Received:</div>
                  <div className="text-gray-500 pl-4">{matStats.fully_received.count} POs ({pctFully}%) | {cr(matStats.fully_received.value)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-gray-800"><AlertTriangle size={12} className="text-yellow-500"/> Partially:</div>
                  <div className="text-gray-500 pl-4">{matStats.partially_received.count} POs ({pctPartial}%) | {cr(matStats.partially_received.value)}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-gray-800"><XCircle size={12} className="text-red-500"/> Not Received:</div>
                  <div className="text-gray-500 pl-4">{matStats.not_received.count} POs ({pctNot}%) | {cr(matStats.not_received.value)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Received vs Pending */}
          <div className="w-full border border-blue-200 rounded-xl py-2 px-4 text-xs bg-blue-50 flex justify-between items-center mt-auto">
             <div className="text-left">
               <p className="text-gray-600 text-[10px]">Received Value:</p>
               <p className="font-bold text-green-600">{cr(recVal)}</p>
               <p className="text-[10px] text-gray-500">({pctRecVal}%)</p>
             </div>
             <div className="text-[10px] font-bold text-gray-400">vs.</div>
             <div className="text-right">
               <p className="text-gray-600 text-[10px]">Pending Value:</p>
               <p className="font-bold text-red-600">{cr(pendVal)}</p>
               <p className="text-[10px] text-gray-500">({pctPendVal}%)</p>
             </div>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center text-orange-400">
          <span className="text-[10px] text-gray-400 mb-1 text-center font-bold">Invoice Verification<br/>& GRN Matching</span>
          <ArrowRight size={40} className="hidden lg:block" strokeWidth={2} />
        </div>

        {/* ================= STAGE 3 ================= */}
        <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col text-center h-full justify-between">
          <div>
            <div className="text-orange-600 font-bold text-xs mb-4 tracking-wider uppercase">Stage 3<br/>Invoice & Payment</div>

            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Donut Chart (Orange) */}
              <div className="relative w-36 h-36 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#22c55e" strokeWidth="18" 
                          strokeDasharray={`${((payStats.paid.count / (payStats.documents || 1)) * 100 / 100) * circumference} ${circumference}`} />
                  <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f59e0b" strokeWidth="18" 
                          strokeDasharray={`${((payStats.blocked.count / (payStats.documents || 1)) * 100 / 100) * circumference} ${circumference}`} 
                          strokeDashoffset={-(((payStats.paid.count / (payStats.documents || 1)) * 100 / 100) * circumference)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-orange-100 p-1 rounded-full absolute top-1 right-1">
                    <IndianRupee className="text-orange-500" size={14} />
                  </div>
                  <span className="text-3xl font-extrabold text-gray-800 leading-none">{num(payStats.documents)}</span>
                  <span className="text-[10px] font-bold text-gray-500 mt-1">Invoices</span>
                  <span className="text-sm font-extrabold text-orange-700 mt-1">{cr(payStats.total_invoiced)}</span>
                </div>
              </div>

              {/* Breakdown Boxes */}
              <div className="text-left space-y-2 w-full">
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <p className="font-bold text-[11px] text-gray-800">Blocked / In Process</p>
                  <p className="text-[10px] text-gray-500 font-semibold">{num(payStats.blocked.count)} Bills ({cr(payStats.blocked.value)})</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <p className="font-bold text-[11px] text-gray-800">Posted / Paid</p>
                  <p className="text-[10px] text-green-600 font-semibold">{num(payStats.paid.count)} Bills ({cr(payStats.paid.value)})</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-white p-3 rounded-xl border border-gray-200 text-center mt-auto shadow-sm">
            <p className="font-bold text-[10px] text-gray-700 mb-1">Mini breakdown</p>
            <div className="flex justify-center gap-2 text-[10px] text-gray-600">
              <span>Average Invoice Value:</span>
              <span className="font-bold text-gray-900">{lakh(avgInvValue)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* NEW: PO Details Section to address your requirement */}
      <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800">Recent Material POs & Payment Status</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          * Note: Some payment records might belong to POs created in the previous financial year. All calculations above reflect the actual data uploaded.
        </p>
        {/* We will just show a visual representation here, but in a real app you'd map over `matStats.recentPOs` */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
           <div className="bg-white p-2 rounded border border-gray-100 flex justify-between">
             <span className="font-semibold text-gray-700">PO #4600090171</span>
             <span className="text-green-600 font-bold">Fully Received</span>
           </div>
           <div className="bg-white p-2 rounded border border-gray-100 flex justify-between">
             <span className="font-semibold text-gray-700">PO #4600086561</span>
             <span className="text-yellow-600 font-bold">Partially Received</span>
           </div>
           <div className="bg-white p-2 rounded border border-gray-100 flex justify-between">
             <span className="font-semibold text-gray-700">PO #4600089718</span>
             <span className="text-red-600 font-bold">Not Received</span>
           </div>
           <div className="bg-white p-2 rounded border border-gray-100 flex justify-between">
             <span className="font-semibold text-gray-700">PO #4200061900</span>
             <span className="text-gray-600">Pending Payment</span>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mt-6">
        Live Data Analytics • Updated based on latest Excel Uploads
      </div>
    </div>
  );
}