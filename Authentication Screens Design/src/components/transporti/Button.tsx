import React from "react";
import { cn } from "../ui/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "default",
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1464F6] disabled:pointer-events-none disabled:opacity-50 disabled:bg-[#AFAFAF] disabled:text-white";
  
  const variants = {
    primary: "bg-[#1464F6] text-white hover:bg-[#1464F6]/90 rounded-[48px]",
    secondary: "bg-[#E9E9E9] text-[#1A1A1A] hover:bg-[#E9E9E9]/80 rounded-[12px]",
    outline: "border border-[#E9E9E9] bg-transparent hover:bg-[#F6F6F6] text-[#1A1A1A] rounded-[12px]",
    ghost: "hover:bg-[#F6F6F6] text-[#1464F6] hover:text-[#1464F6]/90 rounded-[12px]",
  };

  const sizes = {
    default: "h-[48px] px-6 py-2 text-[16px]",
    lg: "h-[56px] px-8 py-3 text-[18px]",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
};
