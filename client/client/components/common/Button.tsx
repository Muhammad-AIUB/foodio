import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full bg-[#1A3C34] text-white font-medium py-3 rounded-xl mt-6 hover:bg-[#152d28] transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
