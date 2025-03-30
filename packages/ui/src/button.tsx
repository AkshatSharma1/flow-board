"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outlined";
  className?: string;
  appName: string;
  size: "lg"|"sm";
  children: ReactNode
}

export const Button = ({ size, variant, className, appName, children }: ButtonProps) => {
  return (
    <button
      className={`${className} ${variant === "primary"?"bg-primary":""} ${size==="lg"?"px-4 py-2":"px-2 py-1"}`}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
