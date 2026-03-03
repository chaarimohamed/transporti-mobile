import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Input } from "../../components/transporti/Input";
import { ScreenProps } from "../../types/navigation";
import { Truck, Mail } from "lucide-react";

export const LoginScreen: React.FC<ScreenProps> = ({ navigate }) => {
  return (
    <MobileWrapper className="p-6">
        <div className="pt-8 pb-8 flex justify-center">
            <div className="w-10 h-10 bg-[#1464F6] rounded-lg flex items-center justify-center">
                 <Truck className="w-6 h-6 text-white" />
            </div>
        </div>
        
        <div className="space-y-8">
             <h2 className="text-[24px] font-semibold text-[#444444] text-center">
                Connexion
             </h2>

             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate("dashboard"); }}>
                <Input 
                    label="Email"
                    placeholder="exemple@email.com"
                    type="email"
                    icon={<Mail className="w-5 h-5" />}
                />
                <div className="space-y-2">
                    <Input 
                        label="Mot de passe"
                        placeholder="••••••••"
                        isPassword
                    />
                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate("forgotPassword")} className="text-sm text-[#1464F6] font-medium">
                            Mot de passe oublié ?
                        </button>
                    </div>
                </div>

                <Button type="submit" fullWidth size="lg">
                    Se connecter
                </Button>
             </form>

             <div className="text-center pt-4">
                 <span className="text-[#666666]">Pas de compte ? </span>
                 <button onClick={() => navigate("roleSelection")} className="text-[#1464F6] font-medium">
                    Créer un compte
                 </button>
            </div>
        </div>
    </MobileWrapper>
  );
};
