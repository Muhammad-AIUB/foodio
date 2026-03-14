import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-600">Foodio. © 2026 Foodio Inc.</p>
        <nav className="flex gap-6">
          <Link href="/privacy" className="text-sm text-slate-500 hover:text-[#1A3C34]">Privacy</Link>
          <Link href="/terms" className="text-sm text-slate-500 hover:text-[#1A3C34]">Terms</Link>
          <Link href="/contact" className="text-sm text-slate-500 hover:text-[#1A3C34]">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
