import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://newinterntask.onrender.com/api' });

// helper to set token
export const setToken = (token) => {
    if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete API.defaults.headers.common['Authorization'];
};

export default API;
