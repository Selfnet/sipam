import axios from 'axios';

export default {
  async getCIDRs() {
    const response = await axios.get('/cidr/');
    return response.data;
  },

  async getCIDR(id: string) {
    const response = await axios.get(`/cidr/${id}`);
    return response.data;
  },

  async getChildren(id: string) {
    const response = await axios.get(`/cidr/${id}/subcidr/`);
    return response.data;
  },

  async searchCIDR(searchQuery: string) {
    const response = await axios.get('/cidr/', {
      params: {
        search: searchQuery,
      },
    });
    return response;
  },

  async createCIDR(cidr: any) {
    const response = await axios.post('/cidr/', cidr);
    return response;
  },

  async updateCIDR(id: string, cidrData: any) {
    const response = await axios.put(`/cidr/${id}/`, cidrData);
    return response;
  },

  async deleteCIDR(id: string) {
    const response = await axios.delete(`/cidr/${id}/`);
    return response;
  },

};
