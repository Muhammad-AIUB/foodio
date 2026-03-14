'use client';

import { CartProvider, useCart } from '@/components/providers/CartProvider';
import { AuthProvider, useAuth } from '@/components/providers/AuthProvider';
import Header from './Header';
import Footer from './Footer';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartCount={cartCount} isLoggedIn={isLoggedIn} />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </CartProvider>
  );
}
