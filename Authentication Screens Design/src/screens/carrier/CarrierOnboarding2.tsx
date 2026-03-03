import React, { useEffect, useRef, useState } from "react";
import { MobileWrapper } from "../../components/layout/MobileWrapper";
import { Button } from "../../components/transporti/Button";
import { ScreenProps } from "../../types/navigation";
import { Checkbox } from "../../components/ui/checkbox";
import { Box, Snowflake, Truck, ChevronDown } from "lucide-react";
import { OnboardingProgress } from "./components/OnboardingProgress";

export const CarrierOnboarding2: React.FC<ScreenProps> = ({ navigate }) => {
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<"S" | "M" | "L" | "XL" | "">("");
  const volumeRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!volumeRef.current) return;
      if (!volumeRef.current.contains(e.target as Node)) {
        setVolumeOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const volumeOptions = [
    { size: "S", desc: "Caddy" },
    { size: "M", desc: "Fourgonnette" },
    { size: "L", desc: "Camion léger" },
    { size: "XL", desc: "Camion plateau" },
  ] as const;

  return (
    <MobileWrapper className="p-6">
      <div className="pt-8 pb-4">
        <OnboardingProgress step={1} />
        <h2 className="text-[24px] font-semibold text-[#444444] mb-2">Votre véhicule</h2>
        <p className="text-[#666666]">Quels types de marchandises pouvez-vous transporter ?</p>
      </div>

      <div className="space-y-3 mt-4">
        {[
          { id: "palette", label: "Palette", icon: Box },
          { id: "refrigere", label: "Réfrigéré", icon: Snowflake },
          { id: "volumineux", label: "Volumineux", icon: Truck },
        ].map((item) =>
          item.id === "volumineux" ? (
            /* ==== VOLUME ROW WITH BAR-LIKE SELECT ==== */
            <div
              key={item.id}
              className="p-4 border border-[#E9E9E9] rounded-[16px] bg-[#FCFCFC]"
              ref={volumeRef}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <item.icon className="w-6 h-6 text-[#666666] mr-3" />
                  <div>
                    <div className="text-[#1A1A1A] font-medium">Volume</div>
                    <div className="text-xs text-[#666666]">
                      Choisissez un volume en fonction de votre véhicule
                    </div>
                  </div>
                </div>
              </div>

              {/* Single bar-style select for all volume choices */}
              <div className="relative">
                <select
                  className="h-[56px] w-full bg-white rounded-[16px] border border-[#E9E9E9] px-4 pr-10 outline-none appearance-none text-[#1A1A1A]"
                  value={selectedVolume}
                  onChange={(e) => {
                    const value = e.target.value as typeof selectedVolume;
                    setSelectedVolume(value);
                  }}
                >
                  <option value="">Sélectionner un volume</option>
                  {volumeOptions.map((opt) => (
                    <option key={opt.size} value={opt.size}>
                      {opt.size} — {opt.desc}
                    </option>
                  ))}
                </select>
                {/* Custom chevron to mimic native select arrow */}
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              </div>
            </div>
          ) : (
            /* ==== DEFAULT CHECKBOX ROW ==== */
            <label
              key={item.id}
              className="flex items-center p-4 border border-[#E9E9E9] rounded-[16px] bg-[#FCFCFC] cursor-pointer hover:border-[#1464F6] transition-colors"
            >
              <Checkbox
                id={item.id}
                className="border-[#AFAFAF] data-[state=checked]:bg-[#1464F6] mr-4"
              />
              <item.icon className="w-6 h-6 text-[#666666] mr-3" />
              <span className="text-[#1A1A1A] font-medium">{item.label}</span>
            </label>
          )
        )}
      </div>

      <div className="flex-1" />

      <div className="pb-8 pt-4 flex gap-4">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => navigate("carrierOnboarding3")}
        >
          Passer
        </Button>
        <Button className="flex-1" onClick={() => navigate("carrierOnboarding3")}>
          Suivant
        </Button>
      </div>
    </MobileWrapper>
  );
};
