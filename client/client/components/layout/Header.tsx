'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/axios';
import AuthContainer from '@/components/auth/AuthContainer';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Food Menu' },
  { href: '/orders', label: 'My Orders' },
];

export default function Header({ cartCount = 0, isLoggedIn = false }: { cartCount?: number; isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await api.post('/auth/signout');
    setUserOpen(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="h-0.5 w-full bg-[#1A3C34]" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-[#1A3C34]">
          <span className="text-2xl">🍔</span>
          Foodio.
        </Link>

        <nav className="hidden gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-[#FEF7EA] text-[#1A3C34] underline decoration-[#1A3C34] decoration-2 underline-offset-4'
                  : 'text-slate-600 hover:text-[#1A3C34] hover:bg-[#FEF7EA]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative flex items-center gap-1 text-slate-700 hover:text-[#1A3C34]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1A3C34] text-xs font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen(!userOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <p className="px-4 py-2 text-xs text-slate-500">My Account</p>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setUserOpen(false)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Orders
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4l-8 8 8 8" />
                    </svg>
                    Signout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#1A3C34] px-4 py-2 text-sm font-medium text-white hover:bg-[#152d28]"
            >
              Sign In
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {authOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-400/40 p-4" onClick={() => setAuthOpen(false)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <AuthContainer onSuccess={() => { setAuthOpen(false); window.location.reload(); }} />
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50"
              onClick={() => setAuthOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
