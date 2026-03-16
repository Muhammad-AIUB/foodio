"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import type { AxiosError } from "axios";

function getErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string | string[] }>;
  const msg = e.response?.data?.message;
  if (Array.isArray(msg)) return msg[0] ?? "Something went wrong";
  return msg ?? "Something went wrong";
}

export default function SignInPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    const message = window.sessionStorage.getItem("auth_success_message");
    if (!message) return;
    setSuccessMessage(message);
    window.sessionStorage.removeItem("auth_success_message");
  }, []);

  useEffect(() => {
    if (isLoading || !user) return;
    router.replace(user.role === "ADMIN" ? "/admin" : "/my-orders");
  }, [isLoading, user, router]);

  if (!isLoading && user) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const user = await login(signInEmail, signInPassword);
      if (!user) {
        setError("Invalid email or password.");
        return;
      }
      const role = user.role;
      setSuccessMessage("Welcome back!");
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      const message = "Registration successful! Please log in.";
      window.sessionStorage.setItem("auth_success_message", message);
      setSuccessMessage(message);
      setActiveTab("signin");
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
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
            </div>
            <p className="text-text-muted text-sm">
              Premium flavors, delivered.
            </p>
          </div>

          <div className="flex bg-accent rounded-full p-1 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === "signin"
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === "register"
                  ? "bg-primary text-white shadow-sm"
                  : "text-primary"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
          {activeTab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
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
                  placeholder="Min 8 characters"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors mt-2 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
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
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
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
                  placeholder="Min 8 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors mt-2 disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6 text-text-muted text-sm">
          <Info className="w-4 h-4" />
          <span>For accessing Admin Panel press A from your keyboard.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
