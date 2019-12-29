import axios from 'axios';

export default {
  async getPools() {
    const response = await axios.get('/pool/');
    return response;
  },

  async createPool(pool) {
    const response = await axios.post('/pool/', pool);
    return response;
  },

  async updatePool(id, poolData) {
    const response = await axios.put(`/pool/${id}/`, poolData);
    return response;
  },

  async deletePool(id) {
    const response = await axios.delete(`/pool/${id}/`);
    return response;
  },

};
