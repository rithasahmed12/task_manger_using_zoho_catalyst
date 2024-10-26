import axios from 'axios';
import store from '../redux/store/store';

const api = axios.create({
  baseURL: '/server/task_master_function',
});

// api.interceptors.request.use((config) => {
//   const state = store.getState();
//   const token = state.user.userInfoTh;
  
  
//   if (token) {
//     config.headers.authorization = `${token}`;
//   }
//   return config;
// });

export default api;