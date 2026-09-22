import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { poApi } from '../api/poApi';
import DonutChart from '../components/DonutChart';
import PoTimeAnalysis from '../components/PoTimeAnalysis';
import KpiCard from '../components/KpiCard';
import OperationalInsights from '../components/OperationalInsights';
import { useAuth } from '../context/AuthContext';
import EditPOModal from '../components/EditPOModal';

const getPlantGroup = (code) => {
  const c = String(code || '').trim();
  if (c === '1079' || c === '2401') return 'CBCMP';
  if (c === '1078' || c === '2404') return 'KDCMP';
  return c || 'Unknown';
};

// Derive status for the badge
const deriveStatus = (po) => {
  if (po.status) return po.status;
  if (!po.ord_plant || !po.agency) return 'Pending';
  const days = parseInt(po.pr_po_days) || 0;
  if (days > 60) return 'In Progress';
  return 'Approved';
};

const statusStyles = {
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (n) => {
  const num = Number(n) || 0;
  return '₹ ' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

const Dashboard = () => {
  const { user } = useAuth();

  const [allPos, setAllPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedPlantGroup, setSelectedPlantGroup] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedEnqType, setSelectedEnqType] = useState(null);

  const [editingPO, setEditingPO] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const poRes = await poApi.getAll({ limit: 5000 });
      setAllPos(poRes.data.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedPlantGroup(null);
    setSelectedPlant(null);
    setSelectedEnqType(null);
    setPage(1);
  }, [search]);

  const handleDelete = async (id, poNo) => {
    if (window.confirm(`Are you sure you want to permanently delete PO: ${poNo}?`)) {
      setIsDeleting(id);
      try {
        await poApi.deletePO(id);
        await fetchData();
      } catch (err) {
        alert('Failed to delete PO: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSaveEdit = async () => {
    setEditingPO(null);
    await fetchData();
  };

  // ---------- FILTERING ----------
  const searchFilteredData = useMemo(() => {
    return allPos.filter((po) => {
      const searchLower = search.toLowerCase();
      return (
        !search ||
        (po.po_no && String(po.po_no).toLowerCase().includes(searchLower)) ||
        (po.agency && po.agency.toLowerCase().includes(searchLower)) ||
        (po.name_of_work && po.name_of_work.toLowerCase().includes(searchLower))
      );
    });
  }, [allPos, search]);

  // ---------- KPI CALCULATIONS ----------
  const kpis = useMemo(() => {
    const total = searchFilteredData.length;
    const totalValue = searchFilteredData.reduce((sum, po) => sum + (Number(po.value_inr) || 0), 0);
    const avgDays =
      total > 0
        ? searchFilteredData.reduce((sum, po) => sum + (Number(po.pr_po_days) || 0), 0) / total
        : 0;
    const avgWeeks = avgDays / 7;

    const pending = searchFilteredData.filter((po) => deriveStatus(po) === 'Pending').length;

    return { total, totalValue, avgWeeks, pending };
  }, [searchFilteredData]);

  // ---------- INSIGHTS CALCULATIONS ----------
  const insights = useMemo(() => {
    const total = searchFilteredData.length;
    const onTime = searchFilteredData.filter((po) => (Number(po.pr_po_days) || 0) <= 30).length;
    const onTimePct = total > 0 ? Math.round((onTime / total) * 100) : 0;
    const pending = searchFilteredData.filter((po) => deriveStatus(po) === 'Pending').length;
    const highValue = searchFilteredData.filter((po) => (Number(po.value_inr) || 0) > 1000000).length;
    const mou = searchFilteredData.filter((po) => po.enq_type === 'MOU').length;

    return { onTime, onTimePct, pending, highValue, mou };
  }, [searchFilteredData]);

  // ---------- CHART DATA ----------
  const plantGroupData = useMemo(() => {
    const counts = {};
    searchFilteredData.forEach((po) => {
      const group = getPlantGroup(po.ord_plant);
      if (group && group !== 'Unknown') counts[group] = (counts[group] || 0) + 1;
    });
    return { labels: Object.keys(counts), data: Object.values(counts) };
  }, [searchFilteredData]);

  const specificPlantData = useMemo(() => {
    if (!selectedPlantGroup) return { labels: [], data: [] };
    const counts = {};
    searchFilteredData
      .filter((po) => getPlantGroup(po.ord_plant) === selectedPlantGroup)
      .forEach((po) => {
        const code = String(po.ord_plant || '').trim();
        if (code && code !== 'Unknown') counts[code] = (counts[code] || 0) + 1;
      });
    return { labels: Object.keys(counts), data: Object.values(counts) };
  }, [searchFilteredData, selectedPlantGroup]);

  const enqTypeData = useMemo(() => {
    if (!selectedPlant) return { labels: [], data: [] };
    const counts = {};
    searchFilteredData
      .filter((po) => String(po.ord_plant).trim() === String(selectedPlant).trim())
      .forEach((po) => {
        const type = po.enq_type;
        if (type && type !== 'Unknown') counts[type] = (counts[type] || 0) + 1;
      });
    return { labels: Object.keys(counts), data: Object.values(counts) };
  }, [searchFilteredData, selectedPlant]);

  const tableData = useMemo(() => {
    return searchFilteredData.filter((po) => {
      const matchesGroup = !selectedPlantGroup || getPlantGroup(po.ord_plant) === selectedPlantGroup;
      const matchesPlant = !selectedPlant || String(po.ord_plant).trim() === String(selectedPlant).trim();
      const matchesEnqType = !selectedEnqType || po.enq_type === selectedEnqType;
      return matchesGroup && matchesPlant && matchesEnqType;
    });
  }, [searchFilteredData, selectedPlantGroup, selectedPlant, selectedEnqType]);

  const total = tableData.length;
  const paginatedData = tableData.slice((page - 1) * limit, page * limit);

  const getTitle = () => {
    if (!selectedPlantGroup) return 'Order Plant Group Overview';
    if (!selectedPlant) return `Plant Codes for ${selectedPlantGroup}`;
    if (!selectedEnqType) return `Enq Type Distribution - Plant ${selectedPlant}`;
    return `Purchase Orders - ${selectedPlantGroup} / ${selectedPlant} / ${selectedEnqType}`;
  };

  const currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-5">

      {/* ---------- BREADCRUMB + DATE ---------- */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-semibold text-blue-700">Home</span>
          <span>›</span>
          <span>Dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{currentDate}</span>
        </div>
      </div>

      {/* ---------- 4 KPI CARDS ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <KpiCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          title="Total Live POs"
          value={kpis.total.toLocaleString()}
          change="12%"
          changeType="up"
        />
        <KpiCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          title="Total PO Value"
          value={formatCurrency(kpis.totalValue)}
          change="8%"
          changeType="up"
        />
        <KpiCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          title="Average Completion Time"
          value={`${kpis.avgWeeks.toFixed(1)} Weeks`}
          change="18%"
          changeType="down"
        />
        <KpiCard
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          title="Pending / Attention Required"
          value={kpis.pending.toString()}
          change="3"
          changeType="up"
        />
      </div>

      {/* ---------- 3-COLUMN MAIN ROW ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5 items-stretch">
        {/* LEFT: Donut Chart */}
        <div className="lg:col-span-1">
          <DonutChart
            title={getTitle()}
            subtitle="Click on a Plant Group to view specific plant codes"
            labels={
              !selectedPlantGroup ? plantGroupData.labels :
              !selectedPlant ? specificPlantData.labels :
              enqTypeData.labels
            }
            data={
              !selectedPlantGroup ? plantGroupData.data :
              !selectedPlant ? specificPlantData.data :
              enqTypeData.data
            }
            onClick={(label) => {
              if (!selectedPlantGroup) setSelectedPlantGroup(label);
              else if (!selectedPlant) setSelectedPlant(label);
              else setSelectedEnqType(label);
            }}
          />
        </div>

        {/* MIDDLE: Bar Chart (2 cols wide) */}
        <div className="lg:col-span-2">
          <PoTimeAnalysis pos={searchFilteredData} compact={true} />
        </div>

        {/* RIGHT: Operational Insights */}
        <div className="lg:col-span-1">
          <OperationalInsights stats={insights} />
        </div>
      </div>

      {/* ---------- DATA TABLE ---------- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h2 className="text-sm font-bold text-gray-800">Live Purchase Orders</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search PO No, Creator, Agency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            {(selectedPlantGroup || selectedPlant || selectedEnqType) && (
              <button
                onClick={() => {
                  if (selectedEnqType) setSelectedEnqType(null);
                  else if (selectedPlant) setSelectedPlant(null);
                  else if (selectedPlantGroup) setSelectedPlantGroup(null);
                }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </button>
            )}

            <button className="px-3 py-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold border border-gray-200 flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </button>

            <button className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">PO No</th>
                <th className="px-4 py-3 font-semibold">Creator</th>
                <th className="px-4 py-3 font-semibold">Agency</th>
                <th className="px-4 py-3 font-semibold text-right">Value (INR)</th>
                <th className="px-4 py-3 font-semibold text-center">Enquiry Type</th>
                <th className="px-4 py-3 font-semibold text-center">Order Plant</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                {user?.role === 'admin' && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={user?.role === 'admin' ? 9 : 8} className="text-center py-12 text-gray-400">Loading data...</td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={user?.role === 'admin' ? 9 : 8} className="text-center py-12 text-gray-400">No records found.</td></tr>
              ) : (
                paginatedData.map((po) => {
                  const status = deriveStatus(po);
                  return (
                    <tr key={po.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-semibold text-gray-900">{po.po_no}</td>
                      <td className="px-4 py-3 text-gray-700 truncate max-w-[140px]">{po.creator_name}</td>
                      <td className="px-4 py-3 text-gray-700 truncate max-w-[180px]">{po.agency}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(po.value_inr)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold border border-blue-100">
                          {po.enq_type || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700">{po.ord_plant || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(po.date)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${statusStyles[status] || statusStyles['Pending']}`}>
                          {status}
                        </span>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingPO(po)}
                              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDelete(po.id, po.po_no)}
                              disabled={isDeleting === po.id}
                              className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50">
          <span className="text-xs text-gray-500">
            Showing {total === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, Math.ceil(total / limit) || 1) }, (_, i) => {
              const totalPages = Math.ceil(total / limit) || 1;
              let start = Math.max(1, page - 2);
              if (start + 4 > totalPages) start = Math.max(1, totalPages - 4);
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1.5 text-xs rounded-md transition ${
                    p === page
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
              className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white disabled:opacity-40 hover:bg-gray-50 transition"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {editingPO && (
        <EditPOModal po={editingPO} onClose={() => setEditingPO(null)} onSave={handleSaveEdit} />
      )}
    </div>
  );
};

export default Dashboard;