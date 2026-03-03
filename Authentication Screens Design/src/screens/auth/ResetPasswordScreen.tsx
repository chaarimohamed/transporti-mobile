import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Input } from "../../components/transporti/Input";
import { ScreenProps } from "../../types/navigation";
import { ArrowLeft, Check } from "lucide-react";

export const ResetPasswordScreen: React.FC<ScreenProps> = ({ navigate }) => {
    return (
      <MobileWrapper className="p-6">
         <div className="pt-4">
              <button onClick={() => navigate("login")} className="p-2 -ml-2">
                  <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
              </button>
          </div>
          
          <div className="mt-8 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-[24px] font-semibold text-[#444444]">Nouveau mot de passe</h2>
                  <p className="text-[#666666]">Créez un nouveau mot de passe sécurisé</p>
               </div>
  
               <div className="space-y-4">
                    <Input label="Nouveau mot de passe" isPassword placeholder="••••••••" />
                    <Input label="Confirmer mot de passe" isPassword placeholder="••••••••" />
               </div>

               <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Check className="w-4 h-4 text-[#2E8B57]" /> Au moins 8 caractères
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <div className="w-4 h-4 rounded-full border border-[#AFAFAF]" /> Une lettre majuscule
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <div className="w-4 h-4 rounded-full border border-[#AFAFAF]" /> Une lettre minuscule
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <div className="w-4 h-4 rounded-full border border-[#AFAFAF]" /> Un chiffre
                    </div>
               </div>
  
               <Button fullWidth size="lg" onClick={() => navigate("login")}>
                  Réinitialiser
               </Button>
          </div>
      </MobileWrapper>
    );
  };
