import React, { useState } from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { Input } from "../../components/transporti/Input";
import { ScreenProps } from "../../types/navigation";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";

export const SenderRegisterScreen: React.FC<ScreenProps> = ({
  navigate,
}) => {
  const [step, setStep] = useState<
    "register" | "verifyEmail" | "verifyPhone"
  >("register");

  const handleBack = () => {
    if (step === "verifyPhone") {
      setStep("verifyEmail");
    } else if (step === "verifyEmail") {
      setStep("register");
    } else {
      navigate("roleSelection");
    }
  };

  return (
    <MobileWrapper className="p-6">
      <div className="pt-4">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
        </button>
      </div>

      {step === "register" && (
        <div className="mt-6 space-y-6 overflow-y-auto pb-8 scrollbar-hide flex-1">
          <div className="space-y-1">
            <h2 className="text-[24px] font-semibold text-[#444444]">
              Inscription
            </h2>
            <p className="text-[#666666] font-medium">
              Compte Expéditeur
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Foulen"
                icon={<User className="w-5 h-5" />}
              />
              <Input label="Nom" placeholder="Ben Falten" />
            </div>
            <Input
              label="Téléphone"
              placeholder="+216 XX XXX XXX"
              icon={<Phone className="w-5 h-5" />}
            />
            <Input
              label="Email"
              placeholder="foulen@exemple.com"
              type="email"
              icon={<Mail className="w-5 h-5" />}
            />
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              isPassword
            />
            <Input
              label="Confirmer mot de passe"
              placeholder="••••••••"
              isPassword
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              className="mt-1 border-[#AFAFAF] data-[state=checked]:bg-[#1464F6] data-[state=checked]:border-[#1464F6]"
            />
            <label
              htmlFor="terms"
              className="text-sm text-[#666666] leading-snug"
            >
              J'accepte les{" "}
              <span className="text-[#1464F6]">
                Conditions générales d'utilisation
              </span>{" "}
              et notre{" "}
              <span className="text-[#1464F6]">
                Politique de confidentialité
              </span>
            </label>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => setStep("verifyEmail")}
          >
            Créer mon compte
          </Button>
        </div>
      )}

      {step === "verifyEmail" && (
        <div className="mt-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[24px] font-semibold text-[#444444]">
              Vérification Email
            </h2>
            <p className="text-[#666666]">
              Entrez le code envoyé à votre adresse email
            </p>
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
            <Button
              fullWidth
              size="lg"
              onClick={() => setStep("verifyPhone")}
            >
              Vérifier
            </Button>
            <div className="mt-4 text-center">
              <button className="text-[#1464F6] font-medium">
                Renvoyer le code (30s)
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "verifyPhone" && (
        <div className="mt-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[24px] font-semibold text-[#444444]">
              Vérification SMS
            </h2>
            <p className="text-[#666666]">
              Entrez le code envoyé à votre numéro de téléphone
            </p>
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
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate("dashboard")}
            >
              Vérifier
            </Button>
            <div className="mt-4 text-center">
              <button className="text-[#1464F6] font-medium">
                Renvoyer le code (30s)
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileWrapper>
  );
};