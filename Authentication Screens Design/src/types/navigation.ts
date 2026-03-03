export type ScreenName =
  | "splash"
  | "roleSelection"
  | "login"
  | "senderRegister"
  | "carrierRegister"
  | "verifyEmail"
  | "verifyPhone"
  | "forgotPassword"
  | "resetPassword"
  | "carrierOnboarding2"
  | "carrierOnboarding3"
  | "carrierOnboarding4"
  | "dashboard";

export interface ScreenProps {
  navigate: (screen: ScreenName) => void;
  data?: any;
  setData?: (data: any) => void;
}
