"use client";

import { useState } from 'react';
import { api } from '@/lib/axios';
import InputField from '../common/InputField';
import Button from '../common/Button';
import type { RegisterCredentials } from '@/types';
import type { AxiosError } from 'axios';

const INITIAL_CREDS: RegisterCredentials = { fullName: '', email: '', password: '', address: '' };

const getErrorMessage = (err: unknown): string => {
  const axiosErr = err as AxiosError<{ message?: string | string[] }>;
  const msg = axiosErr.response?.data?.message;
  const text = Array.isArray(msg) ? msg[0] : msg;
  return text ?? 'অ্যাকাউন্ট তৈরি করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।';
};

export default function RegisterForm() {
  const [credentials, setCredentials] = useState<RegisterCredentials>(INITIAL_CREDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/signup', credentials);
      setSuccess('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এবার লগইন করুন।');
      setCredentials(INITIAL_CREDS);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
      {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">{success}</div>}
      <InputField label="Full Name" type="text" name="fullName" placeholder="John Doe" value={credentials.fullName} onChange={handleChange} required />
      <InputField label="Email" type="email" name="email" placeholder="name@example.com" value={credentials.email} onChange={handleChange} required />
      <InputField label="Address" type="text" name="address" placeholder="e.g. House:23, Road:23, Jamaica, USA" value={credentials.address ?? ''} onChange={handleChange} />
      <InputField label="Password" type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
      <Button type="submit" disabled={loading} className={loading ? 'opacity-70 cursor-not-allowed' : ''}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
