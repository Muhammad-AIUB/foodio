import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="Foodio logo"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-serif text-xl font-bold text-primary">
                Foodio.
              </span>
            </div>
            <span className="text-sm text-text-muted">
              &copy; 2026 Foodio Inc.
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
