"use client";

import { useState } from 'react';
import { api } from '@/lib/axios';
import InputField from '../common/InputField';
import Button from '../common/Button';
import type { RegisterCredentials } from '@/types';
import type { AxiosError } from 'axios';

const INITIAL_CREDS: RegisterCredentials = { name: '', email: '', password: '' };

const getErrorMessage = (err: unknown): string => {
  const axiosErr = err as AxiosError<{ message?: string | string[] }>;
  const msg = axiosErr.response?.data?.message;
  const text = Array.isArray(msg) ? msg[0] : msg;
  return text ?? 'অ্যাকাউন্ট তৈরি করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।';
};

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
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
      await api.post('/auth/register', credentials);
      setSuccess('Account created!');
      setCredentials(INITIAL_CREDS);
      onSuccess?.();
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
      <InputField label="Name" type="text" name="name" placeholder="John Doe" value={credentials.name} onChange={handleChange} required />
      <InputField label="Email" type="email" name="email" placeholder="name@example.com" value={credentials.email} onChange={handleChange} required />
      <InputField label="Password" type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
      <Button type="submit" disabled={loading} className={loading ? 'opacity-70 cursor-not-allowed' : ''}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
