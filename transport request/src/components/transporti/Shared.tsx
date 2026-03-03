import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Design System Constants
export const DS = {
  colors: {
    text: "#1A1A1A",
    title: "#444444",
    secondary: "#666666",
    accent: "#1464F6",
    bgApp: "#F6F6F6",
    bgCard: "#FCFCFC",
    border: "#E9E9E9",
    success: "#2E8B57",
    warning: "#FFB347",
    error: "#D92D20",
  },
};

// Reusable Atoms

export const ScreenFrame = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider ml-2">
      {title}
    </div>
    <div
      className={cn(
        "w-[390px] h-[844px] bg-[#F6F6F6] overflow-hidden relative flex flex-col border border-gray-200 shadow-2xl rounded-[40px]",
        className,
      )}
    >
      {children}
    </div>
  </div>
);

export const TCard = ({
  children,
  className,
  padding = "p-4",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}) => (
  <div
    className={cn(
      "bg-[#FCFCFC] border border-[#E9E9E9] rounded-[16px]",
      padding,
      className,
    )}
  >
    {children}
  </div>
);

export const TButton = ({
  children,
  variant = "primary",
  className,
  fullWidth,
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "outline";
  fullWidth?: boolean;
  size?: "default" | "sm";
}) => {
  const baseStyles =
    "font-medium transition-colors flex items-center justify-center gap-2";
  const sizeStyles =
    size === "sm"
      ? "h-10 px-4 text-sm"
      : "h-[48px] px-6 text-base";
  const variants = {
    primary:
      "bg-[#1464F6] text-white hover:bg-[#1464F6]/90 rounded-[48px]",
    secondary:
      "bg-white border border-[#E9E9E9] text-[#1A1A1A] hover:bg-gray-50 rounded-[12px]", // Assuming secondary is more like a card button or form secondary
    outline:
      "bg-transparent border border-[#E9E9E9] text-[#1A1A1A] hover:bg-gray-50 rounded-[48px]",
    ghost:
      "bg-transparent text-[#666666] hover:bg-gray-100 rounded-[12px]",
    danger:
      "bg-[#D92D20] text-white hover:bg-[#D92D20]/90 rounded-[48px]",
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles,
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TBadge = ({
  status,
  text,
}: {
  status: "success" | "warning" | "error" | "neutral" | "info";
  text: string;
}) => {
  const styles = {
    success: "bg-[#2E8B57]/10 text-[#2E8B57]",
    warning: "bg-[#FFB347]/10 text-[#FFB347]",
    error: "bg-[#D92D20]/10 text-[#D92D20]",
    neutral: "bg-[#E9E9E9] text-[#666666]",
    info: "bg-[#1464F6]/10 text-[#1464F6]",
  };
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[12px] font-medium",
        styles[status],
      )}
    >
      {text}
    </span>
  );
};

export const TInput = ({
  label,
  placeholder,
  icon,
  type = "text",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "h-[48px] w-full bg-white rounded-[16px] border border-[#E9E9E9] px-4 outline-none focus:border-[#1464F6] text-[#1A1A1A] placeholder:text-[#666666]/50",
            icon && "pl-12",
            className,
          )}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
};

import {
  Home,
  Box,
  Bell,
  User,
  Truck,
  FileText,
  Clock,
} from "lucide-react";

export const BottomNav = ({
  active = "home",
  role = "sender",
}: {
  active?: string;
  role?: "sender" | "carrier";
}) => {
  const senderItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "shipments", label: "Expéditions", icon: Box },
    { id: "notifications", label: "Notifs", icon: Bell },
    { id: "profile", label: "Profil", icon: User },
  ];

  const carrierItems = [
    { id: "missions", label: "Missions", icon: Truck },
    { id: "active", label: "En cours", icon: Clock },
    { id: "history", label: "Historique", icon: FileText },
    { id: "profile", label: "Profil", icon: User },
  ];

  const items = role === "sender" ? senderItems : carrierItems;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E9E9E9] px-2 py-2 flex justify-around items-end h-[84px] pb-6">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <div
            key={item.id}
            className="flex flex-col items-center gap-1 w-16"
          >
            <item.icon
              size={24}
              className={
                isActive ? "text-[#1464F6]" : "text-[#666666]"
              }
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-[#1464F6]" : "text-[#666666]",
              )}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const StatusTimeline = ({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full px-2">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStep;
        const isLast = idx === steps.length - 1;
        return (
          <div
            key={idx}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Line connector */}
            {!isLast && (
              <div
                className={cn(
                  "absolute top-2 left-1/2 w-full h-[2px]",
                  idx < currentStep
                    ? "bg-[#1464F6]"
                    : "bg-[#E9E9E9]",
                )}
              />
            )}

            <div
              className={cn(
                "w-4 h-4 rounded-full z-10 mb-2 border-2",
                isCompleted
                  ? "bg-[#1464F6] border-[#1464F6]"
                  : "bg-white border-[#E9E9E9]",
              )}
            />
            <span
              className={cn(
                "text-[10px] text-center",
                isCompleted
                  ? "text-[#1A1A1A] font-medium"
                  : "text-[#666666]",
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};