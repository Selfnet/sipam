import axios from 'axios';


export default {
  async login(username: string, password: string) {
    const response = await axios.post('/jwt/', { username, password });
    return response;
  },
  async refresh(token: any) {
    if ('refresh' in token) {
      const response = await axios.post('/jwt/refresh/', { refresh: token.refresh });
      return response;
    }
    console.log('Cannot find a refresh token.');
    return undefined;
  },
  async verifyAccess(token: any) {
    if ('access' in token) {
      const response = await axios.post('/jwt/verify/', { token: token.access });
      return response;
    }
    console.log('Cannot find a access token.');
    return undefined;
  },
  async verifyRefresh(token: any) {
    if ('refresh' in token) {
      const response = await axios.post('/jwt/verify', { token: token.refresh });
      return response;
    }
    console.log('Cannot find a refresh token.');
    return undefined;
  },
};
