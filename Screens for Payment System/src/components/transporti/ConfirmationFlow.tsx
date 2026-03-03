import React, { useState, useRef, useEffect } from 'react';
import { 
  Package, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  XOctagon,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TButton, 
  TCard, 
  H2, 
  H3,
  Body, 
  Caption, 
  ScreenContainer, 
  TBadge,
  cn
} from './Shared';

// --- COMPONENTS ---

const CodeInput = ({ 
  error = false, 
  disabled = false,
  onChange 
}: { 
  error?: boolean; 
  disabled?: boolean;
  onChange: (code: string) => void;
}) => {
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newValues = [...values];
    newValues[index] = value.slice(-1); // Only last char
    setValues(newValues);
    onChange(newValues.join(''));

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Shake animation for error
  const shakeVariants = {
    idle: { x: 0 },
    shake: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="flex justify-between gap-2"
      variants={shakeVariants}
      animate={error ? "shake" : "idle"}
    >
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => inputsRef.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "w-[48px] h-[56px] text-center text-[24px] font-bold font-mono rounded-[12px] border-2 outline-none transition-all",
            "focus:border-[#1464F6] focus:bg-[#1464F6]/5",
            error 
              ? "border-[#D92D20] text-[#D92D20] bg-[#D92D20]/5" 
              : "border-[#E9E9E9] text-[#1A1A1A] bg-white",
             // Special state: if filled and valid (implied by not error), subtle accent
             !error && val && "border-[#1464F6]/30 bg-[#1464F6]/5"
          )}
        />
      ))}
    </motion.div>
  );
};

// --- SCREENS ---

export const ScreenP1 = ({ onNext, onProblem }: { onNext: (code: string) => void, onProblem?: () => void }) => {
  const [code, setCode] = useState("");

  return (
    <ScreenContainer title="Confirmer la livraison" onBack={() => {}} rightAction={<TBadge>#12345</TBadge>}>
      <div className="p-6 flex flex-col gap-6 h-full">
        {/* Order Summary */}
        <TCard className="border-l-4 border-l-[#1464F6] shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-[#1464F6]/10 p-3 rounded-full shrink-0">
              <Package className="w-6 h-6 text-[#1464F6]" />
            </div>
            <div className="flex-1">
              <Caption>Livraison à</Caption>
              <Body className="font-medium mb-2">123 Rue de la République, Tunis</Body>
              <div className="flex justify-between items-end">
                <div>
                  <Caption>Client</Caption>
                  <Body className="font-medium">Ahmed Ben Ali</Body>
                </div>
                <div className="text-right">
                  <Caption>À encaisser</Caption>
                  <div className="text-[20px] font-bold text-[#1464F6]">45 DT</div>
                </div>
              </div>
            </div>
          </div>
        </TCard>

        {/* Instructions Banner */}
        <div className="bg-[#1464F6]/10 rounded-[16px] p-4 flex gap-3 items-start">
          <Lightbulb className="w-5 h-5 text-[#1464F6] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[#1464F6] font-semibold text-[14px]">Demandez le code de paiement</h4>
            <p className="text-[#1464F6]/80 text-[12px]">Le client a reçu ce code par SMS lors de la commande.</p>
          </div>
        </div>

        {/* Code Input */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-[14px] font-medium text-[#444444]">Code de paiement</label>
          <CodeInput onChange={setCode} />
          <Caption className="text-center mt-2">Entrez le code à 6 chiffres</Caption>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-3 pb-4">
          <Caption className="text-center text-[#666666]">
            Le client doit vous remettre l'argent avant de confirmer
          </Caption>
          <TButton 
            fullWidth 
            size="large" 
            disabled={code.length < 6}
            onClick={() => onNext(code)}
          >
            Confirmer paiement et livraison
          </TButton>
          <TButton variant="ghost" fullWidth onClick={onProblem}>
            Renvoyer le code au client
          </TButton>
        </div>
      </div>
    </ScreenContainer>
  );
};

export const ScreenP2 = ({ onViewReceipt }: { onViewReceipt: () => void }) => {
  return (
    <ScreenContainer className="bg-white">
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-[80px] h-[80px] bg-[#2E8B57] rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        
        <H2 className="mb-2">Paiement confirmé !</H2>
        <Body className="text-[#666666] mb-8">La livraison a été complétée avec succès.</Body>

        <TCard className="w-full bg-[#2E8B57]/5 border-[#2E8B57]/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#2E8B57]/10 p-2 rounded-full">
              <FileText className="w-5 h-5 text-[#2E8B57]" />
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-[#1A1A1A]">Reçu #RCP123</div>
              <div className="text-[12px] text-[#2E8B57] font-medium">PAYÉ</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#666666]">Montant encaissé</span>
              <span className="font-bold text-[#1A1A1A]">45 DT</span>
            </div>
            <div className="w-full h-[1px] bg-[#2E8B57]/10 dashed" />
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#666666]">Client</span>
              <span className="font-medium text-[#1A1A1A]">Ahmed Ben Ali</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-[#666666]">Date</span>
              <span className="font-medium text-[#1A1A1A]">7 Déc 2025, 14:32</span>
            </div>
          </div>
        </TCard>

        <TButton fullWidth onClick={onViewReceipt} className="mb-3">
          Voir le reçu complet
        </TButton>
        <TButton variant="ghost" fullWidth>
          Retour aux missions
        </TButton>

        <div className="mt-8 flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#2E8B57]" />
          <Caption className="text-[#2E8B57]">Le client a été notifié de la livraison</Caption>
        </div>
      </div>
    </ScreenContainer>
  );
};

export const ScreenP3 = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <ScreenContainer title="Confirmer la livraison" onBack={() => {}}>
      <div className="p-6 flex flex-col gap-6 h-full">
        {/* Error Banner */}
        <div className="bg-[#D92D20]/10 rounded-[16px] p-4 flex gap-3 items-start border border-[#D92D20]/20">
          <AlertCircle className="w-5 h-5 text-[#D92D20] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[#D92D20] font-semibold text-[14px]">Code incorrect</h4>
            <p className="text-[#D92D20] text-[12px]">Vérifiez le code avec le client.</p>
          </div>
        </div>

        {/* Code Input in Error State */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-center">
            <label className="text-[14px] font-medium text-[#444444]">Code de paiement</label>
            <span className="text-[#FFB347] text-[12px] font-bold">2/3 tentatives restantes</span>
          </div>
          <CodeInput error onChange={() => {}} />
          <Caption className="text-[#D92D20] mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Code invalide
          </Caption>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-3 pb-4">
          <TButton fullWidth onClick={onRetry}>
            Réessayer
          </TButton>
          <TButton variant="ghost" fullWidth>
            Renvoyer le code au client
          </TButton>
          <TButton variant="outline-danger" fullWidth>
            Signaler un problème
          </TButton>
        </div>
      </div>
    </ScreenContainer>
  );
};

export const ScreenP4 = () => {
  return (
    <ScreenContainer className="bg-white">
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <XOctagon className="w-[80px] h-[80px] text-[#D92D20] mb-6" />
        
        <H2 className="mb-2 text-[#D92D20]">Code bloqué</H2>
        <Body className="text-[#666666] mb-8">Vous avez atteint le nombre maximum de tentatives (3/3).</Body>

        <TCard className="w-full bg-[#D92D20]/5 border-[#D92D20]/20 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[14px] font-medium">Commande #12345</span>
            <span className="font-bold text-[#1A1A1A]">45 DT</span>
          </div>
          <div className="flex justify-start">
            <TBadge variant="error">VÉRIFICATION ÉCHOUÉE</TBadge>
          </div>
        </TCard>

        <div className="w-full text-left mb-4">
          <H3 className="mb-4 text-[18px]">Contactez le support</H3>
          <div className="space-y-3">
            <TCard className="flex items-center justify-between p-4" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <div className="bg-[#1464F6]/10 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-[#1464F6]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[14px]">Support Transporti</div>
                  <div className="text-[12px] text-[#666666]">+216 71 123 456</div>
                </div>
              </div>
              <TButton size="small" variant="secondary">Appeler</TButton>
            </TCard>

            <TCard className="flex items-center justify-between p-4" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <div className="bg-[#1464F6]/10 p-2 rounded-full">
                  <MessageCircle className="w-5 h-5 text-[#1464F6]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[14px]">Chat support</div>
                  <div className="text-[12px] text-[#666666]">En ligne</div>
                </div>
              </div>
              <TButton size="small" variant="secondary">Chat</TButton>
            </TCard>
          </div>
        </div>

        <div className="bg-[#F6F6F6] p-3 rounded-[12px] w-full mb-6">
          <div className="text-[12px] font-medium text-[#444444] mb-1">Ticket de support créé : #SUP789</div>
          <div className="text-[12px] text-[#666666]">Un agent vous contactera sous 15 minutes</div>
        </div>

        <TButton variant="ghost" fullWidth>
          Retour aux missions
        </TButton>
      </div>
    </ScreenContainer>
  );
};
