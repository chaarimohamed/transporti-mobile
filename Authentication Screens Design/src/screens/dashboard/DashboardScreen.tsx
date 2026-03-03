import React from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { ScreenProps } from "../../types/navigation";

export const DashboardScreen: React.FC<ScreenProps> = ({ navigate }) => {
  return (
    <MobileWrapper className="bg-white items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur Transporti.tn</h1>
      <p className="text-gray-600 mb-8">Ceci est la fin de la démo des écrans d'authentification.</p>
      <Button onClick={() => navigate("splash")}>Recommencer la démo</Button>
    </MobileWrapper>
  );
};
