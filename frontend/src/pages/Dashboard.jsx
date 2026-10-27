// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { poApi, workApi } from '../api/poApi';
import ChartCard from '../components/ChartCard';
import { CHART_CONFIGS } from '../config/charts';
import KpiCard from '../components/Cards/KpiCard';
import WorkFlowStatus from '../components/WorkFlowStatus';
import { useAuth } from '../context/AuthContext';
import EditPOModal from '../components/EditPOModal';



const formatCurrency = (n) => {
  const num = Number(n) || 0;
  return '₹ ' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

// ------------------------------------------------------------
// Main Dashboard
// ------------------------------------------------------------
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- PO Data State ---
  const [allPos, setAllPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPO, setEditingPO] = useState(null);

  // --- Work Status Data State ---
  const [workCases, setWorkCases] = useState([]);
  const [workLoading, setWorkLoading] = useState(true);
  const [workSearch, setWorkSearch] = useState('');
  const [workPage, setWorkPage] = useState(1);
  const workLimit = 10;

  // ---------- Fetch PO Data ----------
  const fetchData = async () => {
    setLoading(true);
    try {
      const poRes = await poApi.getAll({ limit: 5000 });
      setAllPos(poRes.data.data || []);
    } catch (err) {
      console.error('Error fetching PO data', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Fetch Work Status Data ----------
  const fetchWorkCases = async () => {
    setWorkLoading(true);
    try {
      const res = await workApi.getAll({ search: workSearch });
      setWorkCases(res.data || []);
      setWorkPage(1); 
    } catch (err) {
      console.error('Error fetching Work Status', err);
    } finally {
      setWorkLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  
  useEffect(() => {
    const delay = setTimeout(() => fetchWorkCases(), 400);
    return () => clearTimeout(delay);
  }, [workSearch]);

  // ---------- PO Search filter ----------
  const searchFilteredData = useMemo(() => {
    return allPos.filter((po) => {
      const s = search.toLowerCase();
      return (
        !search ||
        String(po.po_no).toLowerCase().includes(s) ||
        po.agency?.toLowerCase().includes(s) ||
        po.name_of_work?.toLowerCase().includes(s)
      );
    });
  }, [allPos, search]);

  // ---------- KPIs ----------
  const kpis = useMemo(() => {
    const total = searchFilteredData.length;
    const totalValue = searchFilteredData.reduce((sum, po) => sum + (Number(po.value_inr) || 0), 0);
    const fastPOs = searchFilteredData.filter((po) => {
      const d = Number(po.pr_po_days) || 0;
      return d > 0 && d < 30;
    });
    const avgDays = fastPOs.length > 0 ? fastPOs.reduce((sum, po) => sum + (Number(po.pr_po_days) || 0), 0) / fastPOs.length : 0;

    return {
      total,
      totalValue,
      avgDays: Math.round(avgDays * 10) / 10,
      fastCount: fastPOs.length,
      fastPercent: total > 0 ? Math.round((fastPOs.length / total) * 100) : 0,
    };
  }, [searchFilteredData]);

  // ---------- Work Status Pagination ----------
  const totalWork = workCases.length;
  const totalWorkPages = Math.ceil(totalWork / workLimit) || 1;
  const paginatedWorkData = workCases.slice((workPage - 1) * workLimit, workPage * workLimit);

  // Get Configs for the 3 columns
  const plantGroupConfig = CHART_CONFIGS.find(c => c.id === 'plant-group');
  const estimateVsAwardConfig = CHART_CONFIGS.find(c => c.id === 'estimate-vs-award');

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-linear-to-r from-[#EDE0D3] via-[#F0C9C9] to-[#EBDFF2]">
      <div className="max-w-[1600px] mx-auto px-4 py-5">

        {/* ===================== LOGIN / LOGOUT ===================== */}
        <div className="mb-5 flex justify-end">
          {user ? (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="text-sm font-bold">Logout</span>
            </button>
          ) : (
            <Link to="/login" className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              <span className="text-sm font-bold">Login</span>
            </Link>
          )}
        </div>

        {/* ===================== KPI CARDS ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={<span>📄</span>} title="Total Live POs" value={kpis.total.toLocaleString()} change="+12%" subtitle="vs. last month" tone="blue" sparkData={[3, 5, 4, 6, 8, 7, 10]} />
          <KpiCard icon={<span>₹</span>} title="Total PO Value" value={formatCurrency(kpis.totalValue)} change="+8%" subtitle="vs. last month" tone="purple" sparkData={[4, 6, 5, 7, 9, 8, 11]} />
          <KpiCard icon={<span>⏱</span>} title="Avg Completion (Fast POs)" value={`${kpis.avgDays.toFixed(1)} Days`} change={`${kpis.fastPercent}%`} subtitle={`of ${kpis.fastCount} POs < 30 days`} tone="green" sparkData={[5, 6, 6, 7, 6, 8, 9]} />
          <KpiCard icon={<span>💬</span>} title="Chat Box" value="Coming soon.." change="HI" subtitle="" tone="orange" sparkData={[5, 6, 6, 7, 6, 8, 9]} />
        </div>

        {/* ===================== 3-COLUMN LAYOUT ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 items-stretch">
          
          {/* 1. Order Plant Group */}
          <div className="lg:col-span-1">
             {plantGroupConfig && (
                <ChartCard config={plantGroupConfig} pos={searchFilteredData} />
             )}
          </div>

          {/* 2. Work Flow Status (Middle) */}
          <div className="lg:col-span-1">
             <WorkFlowStatus workCases={workCases} />
          </div>

          {/* 3. Estimate vs Award */}
          <div className="lg:col-span-1">
             {estimateVsAwardConfig && (
                <ChartCard config={estimateVsAwardConfig} pos={searchFilteredData} />
             )}
          </div>

        </div>

        {/* ===================== LIVE WORK STATUS TABLE ===================== */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 flex flex-col">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">💼</span>
              Live Work Status (CB & KDCMP)
            </h2>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search Executive, Package, Agency..."
                value={workSearch}
                onChange={(e) => setWorkSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none w-full bg-white transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#0f2e9e] text-white uppercase text-[10px] tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 font-semibold">Type</th>
                  <th className="px-4 py-4 font-semibold">Executive</th>
                  <th className="px-4 py-4 font-semibold">Project</th>
                  <th className="px-4 py-4 font-semibold min-w-[250px]">Package Details</th>
                  <th className="px-4 py-4 font-semibold text-right">Cost Estimate</th>
                  <th className="px-4 py-4 font-semibold">Mode / Type</th>
                  <th className="px-4 py-4 font-semibold">PR Info</th>
                  <th className="px-4 py-4 font-semibold min-w-[300px]">Status / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {workLoading ? (
                  <tr><td colSpan="8" className="text-center py-12 text-gray-400">Loading data...</td></tr>
                ) : paginatedWorkData.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-12 text-gray-400">No records found.</td></tr>
                ) : (
                  paginatedWorkData.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition">
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${row.case_type === 'Contract' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {row.case_type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-semibold">{row.dealing_executive}</td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-[#0b3d91] bg-blue-50 px-2 py-1 rounded-md">{row.project}</span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 whitespace-normal text-[11px] leading-relaxed max-w-[350px]">{row.package}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-800">{formatCurrency(row.cost_estimate)}</td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-semibold">{row.mode_of_tendering}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">{row.tendering_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800">{row.pr_no}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">{row.pr_date}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-normal text-[11px] leading-relaxed max-w-[350px]">
                        {row.status && <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold mb-1">{row.status}</span>}
                        <p className="text-gray-500 line-clamp-4" title={row.remarks}>{row.remarks || '—'}</p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50 mt-auto">
            <span className="text-xs text-gray-500">
              Showing {totalWork === 0 ? 0 : (workPage - 1) * workLimit + 1} to {Math.min(workPage * workLimit, totalWork)} of {totalWork} records
            </span>
            <div className="flex items-center gap-1">
              <button disabled={workPage === 1} onClick={() => setWorkPage((p) => p - 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-colors">‹</button>
              {Array.from({ length: Math.min(5, totalWorkPages) }, (_, i) => {
                let start = Math.max(1, workPage - 2);
                if (start + 4 > totalWorkPages) start = Math.max(1, totalWorkPages - 4);
                const p = start + i;
                if (p > totalWorkPages) return null;
                return (
                  <button key={p} onClick={() => setWorkPage(p)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${p === workPage ? 'bg-[#0b3d91] text-white shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-600'}`}>{p}</button>
                );
              })}
              <button disabled={workPage >= totalWorkPages} onClick={() => setWorkPage((p) => p + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-colors">›</button>
            </div>
          </div>
        </div>

        {editingPO && <EditPOModal po={editingPO} onClose={() => setEditingPO(null)} onSave={() => {}} />}
      </div>
    </div>
  );
};

export default Dashboard;