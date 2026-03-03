import React, { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  UserX, 
  Key, 
  Ban, 
  HelpCircle,
  Camera, 
  X,
  Info
} from 'lucide-react';
import { 
  TButton, 
  TCard, 
  TInput,
  H2, 
  Body, 
  Caption, 
  ScreenContainer,
  TBadge,
  cn
} from './Shared';

// --- COMPONENTS ---

const RadioCard = ({ 
  selected, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  selected: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string; 
}) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 p-4 rounded-[16px] border cursor-pointer transition-all mb-3",
      selected 
        ? "border-[#1464F6] bg-[#1464F6]/5 shadow-sm" 
        : "border-[#E9E9E9] bg-white hover:border-[#CCCCCC]"
    )}
  >
    <div className={cn(
      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
      selected ? "border-[#1464F6]" : "border-[#CCCCCC]"
    )}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />}
    </div>
    <span className={cn("flex-1 font-medium", selected ? "text-[#1464F6]" : "text-[#1A1A1A]")}>{label}</span>
    <Icon className={cn("w-5 h-5", selected ? "text-[#1464F6]" : "text-[#666666]")} />
  </div>
);

// --- SCREENS ---

export const ScreenP5 = ({ onSubmit }: { onSubmit: () => void }) => {
  const [reason, setReason] = useState<string | null>(null);
  const [photo, setPhoto] = useState<boolean>(false);

  return (
    <ScreenContainer title="Signaler un problème" onBack={() => {}}>
      <div className="p-6 pb-24">
        <H2 className="mb-6">Quel est le problème ?</H2>
        
        <RadioCard 
          selected={reason === 'refusal'} 
          onClick={() => setReason('refusal')} 
          icon={Ban} 
          label="Client refuse de payer" 
        />
        <RadioCard 
          selected={reason === 'nocode'} 
          onClick={() => setReason('nocode')} 
          icon={Key} 
          label="Client n'a pas le code" 
        />
        <RadioCard 
          selected={reason === 'address'} 
          onClick={() => setReason('address')} 
          icon={MapPin} 
          label="Adresse incorrecte" 
        />
        <RadioCard 
          selected={reason === 'absent'} 
          onClick={() => setReason('absent')} 
          icon={UserX} 
          label="Client absent" 
        />
        <RadioCard 
          selected={reason === 'other'} 
          onClick={() => setReason('other')} 
          icon={HelpCircle} 
          label="Autre problème" 
        />

        {reason === 'other' && (
          <div className="mt-4 animate-in slide-in-from-top-2 fade-in">
            <label className="block text-[14px] font-medium text-[#444444] mb-2">Décrivez le problème</label>
            <textarea 
              className="w-full h-[120px] p-4 rounded-[16px] border border-[#E9E9E9] bg-white resize-none focus:border-[#1464F6] outline-none"
              placeholder="Expliquez la situation..."
            />
            <div className="text-right text-[12px] text-[#666666] mt-1">0/500</div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-[14px] font-medium text-[#444444] mb-2">Ajouter une photo (optionnel)</label>
          {!photo ? (
            <button 
              onClick={() => setPhoto(true)}
              className="w-full h-[80px] rounded-[16px] border-2 border-dashed border-[#1464F6]/30 bg-[#1464F6]/5 flex items-center justify-center gap-2 text-[#1464F6] font-medium hover:bg-[#1464F6]/10 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Ajouter une photo
            </button>
          ) : (
            <div className="relative w-[80px] h-[80px]">
              <div className="w-full h-full rounded-[16px] bg-gray-200 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1566576912906-253c723f0eb1?auto=format&fit=crop&q=80&w=200&h=200" className="object-cover w-full h-full opacity-80" alt="Preuve" />
              </div>
              <button 
                onClick={() => setPhoto(false)}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200"
              >
                <X className="w-4 h-4 text-[#666666]" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed footer for buttons */}
      <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t border-[#E9E9E9] flex flex-col gap-3">
        <TButton fullWidth onClick={onSubmit} disabled={!reason}>Envoyer le signalement</TButton>
        <TButton variant="ghost" fullWidth>Annuler</TButton>
      </div>
    </ScreenContainer>
  );
};

export const ScreenP6 = () => {
  return (
    <ScreenContainer className="bg-white">
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-[80px] h-[80px] bg-[#FFB347]/10 rounded-full flex items-center justify-center mb-6">
          <Info className="w-10 h-10 text-[#FFB347]" />
        </div>
        
        <H2 className="mb-2">Signalement envoyé</H2>
        <Body className="text-[#666666] mb-8">Notre équipe support a été notifiée et vous contactera rapidement.</Body>

        <TCard className="w-full bg-[#FFB347]/5 border-[#FFB347]/20 mb-8 text-left">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[14px] text-[#666666]">Ticket #SUP790</div>
              <div className="font-semibold text-[#1A1A1A]">Client refuse de payer</div>
            </div>
            <TBadge variant="warning">EN ATTENTE</TBadge>
          </div>
          <div className="text-[12px] text-[#666666]">Créé le : 7 Déc 2025, 14:40</div>
        </TCard>

        <div className="w-full text-left mb-6">
          <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-3">Pendant ce temps...</h3>
          <ul className="space-y-3">
            {[
              "Restez sur place si possible",
              "Gardez le colis en sécurité",
              "Répondez aux appels du +216 71..."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[14px] text-[#444444]">
                <div className="w-5 h-5 rounded-full bg-[#E9E9E9] flex items-center justify-center text-[10px] text-[#666666] font-bold">✓</div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <TButton fullWidth className="mb-3">Contacter le support</TButton>
        <TButton variant="ghost" fullWidth>Retour aux missions</TButton>

        <Caption className="mt-4 text-[#666666]">Temps de réponse estimé : 10-15 minutes</Caption>
      </div>
    </ScreenContainer>
  );
};
