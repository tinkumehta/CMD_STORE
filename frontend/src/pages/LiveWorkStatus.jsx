// src/pages/LiveWorkStatus.jsx
import { useEffect, useState } from 'react';
import { workApi } from '../api/poApi';

const formatCurrency = (n) =>
  '₹ ' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const LiveWorkStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10; // Show 10 items per page

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await workApi.getAll({ search });
        setData(res.data);
        setPage(1); // Reset to page 1 on new search
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const delay = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(delay);
  }, [search]);

  // Calculate pagination
  const total = data.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Live Work Status (CB & KDCMP)</h1>
          <p className="text-xs text-gray-500 mt-1">Live status of all Contract & Purchase cases</p>
        </div>
        <input
          type="text"
          placeholder="Search Executive, Package, Agency, PR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 bg-gray-50 focus:bg-white transition"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-[#0f2e9e] text-white uppercase text-[10px] tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4 font-semibold">Type</th>
                {/* S.N column removed */}
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    Loading data...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          row.case_type === 'Contract'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {row.case_type}
                      </span>
                    </td>
                    {/* S.N td removed */}
                    <td className="px-4 py-4 text-gray-800 font-semibold">{row.dealing_executive}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#0b3d91] bg-blue-50 px-2 py-1 rounded-md">
                        {row.project}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-normal text-[11px] leading-relaxed max-w-[350px]">
                      {row.package}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-gray-800">
                      {formatCurrency(row.cost_estimate)}
                    </td>
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
                      {row.status && (
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold mb-1">
                          {row.status}
                        </span>
                      )}
                      <p className="text-gray-500 line-clamp-4" title={row.remarks}>
                        {row.remarks || '—'}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50 mt-auto">
          <span className="text-xs text-gray-500">
            Showing {total === 0 ? 0 : (page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, total)} of {total} records
          </span>
          
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let start = Math.max(1, page - 2);
              if (start + 4 > totalPages) start = Math.max(1, totalPages - 4);
              const p = start + i;
              if (p > totalPages) return null;
              
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    p === page
                      ? 'bg-[#0b3d91] text-white shadow-sm'
                      : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveWorkStatus;