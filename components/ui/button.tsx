import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

// Função para gerar classes de variantes - usada por outros componentes
export function buttonVariants({
  variant = "default",
  size = "md",
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
} = {}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline focus:ring-blue-500",
    destructive: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
}

export function Button({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
