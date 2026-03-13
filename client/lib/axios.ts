import axios from 'axios';

const origin = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const api = axios.create({
  baseURL: `${origin}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});