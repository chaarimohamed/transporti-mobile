import React from "react";
import { cn } from "../../../components/ui/utils";

export const OnboardingProgress = ({ step }: { step: number }) => (
    <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
            <div 
                key={s} 
                className={cn(
                    "h-1 flex-1 rounded-full",
                    s <= step ? "bg-[#1464F6]" : "bg-[#E9E9E9]"
                )} 
            />
        ))}
    </div>
);
