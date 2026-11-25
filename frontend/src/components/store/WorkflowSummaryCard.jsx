// src/components/store/WorkflowSummaryCard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, IndianRupee, ArrowRight, PackageCheck } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cr = (n) => '₹' + (Number(n) / 10000000).toFixed(2) + ' Cr';

export default function WorkflowSummaryCard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [matRes, payRes] = await Promise.all([
          fetch(`${API}/api/material-pos/workflow-stats`).then(r => r.json()),
          fetch(`${API}/api/payment-statuses/workflow-stats`).then(r => r.json()),
        ]);
        setData({ mat: matRes, pay: payRes });
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!data) return <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-700 h-full flex items-center overflow-hidden group/flow justify-center text-gray-700">Loading...</div>;

  return (
   <div className="bg-[#90f69e] rounded-2xl shadow-sm border  border-gray-700 overflow-hidden h-full flex flex-col group/flow">
      <div className="bg-[#15a531] py-3 px-4 text-center items-center justify-center gap-2">
      
        <h2 className="text-white text-xl text-center  font-bold tracking-wide ">Store Department Dashboard</h2>
          {/* <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageCheck size={16} />
          </span> */}
        </div>

        <div className="space-y-4 m-5">
          {/* Stage 1 Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center m-3 justify-center">
                <Truck size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold  text-black">Total Material POs</p>
                <p className="text-sm font-bold text-black">{data.mat.distinct_pos || 0}</p>
              </div>
            </div>
            <div className="text-right mr-5">
              <p className="text-[15px] font-bold text-black">Value</p>
              <p className="text-sm font-bold text-black">{cr(data.mat.total_value)}</p>
            </div>
          </div>

          {/* Stage 3 Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center m-3 justify-center">
                <IndianRupee size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-black">Invoices Generated</p>
                <p className="text-sm font-bold text-black">{data.pay.documents || 0}</p>
              </div>
            </div>
            <div className="text-right mr-5">
              <p className="text-[15px] font-bold text-black">Pending Pay</p>
              <p className="text-sm font-bold text-red-600">{cr(data.pay.blocked?.value || 0)}</p>
            </div>
          </div>
        </div>
      

      <button 
        onClick={() => navigate('/material-workflow')}
        className="mt-4 mb-5 cursor-pointer w-90 ml-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        View Details <ArrowRight size={14} />
      </button>
    </div>
  );
}