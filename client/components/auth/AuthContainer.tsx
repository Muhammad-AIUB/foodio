"use client";

import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const tabStyles = (active: boolean) =>
  `flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
    active ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'
  }`;

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#faf9f6] p-8 shadow-2xl">
      <header className="mb-8 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-[#1a362d]">
          <span className="text-2xl">🍔</span> Foodio.
        </h1>
        <p className="mt-2 text-sm text-gray-500">Premium flavors, delivered.</p>
      </header>

      <div className="mb-8 flex rounded-full bg-[#f0eee9] p-1">
        <button type="button" onClick={() => setIsLogin(true)} className={tabStyles(isLogin)}>
          Sign in
        </button>
        <button type="button" onClick={() => setIsLogin(false)} className={tabStyles(!isLogin)}>
          Register
        </button>
      </div>

      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
