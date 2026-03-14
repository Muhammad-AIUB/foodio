"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";
import Footer from "@/components/Footer";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Minimal Header - Logo only */}
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

      {/* Centered Auth Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          {/* Logo */}
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

          {/* Tab Switcher */}
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

          {/* Forms */}
          {activeTab === "signin" ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors mt-2"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. House:23, Road:23, Jamaica, USA"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors mt-2"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {/* Admin Panel Hint */}
        <div className="flex items-center gap-2 mt-6 text-text-muted text-sm">
          <Info className="w-4 h-4" />
          <span>For accessing Admin Panel press A from your keyboard.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
