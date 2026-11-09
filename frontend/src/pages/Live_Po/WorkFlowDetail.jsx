// src/pages/WorkFlowDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workApi } from '../../api/poApi';
import { ArrowLeft, Clock, FileText, Megaphone, PackageOpen, Stamp } from 'lucide-react';

const formatCurrency = (n) => '₹ ' + (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

// BULLETPROOF Date Parser: Strictly assumes DD-MM-YYYY or DD.MM.YYYY
const parseDate = (dateStr) => {
  if (!dateStr || dateStr === 'NA' || dateStr === '-') return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const str = String(dateStr).trim();
  
  // Split by -, /, or .
  const parts = str.split(/[-/.]/);

  if (parts.length === 3) {
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const p3 = parseInt(parts[2], 10);

    // Check if it's YYYY-MM-DD (If the first part is a 4-digit year)
    if (p1 > 1000) {
      return new Date(Date.UTC(p1, p2 - 1, p3));
    }
    
    // Otherwise, strictly assume DD-MM-YYYY (First is Day, Second is Month, Third is Year)
    return new Date(Date.UTC(p3, p2 - 1, p1));
  }

  // Fallback for standard date strings
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

// Clean display format for the table (using UTC to prevent timezone shifting)
const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    timeZone: 'UTC' // Crucial: Keeps the exact date entered
  });
};

// Accurate Day Difference calculation using UTC
const getDaysDiff = (date1, date2) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  if (!d1 || !d2) return null;
  
  const utc1 = d1.getTime();
  const utc2 = d2.getTime();
  
  // Use Math.abs so if end date is entered before start date, it still calculates the gap
  const diffTime = Math.abs(utc2 - utc1);
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const WorkFlowDetail = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const [workCases, setWorkCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await workApi.getAll();
        setWorkCases(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stepConfig = {
    'pr-nit': { title: 'PR to NIT Timeline', icon: <FileText size={24} />, color: 'bg-[#13293D]' },
    'nit-bod': { title: 'NIT to BOD Timeline', icon: <Megaphone size={24} />, color: 'bg-[#0D9488]' },
    'bod-award': { title: 'BOD to Award Timeline (Completed < 30 Days)', icon: <PackageOpen size={24} />, color: 'bg-[#EA580C]' },
  }[step] || { title: 'Work Flow Details', icon: <Clock size={24} />, color: 'bg-gray-800' };

  const filteredData = useMemo(() => {
    let result = workCases.map(row => {
      let days = null;
      let d1, d2;

      if (step === 'pr-nit') {
        d1 = row.pr_date; d2 = row.nit_date;
      } else if (step === 'nit-bod') {
        d1 = row.nit_date; d2 = row.technical_bod;
      } else if (step === 'bod-award') {
        d1 = row.technical_bod; d2 = row.loi_date || row.po_date;
      }

      days = getDaysDiff(d1, d2);
      return { ...row, calculatedDays: days, startDate: d1, endDate: d2 };
    });

    // Filter out rows where days couldn't be calculated
    result = result.filter(r => r.calculatedDays !== null);

    // Specific filter for Award step
    if (step === 'bod-award') {
      result = result.filter(r => r.calculatedDays <= 30);
    }

    // Apply search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r => 
        String(r.dealing_executive).toLowerCase().includes(s) ||
        String(r.package).toLowerCase().includes(s) ||
        String(r.project).toLowerCase().includes(s)
      );
    }

    return result.sort((a, b) => a.calculatedDays - b.calculatedDays);
  }, [workCases, step, search]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-6 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className={`w-10 h-10 rounded-xl ${stepConfig.color} text-white flex items-center justify-center shadow-md`}>
                  {stepConfig.icon}
                </span>
                {stepConfig.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredData.length} Purchase Orders that make up this average.
              </p>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Search Executive, Package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 bg-white shadow-sm"
          />
        </div>

        {/* Timeline Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Executive</th>
                  <th className="px-6 py-4 font-semibold">Package</th>
                  <th className="px-6 py-4 font-semibold text-center">Start Date</th>
                  <th className="px-6 py-4 font-semibold text-center">End Date</th>
                  <th className="px-6 py-4 font-semibold text-center">Days Taken</th>
                  <th className="px-6 py-4 font-semibold text-right">Cost Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-400">Loading data...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-400">No records found for this timeline.</td></tr>
                ) : (
                  filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/30 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800">{row.dealing_executive}</td>
                      <td className="px-6 py-4 whitespace-normal max-w-[300px]">
                        <p className="font-medium text-gray-700 leading-relaxed line-clamp-2" title={row.package}>{row.package}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{row.project}</p>
                      </td>
                      {/* Displaying formatted dates */}
                      <td className="px-6 py-4 text-center font-medium text-gray-600 bg-gray-50/50">{formatDate(row.startDate)}</td>
                      <td className="px-6 py-4 text-center font-medium text-gray-600 bg-gray-50/50">{formatDate(row.endDate)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold border ${
                          row.calculatedDays <= 15 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          row.calculatedDays <= 30 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <Clock size={12} />
                          {row.calculatedDays} Days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-800">
                        {formatCurrency(row.cost_estimate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkFlowDetail;