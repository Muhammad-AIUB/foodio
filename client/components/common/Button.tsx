import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full bg-[#1a362d] text-white font-medium py-3 rounded-xl mt-6 hover:bg-[#122620] transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
