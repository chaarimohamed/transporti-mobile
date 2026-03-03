import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Input } from "../../components/transporti/Input";
import { ScreenProps } from "../../types/navigation";
import { ArrowLeft, Mail } from "lucide-react";

export const ForgotPasswordScreen: React.FC<ScreenProps> = ({ navigate }) => {
  return (
    <MobileWrapper className="p-6">
       <div className="pt-4">
            <button onClick={() => navigate("login")} className="p-2 -ml-2">
                <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
            </button>
        </div>
        
        <div className="mt-8 space-y-8">
             <div className="space-y-2">
                <h2 className="text-[24px] font-semibold text-[#444444]">Mot de passe oublié</h2>
                <p className="text-[#666666]">Entrez votre email pour recevoir un code de réinitialisation</p>
             </div>

             <Input 
                label="Email"
                placeholder="exemple@email.com"
                type="email"
                icon={<Mail className="w-5 h-5" />}
             />

             <Button fullWidth size="lg" onClick={() => navigate("resetPassword")}>
                Envoyer le code
             </Button>
        </div>
    </MobileWrapper>
  );
};
