"use client";

import { useState } from 'react';
import { api } from '@/lib/axios';
import InputField from '../common/InputField';
import Button from '../common/Button';
import type { LoginCredentials } from '@/types';
import type { AxiosError } from 'axios';

const getErrorMessage = (err: unknown): string => {
  const axiosErr = err as AxiosError<{ message?: string }>;
  return axiosErr.response?.data?.message ?? 'লগইন করতে সমস্যা হচ্ছে। ইমেইল বা পাসওয়ার্ড চেক করুন।';
};

export default function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post<{ accessToken?: string; token?: string }>('/auth/signin', credentials);
      const token = data.accessToken ?? data.token;
      if (token) {
        localStorage.setItem('accessToken', token);
        // TODO: Redirect to dashboard
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      <InputField label="Email" type="email" name="email" placeholder="name@example.com" value={credentials.email} onChange={handleChange} required />
      <InputField label="Password" type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
      <Button type="submit" disabled={loading} className={loading ? 'opacity-70 cursor-not-allowed' : ''}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
