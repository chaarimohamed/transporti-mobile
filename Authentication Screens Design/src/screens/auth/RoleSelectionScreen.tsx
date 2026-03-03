import React, { useState } from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Card } from "../../components/transporti/Card";
import { ScreenProps } from "../../types/navigation";
import { Package, Truck } from "lucide-react";

export const RoleSelectionScreen: React.FC<ScreenProps> = ({ navigate, setData }) => {
  const [selectedRole, setSelectedRole] = useState<"sender" | "carrier" | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
        if (setData) setData(selectedRole);
        if (selectedRole === "sender") navigate("senderRegister");
        if (selectedRole === "carrier") navigate("carrierRegister");
    }
  };

  return (
    <MobileWrapper className="p-6 pt-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-[24px] font-semibold text-[#444444]">
            Choisissez votre rôle
          </h2>
          <p className="text-[#666666]">
            Sélectionnez comment vous souhaitez utiliser l'application
          </p>
        </div>

        <div className="space-y-4">
          <Card 
            className="cursor-pointer flex items-center gap-4 relative"
            isActive={selectedRole === "sender"}
            onClick={() => setSelectedRole("sender")}
          >
            <div className="p-3 bg-[#F6F6F6] rounded-full">
              <Package className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A]">Expéditeur</h3>
              <p className="text-sm text-[#666666]">Créer et suivre vos expéditions</p>
            </div>
            {selectedRole === "sender" && <div className="absolute top-4 right-4 w-3 h-3 bg-[#1464F6] rounded-full" />}
          </Card>

          <Card 
            className="cursor-pointer flex items-center gap-4 relative"
            isActive={selectedRole === "carrier"}
            onClick={() => setSelectedRole("carrier")}
          >
             <div className="p-3 bg-[#F6F6F6] rounded-full">
              <Truck className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1A1A1A]">Transporteur</h3>
              <p className="text-sm text-[#666666]">Recevoir et gérer des missions</p>
            </div>
            {selectedRole === "carrier" && <div className="absolute top-4 right-4 w-3 h-3 bg-[#1464F6] rounded-full" />}
          </Card>
        </div>

        <div className="flex-1" /> {/* Spacer */}
        
        <div className="pt-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] border border-[#E9E9E9] bg-white hover:bg-gray-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                  <path d="M5.50253 14.3003C5.00236 12.8199 5.00236 11.1799 5.50253 9.69951V6.60861H1.51649C-0.18551 10.0056 -0.18551 13.9945 1.51649 17.3915L5.50253 14.3003Z" fill="#FBBC04"/>
                  <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.60861L5.50264 9.69951C6.45064 6.85993 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] border border-[#E9E9E9] bg-white hover:bg-gray-50 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0C5.373 0 0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.429C10.125 6.42 11.917 4.761 14.658 4.761C15.97 4.761 17.344 4.996 17.344 4.996V7.951H15.83C14.34 7.951 13.875 8.876 13.875 9.825V12.073H17.203L16.67 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z" fill="#1877F2"/>
                </svg>
              </button>
            </div>

            <Button 
                fullWidth 
                size="lg" 
                disabled={!selectedRole}
                onClick={handleContinue}
            >
                Continuer
            </Button>
            <div className="mt-4 text-center">
                 <span className="text-[#666666]">Déjà un compte ? </span>
                 <button onClick={() => navigate("login")} className="text-[#1464F6] font-medium">
                    Se connecter
                 </button>
            </div>
        </div>
      </div>
    </MobileWrapper>
  );
};
