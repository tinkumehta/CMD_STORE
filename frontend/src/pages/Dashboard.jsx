import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { poApi } from '../api/poApi';
import PieChart from '../components/PieChart';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth(); // Check if user is logged in
  const [pos, setPos] = useState([]);
  const [enqStats, setEnqStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch POs (Publicly accessible now)
        const poRes = await poApi.getAll({ page, limit, search });
        setPos(poRes.data.data);
        setTotal(poRes.data.total);

        // Fetch Enq Type stats (Publicly accessible now)
        if (enqStats.length === 0) {
          const statsRes = await poApi.getEnqTypeStats();
          setEnqStats(statsRes.data);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search]);

  const ordPlantData = useMemo(() => {
    const counts = {};
    pos.forEach(po => {
      const plant = po.ord_plant || 'Unknown';
      counts[plant] = (counts[plant] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      data: Object.values(counts),
    };
  }, [pos]);

  const enqTypeData = {
    labels: enqStats.map(s => s.enq_type || 'Unknown'),
    data: enqStats.map(s => parseInt(s.count, 10)),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Welcome Banner for Admins */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span className="font-medium">Welcome, Admin! You have full access.</span>
          <Link to="/upload" className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition">
            Upload Excel File
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Public Dashboard Overview</h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PieChart 
          title="Ord. Plant Distribution" 
          labels={ordPlantData.labels} 
          data={ordPlantData.data} 
        />
        <PieChart 
          title="Enq Type Distribution" 
          labels={enqTypeData.labels} 
          data={enqTypeData.data} 
        />
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">Search Purchase Orders</h2>
          <input
            type="text"
            placeholder="Search PO, Agency, Work..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">PO No</th>
                <th className="px-6 py-3">Creator</th>
                <th className="px-6 py-3">Agency</th>
                <th className="px-6 py-3">Value (INR)</th>
                <th className="px-6 py-3">Enq Type</th>
                <th className="px-6 py-3">Ord. Plant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10">Loading data...</td></tr>
              ) : pos.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10">No records found.</td></tr>
              ) : (
                pos.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{po.po_no}</td>
                    <td className="px-6 py-4">{po.creator_name}</td>
                    <td className="px-6 py-4">{po.agency}</td>
                    <td className="px-6 py-4">{parseFloat(po.value_inr).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {po.enq_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{po.ord_plant}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-500">
            Page {page} of {Math.ceil(total / limit) || 1}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              disabled={page >= Math.ceil(total / limit)} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;