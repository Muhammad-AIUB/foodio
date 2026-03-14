"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import type { AxiosError } from "axios";

function getErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string | string[] }>;
  const msg = e.response?.data?.message;
  if (Array.isArray(msg)) return msg[0] ?? "Something went wrong";
  return msg ?? "Something went wrong";
}

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      window.sessionStorage.setItem(
        "auth_success_message",
        "Registration successful! Please log in."
      );
      router.push("/sign-in");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="Foodio logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-serif text-2xl font-bold text-primary">
                Foodio.
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl font-bold text-primary">
              Create Account
            </h1>
            <p className="text-text-muted text-sm mt-2">
              Register first, then sign in manually.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                minLength={8}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
