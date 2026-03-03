import React, { useState } from "react";
import { cn } from "../ui/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, isPassword = false, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[14px] font-medium text-[#444444] ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              "flex h-[56px] w-full rounded-[16px] border border-[#E9E9E9] bg-[#FCFCFC] px-4 py-2 text-[16px] text-[#1A1A1A] placeholder:text-[#AFAFAF] focus:border-2 focus:border-[#1464F6] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              error && "border-2 border-[#D92D20] focus:border-[#D92D20]",
              icon ? "pl-10" : "",
              isPassword ? "pr-10" : "",
              className
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">
              {icon}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1A1A1A] focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[12px] font-medium text-[#D92D20] ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
