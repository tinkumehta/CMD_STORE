// src/pages/UploadMaterialData.jsx
import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UploadMaterialData() {
  const navigate = useNavigate();
  const [matFile, setMatFile] = useState(null);
  const [payFile, setPayFile] = useState(null);
  
  const [matStatus, setMatStatus] = useState({ loading: false, msg: '', type: '' });
  const [payStatus, setPayStatus] = useState({ loading: false, msg: '', type: '' });

  const handleUpload = async (type, file, setStatus) => {
    if (!file) {
      setStatus({ loading: false, msg: 'Please select a file first.', type: 'error' });
      return;
    }

    setStatus({ loading: true, msg: 'Uploading & Parsing...', type: 'info' });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'material' ? '/api/material-pos/upload' : '/api/payment-statuses/upload';
      
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setStatus({ 
        loading: false, 
        msg: data.message || 'Upload successful!', 
        type: 'success' 
      });
      
      if (type === 'material') setMatFile(null);
      else setPayFile(null);

    } catch (err) {
      setStatus({ loading: false, msg: err.message, type: 'error' });
    }
  };

  const renderUploadCard = (title, type, file, setFile, status, setStatus, color) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center shadow-md`}>
          <FileSpreadsheet size={20} />
        </div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-4 group">
          <UploadCloud size={32} className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
          <span className="text-xs font-semibold text-gray-600 text-center">
            {file ? file.name : 'Click to browse or drag & drop'}
          </span>
          <span className="text-[10px] text-gray-400 mt-1">Only .xlsx, .xls allowed</span>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setStatus({ loading: false, msg: '', type: '' });
            }} 
          />
        </label>

        <button
          onClick={() => handleUpload(type, file, setStatus)}
          disabled={!file || status.loading}
          className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition-all flex items-center justify-center gap-2
            ${!file || status.loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0b3d91] hover:bg-blue-800 shadow-md'}`}
        >
          {status.loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {status.loading ? 'Uploading...' : 'Upload Data'}
        </button>

        {status.msg && (
          <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 
            status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 
            'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            {status.type === 'success' && <CheckCircle size={14} className="mt-0.5 shrink-0" />}
            {status.type === 'error' && <AlertCircle size={14} className="mt-0.5 shrink-0" />}
            <span className="leading-tight">{status.msg}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Data Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderUploadCard(
          'Upload Material POs', 
          'material', 
          matFile, 
          setMatFile, 
          matStatus, 
          setMatStatus, 
          'bg-gradient-to-br from-blue-500 to-indigo-600'
        )}
        {renderUploadCard(
          'Upload Payment Status', 
          'payment', 
          payFile, 
          setPayFile, 
          payStatus, 
          setPayStatus, 
          'bg-gradient-to-br from-orange-500 to-amber-600'
        )}
      </div>
    </div>
  );
}