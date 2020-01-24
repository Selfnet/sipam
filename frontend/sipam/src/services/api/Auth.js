import axios from 'axios';


export default {
  async login(username, password) {
    const response = await axios.post('/jwt/', { username, password });
    return response;
  },
  async refresh(token) {
    if ('refresh' in token) {
      const response = await axios.post('/jwt/refresh/', { refresh: token.refresh });
      console.log(response);
      return response;
    }
    console.log('Cannot find a refresh token.');
    return undefined;
  },
  async verifyAccess(token) {
    if ('access' in token) {
      const response = await axios.post('/jwt/verify/', { token: token.access });
      return response;
    }
    console.log('Cannot find a access token.');
    return undefined;
  },
  async verifyRefresh(token) {
    if ('refresh' in token) {
      const response = await axios.post('/jwt/verify', { token: token.refresh });
      return response;
    }
    console.log('Cannot find a refresh token.');
    return undefined;
  },
};
