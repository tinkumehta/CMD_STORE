import axiosClient from './axiosClient';

export const poApi = {
  // Matches your backend: GET /api/purchase-orders
  getAll: async (params) => {
    return axiosClient.get('/purchase-orders', { params });
  },
  
  // Matches your backend: GET /api/stats/enq-type
  getEnqTypeStats: async () => {
    return axiosClient.get('/stats/enq-type');
  },

  // Add to poApi object
updatePO: async (id, data) => {
  return axiosClient.put(`/admin/purchase-orders/${id}`, data);
},
deletePO: async (id) => {
  return axiosClient.delete(`/admin/purchase-orders/${id}`);
},

  // Matches your backend: POST /api/admin/upload
  uploadExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};