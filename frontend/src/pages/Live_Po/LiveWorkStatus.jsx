// src/pages/LiveWorkStatus.jsx
import { useEffect, useState } from 'react';
import { workApi } from '../../api/poApi';

const formatCurrency = (n) => '₹ ' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const LiveWorkStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await workApi.getAll({ search });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Work Status</h1>
          <p className="text-sm text-gray-500">CB & KDCMP Shared Service - Contracts & Purchase Cases</p>
        </div>
        <input
          type="text"
          placeholder="Search Executive, Package, Agency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">S.N</th>
                <th className="px-4 py-3 font-semibold">Executive</th>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold max-w-[250px]">Package</th>
                <th className="px-4 py-3 font-semibold text-right">Cost Estimate</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold">PR No / Date</th>
                <th className="px-4 py-3 font-semibold">Status / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="9" className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-10 text-gray-400">No records found.</td></tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                        row.case_type === 'Contract' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {row.case_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-700">{row.sr_no}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">{row.dealing_executive}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#0b3d91]">{row.project}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-normal min-w-[300px] max-w-[400px] leading-relaxed">
                      {row.package}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {formatCurrency(row.cost_estimate)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex flex-col">
                        <span>{row.mode_of_tendering}</span>
                        <span className="text-[10px] text-gray-400">{row.tendering_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-semibold">{row.pr_no}</span>
                        <span className="text-[10px] text-gray-400">{row.pr_date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.status && (
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold mb-1">
                          {row.status}
                        </span>
                      )}
                      <p className="text-gray-500 text-[11px] whitespace-normal min-w-[300px] max-w-[400px] leading-relaxed line-clamp-3" title={row.remarks}>
                        {row.remarks}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default LiveWorkStatus;