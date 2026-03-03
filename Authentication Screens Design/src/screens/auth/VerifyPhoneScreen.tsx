import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { ScreenProps } from "../../types/navigation";
import { ArrowLeft } from "lucide-react";

export const VerifyPhoneScreen: React.FC<ScreenProps> = ({ navigate, data }) => {
    const handleVerify = () => {
        if (data?.role === 'carrier') {
            navigate("carrierOnboarding2");
        } else {
            navigate("dashboard");
        }
    };

    return (
      <MobileWrapper className="p-6">
         <div className="pt-4">
              <button onClick={() => navigate("verifyEmail")} className="p-2 -ml-2">
                  <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
              </button>
          </div>
          
          <div className="mt-8 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-[24px] font-semibold text-[#444444]">Vérification SMS</h2>
                  <p className="text-[#666666]">Entrez le code envoyé à votre numéro de téléphone</p>
               </div>
  
               <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input
                          key={i}
                          type="text"
                          maxLength={1}
                          className="w-[48px] h-[56px] rounded-[12px] border border-[#E9E9E9] text-center text-[24px] font-semibold focus:border-[#1464F6] focus:outline-none bg-[#FCFCFC]"
                      />
                  ))}
               </div>
  
               <div className="pt-4">
                  <Button fullWidth size="lg" onClick={handleVerify}>
                      Vérifier
                  </Button>
                  <div className="mt-4 text-center">
                      <button className="text-[#1464F6] font-medium">Renvoyer le code (30s)</button>
                  </div>
               </div>
          </div>
      </MobileWrapper>
    );
  };
