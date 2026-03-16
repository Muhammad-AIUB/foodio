'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function AuthInit() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const checkCartExpiration = useCartStore((s) => s.checkCartExpiration);

  useEffect(() => {
    checkAuth();
    checkCartExpiration();
  }, [checkAuth, checkCartExpiration]);

  return null;
}
