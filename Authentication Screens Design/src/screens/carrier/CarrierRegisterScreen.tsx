import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Input } from "../../components/transporti/Input";
import { ScreenProps } from "../../types/navigation";
import { ArrowLeft, Mail, Phone, User, FileText } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";

export const CarrierRegisterScreen: React.FC<ScreenProps> = ({ navigate }) => {
  return (
    <MobileWrapper className="p-6">
       <div className="pt-4">
            <button onClick={() => navigate("roleSelection")} className="p-2 -ml-2">
                <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
            </button>
        </div>
        
        <div className="mt-6 space-y-6 overflow-y-auto pb-8 scrollbar-hide flex-1 h-full">
             <div className="space-y-1">
                <h2 className="text-[24px] font-semibold text-[#444444]">Inscription</h2>
                <p className="text-[#666666] font-medium">Compte Transporteur</p>
             </div>

             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Prénom" placeholder="Ahmed" icon={<User className="w-5 h-5" />} />
                    <Input label="Nom" placeholder="Ben Ali" />
                </div>
                <Input label="Téléphone" placeholder="+216 XX XXX XXX" icon={<Phone className="w-5 h-5" />} />
                <Input label="Email" placeholder="ahmed@transport.com" type="email" icon={<Mail className="w-5 h-5" />} />
                <Input label="Licence / Matricule Fiscale" placeholder="1234567/A" icon={<FileText className="w-5 h-5" />} />
                <Input label="Mot de passe" placeholder="••••••••" isPassword />
                <Input label="Confirmer mot de passe" placeholder="••••••••" isPassword />
             </div>

             <div className="flex items-start gap-2">
                <Checkbox id="terms-carrier" className="mt-1 border-[#AFAFAF] data-[state=checked]:bg-[#1464F6] data-[state=checked]:border-[#1464F6]" />
                <label htmlFor="terms-carrier" className="text-sm text-[#666666] leading-snug">
                    J'accepte les <span className="text-[#1464F6]">Conditions générales</span>
                </label>
             </div>

             <Button fullWidth size="lg" onClick={() => navigate("verifyEmail")}>
                Créer mon compte
             </Button>
        </div>
    </MobileWrapper>
  );
};
