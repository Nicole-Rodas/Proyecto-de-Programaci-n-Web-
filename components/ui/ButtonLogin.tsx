// components/ui/Button.tsx
import React from "react";

export const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`px-6 py-2 rounded-md text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
