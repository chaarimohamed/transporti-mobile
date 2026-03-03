import React, { useState } from 'react';
import { 
  Share2, 
  Download, 
  Mail, 
  Filter, 
  CreditCard,
  ChevronRight,
  Package,
  Calendar,
  MapPin
} from 'lucide-react';
import { 
  TButton, 
  TCard, 
  H2, 
  Body, 
  Caption, 
  ScreenContainer,
  TBadge,
  cn
} from './Shared';

// --- COMPONENTS ---

const ReceiptRow = ({ label, value, bold = false, big = false }: { label: string, value: string, bold?: boolean, big?: boolean }) => (
  <div className="flex justify-between items-baseline mb-2 last:mb-0">
    <span className="text-[#666666] text-[14px]">{label}</span>
    <span className={cn("text-[#1A1A1A] text-right", bold && "font-bold", big ? "text-[24px]" : "text-[14px]")}>{value}</span>
  </div>
);

const Separator = () => (
  <div className="w-full h-[1px] border-t border-dashed border-[#E9E9E9] my-4 relative">
    <div className="absolute -left-[32px] -top-[10px] w-[20px] h-[20px] bg-[#F6F6F6] rounded-full" />
    <div className="absolute -right-[32px] -top-[10px] w-[20px] h-[20px] bg-[#F6F6F6] rounded-full" />
  </div>
);

const HistoryCard = ({ 
  status, 
  amount, 
  date, 
  orderId 
}: { 
  status: 'paid' | 'pending' | 'problem'; 
  amount: string; 
  date: string; 
  orderId: string;
}) => {
  const statusConfig = {
    paid: { label: 'PAYÉ', variant: 'success' as const },
    pending: { label: 'EN ATTENTE', variant: 'warning' as const },
    problem: { label: 'PROBLÈME', variant: 'error' as const },
  };

  return (
    <TCard className="mb-4 p-0 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
      <div className="p-4 border-b border-[#E9E9E9] flex justify-between items-center bg-gray-50/50">
        <TBadge variant={statusConfig[status].variant}>{statusConfig[status].label}</TBadge>
        <span className="text-[12px] text-[#666666]">{date}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-[12px] text-[#666666] mb-1">Commande #{orderId}</div>
            <div className="font-medium text-[#1A1A1A]">Ahmed Ben Ali</div>
          </div>
          <div className="text-[18px] font-bold text-[#1A1A1A]">{amount}</div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-[12px] text-[#666666]">
            <CreditCard className="w-3 h-3" /> Espèces
          </div>
          <div className="flex items-center gap-1 text-[12px] text-[#1464F6] font-medium">
            Voir reçu <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </TCard>
  );
};

// --- SCREENS ---

export const ScreenP7 = () => {
  return (
    <ScreenContainer 
      title="Reçu de paiement" 
      onBack={() => {}} 
      rightAction={<button><Share2 className="w-5 h-5 text-[#1A1A1A]" /></button>}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Ticket Card */}
        <div className="bg-white rounded-[16px] shadow-sm border border-[#E9E9E9] overflow-hidden relative mb-6">
          {/* Header */}
          <div className="bg-[#1464F6] p-6 text-center text-white">
            <div className="font-bold text-[20px] tracking-wider mb-1">TRANSPORTI.TN</div>
            <div className="text-[12px] opacity-80">REÇU DE PAIEMENT</div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-[14px] text-[#666666]">#RCP123</div>
              <div className="text-[12px] text-[#666666]">7 Déc 2025, 14:32</div>
            </div>

            <ReceiptRow label="Montant payé" value="45,00 DT" bold big />
            <ReceiptRow label="Méthode" value="Espèces" />
            <ReceiptRow label="Code utilisé" value="ABC123" />
            
            <Separator />
            
            <ReceiptRow label="Client" value="Ahmed Ben Ali" bold />
            <ReceiptRow label="Téléphone" value="+216 22 333 444" />
            <div className="my-2" />
            <ReceiptRow label="Transporteur" value="Sami Tounsi" bold />
            <ReceiptRow label="Véhicule" value="TUN 1234" />
            
            <Separator />
            
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#666666]" />
              <span className="text-[14px] text-[#666666]">Livraison à :</span>
            </div>
            <p className="text-[14px] font-medium text-[#1A1A1A] ml-6 mb-4">
              123 Rue de la République, 1001 Tunis
            </p>
            <div className="flex justify-center">
              <TBadge variant="success">LIVRÉ</TBadge>
            </div>

            <div className="mt-8 flex justify-center">
              {/* QR Code Placeholder */}
              <div className="w-[120px] h-[120px] border border-[#E9E9E9] p-2 rounded-lg">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" 
                  alt="QR Code" 
                  className="w-full h-full opacity-80"
                />
              </div>
            </div>
            <Caption className="text-center mt-2">Scannez pour vérifier</Caption>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-3 pb-4">
          <TButton fullWidth className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Télécharger le reçu (PDF)
          </TButton>
          <TButton variant="ghost" fullWidth className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Partager par email
          </TButton>
        </div>
      </div>
    </ScreenContainer>
  );
};

export const ScreenP8 = ({ onSelectReceipt }: { onSelectReceipt: () => void }) => {
  return (
    <ScreenContainer 
      title="Historique paiements" 
      rightAction={<button><Filter className="w-5 h-5 text-[#1A1A1A]" /></button>}
    >
      <div className="flex flex-col h-full">
        {/* Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-[#E9E9E9] bg-white">
          {["Tous", "Cette semaine", "Ce mois", "Payés", "En attente", "Problèmes"].map((filter, i) => (
            <button 
              key={i}
              className={cn(
                "px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors",
                i === 2 ? "bg-[#1A1A1A] text-white" : "bg-[#F6F6F6] text-[#666666] hover:bg-[#E9E9E9]"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* Stats Card */}
          <div className="bg-[#1464F6] rounded-[16px] p-6 text-white mb-6 shadow-lg shadow-blue-200">
            <div className="text-[14px] opacity-80 mb-1">Total encaissé ce mois</div>
            <div className="text-[32px] font-bold mb-6">2 450 DT</div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-[20px] font-bold">127</div>
                <div className="text-[12px] opacity-80">Livraisons</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-[20px] font-bold">98%</div>
                <div className="text-[12px] opacity-80">Réussis</div>
              </div>
            </div>
          </div>

          <div className="mb-4 text-[14px] font-medium text-[#666666]">Décembre 2025</div>

          {/* List */}
          <div onClick={onSelectReceipt}>
            <HistoryCard status="paid" amount="45 DT" date="7 Déc 2025" orderId="12345" />
          </div>
          <HistoryCard status="paid" amount="120 DT" date="7 Déc 2025" orderId="12342" />
          <HistoryCard status="pending" amount="32 DT" date="6 Déc 2025" orderId="12339" />
          <HistoryCard status="problem" amount="65 DT" date="5 Déc 2025" orderId="12310" />
          
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <Calendar className="w-8 h-8 text-[#666666] mb-2" />
            <Caption>Fin de l'historique</Caption>
          </div>
        </div>

        {/* Bottom Nav Mockup */}
        <div className="h-[80px] bg-white border-t border-[#E9E9E9] flex justify-around items-center px-2 shrink-0">
           <div className="flex flex-col items-center gap-1 opacity-50">
              <Package className="w-6 h-6" />
              <span className="text-[10px]">Missions</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-50">
              <MapPin className="w-6 h-6" />
              <span className="text-[10px]">En cours</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-[#1464F6]">
              <CreditCard className="w-6 h-6" />
              <span className="text-[10px] font-medium">Historique</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-50">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span className="text-[10px]">Profil</span>
           </div>
        </div>
      </div>
    </ScreenContainer>
  );
};
