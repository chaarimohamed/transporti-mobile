import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { ScreenProps } from "../../types/navigation";
import { Upload } from "lucide-react";
import { OnboardingProgress } from "./components/OnboardingProgress";

export const CarrierOnboarding3: React.FC<ScreenProps> = ({ navigate }) => {
    return (
        <MobileWrapper className="p-6">
            <div className="pt-8 pb-4">
                <OnboardingProgress step={2} />
                <h2 className="text-[24px] font-semibold text-[#444444] mb-2">Documents</h2>
                <p className="text-[#666666]">Téléchargez vos documents officiels</p>
            </div>

            <div className="space-y-4 mt-4">
                {["CIN*", "Permis*"].map((doc, idx) => (
                    <button key={idx} className="w-full p-4 border border-dashed border-[#1464F6] bg-[#F0F7FF] rounded-[16px] flex items-center justify-center gap-2 text-[#1464F6] font-medium hover:bg-[#E6F0FF] transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>{doc}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1" />

            <div className="pb-8 pt-4 flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => navigate("carrierOnboarding4")}>Passer</Button>
                <Button className="flex-1" onClick={() => navigate("carrierOnboarding4")}>Suivant</Button>
            </div>
        </MobileWrapper>
    );
};
