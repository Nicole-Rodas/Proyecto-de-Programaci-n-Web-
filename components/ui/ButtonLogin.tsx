"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils"; // si usas clsx o alguna función de clase opcional

interface ButtonLoginProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function ButtonLogin({ children, className, ...props }: ButtonLoginProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-white text-black border border-black rounded px-4 py-2 transition-colors duration-200 hover:bg-gray-200",
        className
      )}
    >
      {children}
    </button>
  );
}
