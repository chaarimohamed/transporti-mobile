import React, { useEffect } from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { ScreenProps } from "../../types/navigation";
import { Truck } from "lucide-react";

export const SplashScreen: React.FC<ScreenProps> = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigate("roleSelection"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileWrapper className="bg-[#1464F6] items-center justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Truck className="w-12 h-12 text-[#1464F6]" />
        </div>
        <h1 className="text-white text-[32px] font-bold tracking-tight">Transporti.tn</h1>
      </div>
    </MobileWrapper>
  );
};
