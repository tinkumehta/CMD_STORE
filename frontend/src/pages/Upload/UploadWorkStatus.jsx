// src/pages/UploadWorkStatus.jsx
import { useState, useRef } from 'react';
import { workApi } from '../../api/poApi';

const UploadWorkStatus = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus({ type: 'error', message: 'Please select a file.' });

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await workApi.uploadExcel(file);
      setStatus({ type: 'success', message: response.data.message });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Error uploading file. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-[#0f2e9e] to-[#1e85ec] p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Upload Live Work Status</h1>
          <p className="text-blue-100 text-sm mt-1">CB & KDCMP Shared Service (Contracts & Purchase)</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* Dropzone */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-blue-50/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="mt-3 text-xs text-gray-400">Only .xlsx and .xls files are supported</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing Excel Data...
                </span>
              ) : 'Upload & Save Status'}
            </button>
          </form>

          {/* Status Message */}
          {status.message && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium border flex items-start gap-3 ${
              status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span>{status.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadWorkStatus;