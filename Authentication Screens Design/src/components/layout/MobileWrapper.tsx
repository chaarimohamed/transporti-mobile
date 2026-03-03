import React from "react";

interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-100 font-sans">
      <div 
        className={`w-full max-w-[390px] min-h-screen bg-[#F6F6F6] text-[#1A1A1A] shadow-xl relative flex flex-col overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
