import React, { useState } from "react";
import { ScreenName } from "./types/navigation";
import { SplashScreen } from "./screens/auth/SplashScreen";
import { RoleSelectionScreen } from "./screens/auth/RoleSelectionScreen";
import { LoginScreen } from "./screens/auth/LoginScreen";
import { VerifyEmailScreen } from "./screens/auth/VerifyEmailScreen";
import { VerifyPhoneScreen } from "./screens/auth/VerifyPhoneScreen";
import { ForgotPasswordScreen } from "./screens/auth/ForgotPasswordScreen";
import { ResetPasswordScreen } from "./screens/auth/ResetPasswordScreen";
import { SenderRegisterScreen } from "./screens/sender/SenderRegisterScreen";
import { CarrierRegisterScreen } from "./screens/carrier/CarrierRegisterScreen";
import { CarrierOnboarding2 } from "./screens/carrier/CarrierOnboarding2";
import { CarrierOnboarding3 } from "./screens/carrier/CarrierOnboarding3";
import { CarrierOnboarding4 } from "./screens/carrier/CarrierOnboarding4";
import { DashboardScreen } from "./screens/dashboard/DashboardScreen";
import "./styles/globals.css";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("splash");
  const [userRole, setUserRole] = useState<"sender" | "carrier" | null>(null);

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash": return <SplashScreen navigate={navigate} />;
      case "roleSelection": return <RoleSelectionScreen navigate={navigate} setData={setUserRole} />;
      case "login": return <LoginScreen navigate={navigate} />;
      case "senderRegister": return <SenderRegisterScreen navigate={navigate} />;
      case "carrierRegister": return <CarrierRegisterScreen navigate={navigate} />;
      case "verifyEmail": return <VerifyEmailScreen navigate={navigate} data={{ role: userRole }} />;
      case "verifyPhone": return <VerifyPhoneScreen navigate={navigate} data={{ role: userRole }} />;
      case "forgotPassword": return <ForgotPasswordScreen navigate={navigate} />;
      case "resetPassword": return <ResetPasswordScreen navigate={navigate} />;
      case "carrierOnboarding2": return <CarrierOnboarding2 navigate={navigate} />;
      case "carrierOnboarding3": return <CarrierOnboarding3 navigate={navigate} />;
      case "carrierOnboarding4": return <CarrierOnboarding4 navigate={navigate} />;
      case "dashboard": return <DashboardScreen navigate={navigate} />;
      default: return <SplashScreen navigate={navigate} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}
