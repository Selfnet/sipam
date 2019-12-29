import axios from 'axios';


export default {
  async getCSRF(request) {
    console.log(request);
  },
  async isLoggedIn() {
    console.log(axios.get(''));
  },
  async loginFailed(request) {
    console.log(request);
    console.log(request.response);
    console.log('Cannot login.');
    return false;
  },
  async loginSuccessful(request) {
    console.log(request);
    console.log(request.data);
    return true;
  },
  async login(username, password) {
    await axios({
      method: 'get', url: '/auth/login/', baseURL: 'http://127.0.0.1:8000',
    })
      .then(request => this.getCSRF(request))
      .catch(request => console.log(request));
    await axios({
      method: 'post', url: '/auth/login/', auth: { username, password }, baseURL: 'http://127.0.0.1:8000',
    })
      .then(request => this.loginSuccessful(request))
      .catch(request => console.log(request));
  },

};
