import React from "react";
import { cn } from "../ui/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, isActive, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-[#E9E9E9] bg-[#FCFCFC] p-6 transition-all",
        isActive && "border-2 border-[#1464F6] bg-[#F0F7FF]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
