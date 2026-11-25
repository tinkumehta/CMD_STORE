// src/pages/ChartDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { poApi } from '../api/poApi';
import { CHART_CONFIGS, getPlantGroup, getFiscalYear } from '../config/charts';
import DonutChart from '../components/PieChart/DonutChart';

const formatCurrency = (n) => '₹ ' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const formatDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// --- Builders for Plant Code Drill-down ---
const buildPlantCodeCounts = (pos) => {
  const counts = {};
  pos.forEach((po) => {
    const code = String(po.ord_plant || '').trim();
    if (code && code !== 'Unknown') counts[code] = (counts[code] || 0) + 1;
  });
  return { labels: Object.keys(counts), data: Object.values(counts) };
};

const buildEnqTypeCounts = (pos, plantCode) => {
  const counts = {};
  pos
    .filter((po) => String(po.ord_plant).trim() === String(plantCode).trim())
    .forEach((po) => {
      const t = String(po.enq_type || '').trim();
      if (t && t !== 'Unknown' && t !== 'NA' && t !== 'N/A') {
        counts[t] = (counts[t] || 0) + 1;
      }
    });
  return { labels: Object.keys(counts), data: Object.values(counts) };
};

const ChartDetail = () => {
  const { chartId } = useParams();
  const navigate = useNavigate();
  const [allPos, setAllPos] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedFY, setSelectedFY] = useState(null);
  const [selectedPlantCode, setSelectedPlantCode] = useState(null);
  const [selectedEnqType, setSelectedEnqType] = useState(null);

  const config = CHART_CONFIGS.find((c) => c.id === chartId);

  // ---------- Fetch ----------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await poApi.getAll({ limit: 5000 });
        setAllPos(res.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------- Reset state when chartId changes ----------
  useEffect(() => {
    setSelectedFY(null);
    setSelectedPlantCode(null);
    setSelectedEnqType(null);
  }, [chartId]);

  // ---------- Extract Available Fiscal Years ----------
  const availableFYs = useMemo(() => {
    const years = new Set();
    allPos.forEach((po) => {
      const fy = getFiscalYear(po.date);
      if (fy !== 'Unknown') years.add(fy);
    });
    return Array.from(years).sort().reverse(); // Newest first
  }, [allPos]);

  // ---------- Filter data by Fiscal Year ----------
  const fyFilteredPos = useMemo(() => {
    if (!selectedFY) return allPos;
    return allPos.filter((po) => getFiscalYear(po.date) === selectedFY);
  }, [allPos, selectedFY]);

  // ---------- Chart data ----------
  const chartData = useMemo(() => {
    if (!config?.getData) return { labels: [], data: [] };

    // If NO FY is selected, show a preview of the chart (or empty)
    if (!selectedFY) return { labels: [], data: [] };

    // Level 1: Plant Codes for the selected FY
    if (!selectedPlantCode) return buildPlantCodeCounts(fyFilteredPos);

    // Level 2: Enquiry Types for the selected Plant Code
    if (!selectedEnqType) return buildEnqTypeCounts(fyFilteredPos, selectedPlantCode);

    // Level 3: Show the clicked Enq Type
    const enqCounts = buildEnqTypeCounts(fyFilteredPos, selectedPlantCode);
    const matchIdx = enqCounts.labels.indexOf(selectedEnqType);
    if (matchIdx >= 0) {
      return { labels: [enqCounts.labels[matchIdx]], data: [enqCounts.data[matchIdx]] };
    }
    return { labels: [], data: [] };
  }, [config, fyFilteredPos, selectedFY, selectedPlantCode, selectedEnqType]);

  // ---------- Filtered POs (final table) ----------
  const filteredPOs = useMemo(() => {
    if (!selectedEnqType) return [];
    return fyFilteredPos.filter((po) => {
      const matchesCode = String(po.ord_plant).trim() === String(selectedPlantCode).trim();
      const matchesEnq = String(po.enq_type || '').trim() === selectedEnqType;
      return matchesCode && matchesEnq;
    });
  }, [fyFilteredPos, selectedPlantCode, selectedEnqType]);

  // ---------- Handlers ----------
  const handleChartClick = (label) => {
    if (!selectedFY) return; // Must select FY first
    if (!selectedPlantCode) {
      setSelectedPlantCode(label); // Clicked a Plant Code
    } else if (!selectedEnqType) {
      setSelectedEnqType(label); // Clicked an Enq Type
    }
  };

  const handleBack = () => {
    if (selectedEnqType) setSelectedEnqType(null);
    else if (selectedPlantCode) setSelectedPlantCode(null);
    else if (selectedFY) setSelectedFY(null);
  };

  const handleResetAll = () => {
    setSelectedFY(null);
    setSelectedPlantCode(null);
    setSelectedEnqType(null);
  };

  // ---------- Chart title & subtitle ----------
  const getChartTitle = () => {
    if (!selectedFY) return 'Select a Fiscal Year';
    if (!selectedPlantCode) return `Plant Codes · ${selectedFY}`;
    if (!selectedEnqType) return `Enquiry Types · Plant ${selectedPlantCode}`;
    return `${selectedEnqType} · Plant ${selectedPlantCode}`;
  };

  const getChartSubtitle = () => {
    if (!selectedFY) return 'Choose a year to begin drill-down';
    if (!selectedPlantCode) return 'Click a plant code to view enquiry types';
    if (!selectedEnqType) return 'Click an enquiry type to view all POs';
    return `${filteredPOs.length} POs found`;
  };

  if (!config) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-lg font-bold text-gray-800">Chart not found</h1>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 min-h-screen bg-linear-to-r from-[#EDE0D3] via-[#F0C9C9] to-[#EBDFF2]">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-white bg-linear-to-r from-[#1717B0] to-[#34BDD9] px-3 py-1.5 rounded-full shadow-sm w-fit mb-5">
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-xs text-black bg-linear-to-r from-[#95F5BD] to-[#E8DF8B] px-3 py-1.5 rounded-full shadow-sm w-fit mb-5">
            <h1 className="text-xl font-bold">{getChartTitle()}</h1>
            <br/>
            <p className="text-xs mt-0.5">{getChartSubtitle()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(selectedFY || selectedPlantCode || selectedEnqType) && (
            <button onClick={handleBack} className="px-4 py-2 text-xs bg-gray-600 text-white rounded-full font-bold hover:bg-black transition">← Back</button>
          )}
          {(selectedFY || selectedPlantCode || selectedEnqType) && (
            <button onClick={handleResetAll} className="px-4 py-2 text-xs bg-black text-white rounded-full font-bold hover:bg-gray-700 transition">Reset All</button>
          )}
        </div>
      </div>

      {/* NEW: Fiscal Year Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-gray-600 mr-2">Filter by Fiscal Year:</span>
        {availableFYs.map((fy) => (
          <button
            key={fy}
            onClick={() => {
              setSelectedFY(fy);
              setSelectedPlantCode(null);
              setSelectedEnqType(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
              selectedFY === fy
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {fy}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-100 rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        {loading ? (
          <div className="h-72 flex items-center justify-center text-gray-400">Loading chart…</div>
        ) : !selectedFY ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-500">
            <p className="text-lg font-bold">Select a Fiscal Year above to load data</p>
          </div>
        ) : (
          <DonutChart labels={chartData.labels} data={chartData.data} onClick={handleChartClick} />
        )}
      </div>

      {/* Filtered Table */}
      {filteredPOs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">
              {selectedEnqType} POs · Plant {selectedPlantCode} · <span className="text-blue-600">{filteredPOs.length}</span>
            </h2>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold">PO No</th>
                  <th className="px-4 py-3 font-semibold">Creator</th>
                  <th className="px-4 py-3 font-semibold">Agency</th>
                  <th className="px-4 py-3 font-semibold text-right">Value</th>
                  <th className="px-4 py-3 font-semibold text-center">Enq Type</th>
                  <th className="px-4 py-3 font-semibold text-center">Plant</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-blue-50/40 transition">
                    <td className="px-4 py-2.5 font-mono font-bold text-[#0b3d91]">{po.po_no}</td>
                    <td className="px-4 py-2.5 text-gray-700 truncate max-w-[140px]">{po.creator_name || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-700 truncate max-w-[180px]">{po.agency || '—'}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">{formatCurrency(po.value_inr)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100">{po.enq_type || '—'}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold">{po.ord_plant || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">{formatDate(po.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDetail;