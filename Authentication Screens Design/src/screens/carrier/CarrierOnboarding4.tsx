import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { ScreenProps } from "../../types/navigation";
import { Check } from "lucide-react";
import { OnboardingProgress } from "./components/OnboardingProgress";

export const CarrierOnboarding4: React.FC<ScreenProps> = ({ navigate }) => {
    return (
        <MobileWrapper className="p-6 items-center justify-center text-center">
            <div className="w-full max-w-xs space-y-6">
                <OnboardingProgress step={3} />
                
                <div className="mx-auto w-24 h-24 bg-[#2E8B57] rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-12 h-12 text-white" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-[32px] font-semibold text-[#1A1A1A]">C'est prêt !</h2>
                    <p className="text-[#666666]">Vous pouvez maintenant accéder aux missions disponibles</p>
                </div>

                <div className="pt-8">
                    <Button fullWidth size="lg" onClick={() => navigate("dashboard")}>
                        Commencer
                    </Button>
                </div>
            </div>
        </MobileWrapper>
    );
};
