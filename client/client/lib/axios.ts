import axios from 'axios';

const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/?$/, '');
const baseURL = origin.includes('/api/v1') ? origin : `${origin}/api/v1`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});