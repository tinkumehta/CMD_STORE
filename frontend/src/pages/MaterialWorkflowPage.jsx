// src/pages/MaterialWorkflowPage.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MaterialWorkflowDashboard from '../components/store/MaterialWorkflowDashboard';

const MaterialWorkflowPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-r from-[#EDE0D3] via-[#F0C9C9] to-[#EBDFF2]">
      <div className="max-w-[1600px] mx-auto px-4 py-5">
        
        {/* Header with Back Button */}
        <div className="mb-5 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">  Material Workflow Analytics</h1>
            <p className="text-sm text-gray-500">Detailed breakdown of PO Origination, Delivery, and Payments</p>
          </div>
        </div>

        {/* The Detailed Infographic */}
        <MaterialWorkflowDashboard />
        
      </div>
    </div>
  );
};

export default MaterialWorkflowPage;