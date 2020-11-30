import axios from 'axios';

export default {
  async getPools() {
    const response = await axios.get('/pool/');
    return response;
  },

  async createPool(pool: any) {
    const response = await axios.post('/pool/', pool);
    return response;
  },

  async updatePool(id: string, poolData: any) {
    const response = await axios.put(`/pool/${id}/`, poolData);
    return response;
  },

  async deletePool(id: string) {
    const response = await axios.delete(`/pool/${id}/`);
    return response;
  },

  async assign(id: string, assignmentData: any) {
    const response = await axios.post(`/pool/${id}/assign/`, assignmentData);
    return response;
  },
};
