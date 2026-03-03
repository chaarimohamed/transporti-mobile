import React from "react";
import { ScreenFrame, TButton, TCard, TBadge, TInput, BottomNav, DS } from "./Shared";
import { ChevronLeft, MapPin, Calendar, Package, Truck, Filter, DollarSign, Camera, CheckCircle, Navigation, Clock } from "lucide-react";

// --- C1: Mission List ---
export const MissionList = () => {
  const filters = ["Toutes", "Proches", "Date", "Prix"];
  return (
    <ScreenFrame title="C1 – Liste des Missions">
      <div className="px-6 pt-12 pb-2 bg-white border-b border-[#E9E9E9]">
         <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-4">Missions</h1>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {filters.map((f, i) => (
             <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium border border-[#E9E9E9] whitespace-nowrap ${i === 1 ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A]"}`}>
               {f}
             </button>
           ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[1, 2, 3].map((_, i) => (
          <TCard key={i} className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-[#1A1A1A] font-bold">
                    Tunis <span className="text-[#999]">→</span> Beja
                 </div>
                 <div className="text-xs text-[#666666] flex items-center gap-2">
                   <span className="flex items-center gap-1"><MapPin size={10} /> 105 km</span>
                   <span className="flex items-center gap-1"><Clock size={10} /> 2h 30</span>
                 </div>
               </div>
               <div className="text-[#1464F6] font-bold text-lg">180 TND</div>
            </div>
            <div className="flex gap-2">
               <TBadge text="Palette" status="neutral" />
               <TBadge text="Urgent" status="warning" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TButton variant="ghost" size="sm" className="bg-[#F6F6F6]">Détails</TButton>
              <TButton size="sm">Accepter</TButton>
            </div>
          </TCard>
        ))}
      </div>
      <BottomNav active="missions" role="carrier" />
    </ScreenFrame>
  );
};

// --- C2: Mission Details ---
export const MissionDetails = () => {
  return (
    <ScreenFrame title="C2 – Détails Mission">
      <div className="px-6 pt-12 pb-4 bg-white flex items-center gap-4 border-b border-[#E9E9E9]">
        <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center"><ChevronLeft size={20} /></button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">Détails Mission</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#E9E9E9] flex items-center justify-center font-bold text-[#666666]">SF</div>
               <div>
                 <div className="font-bold text-[#1A1A1A]">Société Fruits</div>
                 <div className="text-xs text-[#666666]">⭐ 4.5</div>
               </div>
            </div>
            <div className="text-xs bg-[#E9E9E9] px-2 py-1 rounded text-[#666666]">Expéditeur</div>
         </div>

         <TCard className="space-y-4">
           <div className="flex gap-3">
              <div className="mt-1 text-[#1464F6]"><MapPin size={18} /></div>
              <div>
                <div className="text-xs text-[#666666]">Collecte</div>
                <div className="font-medium">Marché de Gros, Tunis</div>
                <div className="text-xs text-[#666666] mt-1">Aujourd'hui, 14:00 - 16:00</div>
              </div>
           </div>
           <div className="w-full border-b border-dashed border-[#E9E9E9]" />
           <div className="flex gap-3">
              <div className="mt-1 text-[#1464F6]"><MapPin size={18} /></div>
              <div>
                <div className="text-xs text-[#666666]">Livraison</div>
                <div className="font-medium">Supermarché Aziza, Beja</div>
                <div className="text-xs text-[#666666] mt-1">Demain avant 12:00</div>
              </div>
           </div>
         </TCard>

         <div className="space-y-3">
           <div className="flex justify-between items-center p-4 bg-[#1464F6]/5 rounded-[16px] border border-[#1464F6]/10">
              <span className="font-medium text-[#1A1A1A]">Prix proposé</span>
              <span className="text-xl font-bold text-[#1464F6]">230,00 TND</span>
           </div>
           
           <div>
             <label className="text-sm font-medium ml-1 mb-1 block text-[#1A1A1A]">Contre-proposition ?</label>
             <div className="flex gap-2">
                <TInput placeholder="Votre prix" className="h-[48px]" />
                <TButton variant="secondary" className="h-[48px]">Envoyer</TButton>
             </div>
           </div>
         </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9] flex gap-4">
         <TButton variant="ghost" className="flex-1 text-[#666666]">Refuser</TButton>
         <TButton className="flex-[2]">Accepter la mission</TButton>
      </div>
    </ScreenFrame>
  );
};

// --- C3: Active Missions ---
export const ActiveMissions = () => {
  return (
    <ScreenFrame title="C3 – Missions en cours">
       <div className="px-6 pt-12 pb-2 bg-white border-b border-[#E9E9E9]">
         <h1 className="text-[24px] font-bold text-[#1A1A1A]">En cours</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         <TCard className="flex flex-col gap-4 border-l-4 border-l-[#1464F6]">
            <div className="flex justify-between items-center">
               <TBadge text="À récupérer" status="info" />
               <span className="text-xs font-bold text-[#1A1A1A]">REF-9921</span>
            </div>
            <div className="flex flex-col gap-2">
               <div className="font-bold text-[#1A1A1A] text-lg">Tunis → Sousse</div>
               <div className="text-sm text-[#666666]">Attendu à 14:30</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
               <TButton variant="secondary" size="sm">Voir le détail</TButton>
               <TButton size="sm">Mettre à jour</TButton>
            </div>
         </TCard>

         <TCard className="flex flex-col gap-4 border-l-4 border-l-[#FFB347]">
            <div className="flex justify-between items-center">
               <TBadge text="En transit" status="warning" />
               <span className="text-xs font-bold text-[#1A1A1A]">REF-4421</span>
            </div>
            <div className="flex flex-col gap-2">
               <div className="font-bold text-[#1A1A1A] text-lg">Sfax → Gabès</div>
               <div className="text-sm text-[#666666]">Livraison estimée : 18:00</div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
               <TButton variant="secondary" size="sm">Voir le détail</TButton>
               <TButton size="sm">Mettre à jour</TButton>
            </div>
         </TCard>
      </div>
      <BottomNav active="active" role="carrier" />
    </ScreenFrame>
  );
};

// --- C4: Update Status ---
export const UpdateStatus = () => {
  return (
    <ScreenFrame title="C4 – Mise à jour Statut">
      <div className="px-6 pt-12 pb-4 bg-white flex items-center gap-4 border-b border-[#E9E9E9]">
        <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center"><ChevronLeft size={20} /></button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">Suivi de mission</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
         <div className="relative border-l-2 border-[#E9E9E9] ml-4 space-y-8 py-2">
            {/* Step 1: To Pickup */}
            <div className="relative pl-8">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#2E8B57] border-2 border-white shadow-sm"></div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">À récupérer</h3>
                  <p className="text-xs text-[#666666]">Marché de Gros, Tunis</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[#2E8B57] text-xs font-medium bg-[#2E8B57]/10 px-2 py-1 rounded w-fit">
                     <CheckCircle size={12} /> Effectué à 14:15
                  </div>
               </div>
            </div>

            {/* Step 2: Loaded */}
            <div className="relative pl-8">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#1464F6] border-2 border-white shadow-sm ring-4 ring-[#1464F6]/20"></div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Chargement</h3>
                  <p className="text-xs text-[#666666]">Confirmation du chargement</p>
                  <div className="mt-3">
                     <TButton size="sm" className="h-8 text-xs px-3 bg-[#1464F6]">Marquer comme effectué</TButton>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="flex items-center gap-1 text-xs text-[#666666] border border-[#E9E9E9] rounded-lg px-3 py-2 bg-white">
                      <Camera size={14} /> Ajouter photo
                    </button>
                  </div>
               </div>
            </div>

            {/* Step 3: In Transit */}
            <div className="relative pl-8 opacity-50">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#E9E9E9]"></div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">En route</h3>
                  <p className="text-xs text-[#666666]">Vers destination</p>
               </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="relative pl-8 opacity-50">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#E9E9E9]"></div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Livré</h3>
                  <p className="text-xs text-[#666666]">Signature client</p>
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9]">
         <TButton fullWidth disabled className="opacity-50 bg-[#666666]">Confirmer la livraison</TButton>
         <div className="text-center mt-2 text-[10px] text-[#666666]">Disponible uniquement à la dernière étape</div>
      </div>
    </ScreenFrame>
  );
};
