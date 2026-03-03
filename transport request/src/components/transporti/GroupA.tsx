import React from "react";
import { ScreenFrame, TButton, TCard, TBadge, BottomNav, DS } from "./Shared";
import { Bell, Plus, Search, MapPin, ArrowRight, Package, Calendar, TrendingUp, Truck, Filter } from "lucide-react";

// --- A1: Dashboard Sender ---
export const DashboardSender = () => {
  return (
    <ScreenFrame title="A1 – Dashboard Expéditeur">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E9E9E9] flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-[#1464F6] rounded-lg flex items-center justify-center text-white font-bold text-xs">T</div>
           <div>
             <h1 className="text-[20px] font-bold text-[#444444]">Bonjour, Ahmed</h1>
           </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#1A1A1A]">
          <Bell size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 space-y-6">
        {/* CTA */}
        <TButton fullWidth className="shadow-lg shadow-[#1464F6]/20">
          <Plus size={20} />
          Nouvelle expédition
        </TButton>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <TCard padding="p-3" className="flex flex-col items-center justify-center gap-1">
             <span className="text-[24px] font-bold text-[#1464F6]">12</span>
             <span className="text-[12px] text-[#666666]">En cours</span>
          </TCard>
          <TCard padding="p-3" className="flex flex-col items-center justify-center gap-1">
             <span className="text-[24px] font-bold text-[#FFB347]">3</span>
             <span className="text-[12px] text-[#666666]">En attente</span>
          </TCard>
          <TCard padding="p-3" className="flex flex-col items-center justify-center gap-1">
             <span className="text-[24px] font-bold text-[#2E8B57]">48</span>
             <span className="text-[12px] text-[#666666]">Livrées</span>
          </TCard>
        </div>

        {/* List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[18px] font-bold text-[#444444]">Expéditions récentes</h2>
            <button className="text-[14px] text-[#1464F6] font-medium">Tout voir</button>
          </div>

          {/* Cards */}
          {[
            { ref: "EXP-2938", from: "Tunis", to: "Sousse", date: "24 Nov", price: "120 TND", status: "En transit", statusType: "warning" },
            { ref: "EXP-2939", from: "Ariana", to: "Bizerte", date: "23 Nov", price: "85 TND", status: "Livré", statusType: "success" },
            { ref: "EXP-2940", from: "Sfax", to: "Gabès", date: "22 Nov", price: "210 TND", status: "En attente", statusType: "neutral" },
          ].map((item, i) => (
            <TCard key={i} className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#F6F6F6] rounded-full flex items-center justify-center text-[#666666]">
                    <Package size={16} />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A1A]">{item.ref}</div>
                    <div className="text-[12px] text-[#666666]">{item.date} • {item.price}</div>
                  </div>
                </div>
                <TBadge text={item.status} status={item.statusType as any} />
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#444444] pl-10">
                 <span>{item.from}</span>
                 <ArrowRight size={14} className="text-[#999]" />
                 <span>{item.to}</span>
              </div>
            </TCard>
          ))}
        </div>
      </div>

      <BottomNav active="home" role="sender" />
    </ScreenFrame>
  );
};

// --- A2: Dashboard Carrier ---
export const DashboardCarrier = () => {
  return (
    <ScreenFrame title="A2 – Dashboard Transporteur">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E9E9E9] flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-[#1464F6] rounded-lg flex items-center justify-center text-white font-bold text-xs">T</div>
           <div>
             <h1 className="text-[20px] font-bold text-[#444444]">Bonjour, Sami</h1>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 space-y-6">
        {/* Main KPI */}
        <div className="w-full h-[140px] rounded-[24px] bg-[#1A1A1A] p-6 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <Truck size={120} />
          </div>
          <div>
            <div className="text-white/70 text-sm mb-1">Livraisons en cours</div>
            <div className="text-4xl font-bold">5</div>
          </div>
          <div className="flex justify-end">
            <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition">
              Voir les détails
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           <TCard padding="p-4" className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1464F6]/10 flex items-center justify-center text-[#1464F6]">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#1A1A1A]">2 450 TND</div>
                <div className="text-[12px] text-[#666666]">Gains ce mois</div>
              </div>
           </TCard>
           <TCard padding="p-4" className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center text-[#2E8B57]">
                <Package size={18} />
              </div>
              <div>
                <div className="text-[20px] font-bold text-[#1A1A1A]">127</div>
                <div className="text-[12px] text-[#666666]">Livraisons totales</div>
              </div>
           </TCard>
        </div>

        {/* Missions Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[18px] font-bold text-[#444444]">Missions disponibles</h2>
            <button className="flex items-center gap-1 text-[14px] text-[#1464F6] font-medium bg-[#1464F6]/5 px-3 py-1.5 rounded-full">
               <Filter size={14} />
               Filtrer
            </button>
          </div>

          {/* Mission Cards */}
          {[
            { from: "Tunis", to: "Hammamet", cargo: "Palette", price: "150 TND", date: "Aujourd'hui, 14:00" },
            { from: "Sousse", to: "Monastir", cargo: "Fragile", price: "80 TND", date: "Demain, 09:00" },
          ].map((m, i) => (
            <TCard key={i} className="flex flex-col gap-3">
               <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-[15px]">
                     {m.from} <ArrowRight size={14} className="text-[#999]" /> {m.to}
                   </div>
                   <div className="text-[12px] text-[#666666] mt-1 flex items-center gap-2">
                     <Calendar size={12} /> {m.date}
                   </div>
                 </div>
                 <div className="text-[#1464F6] font-bold text-[16px]">{m.price}</div>
               </div>
               
               <div className="flex justify-between items-center mt-1">
                  <TBadge text={m.cargo} status="neutral" />
                  <TButton size="sm" className="h-8 px-4 text-[12px]">Accepter</TButton>
               </div>
            </TCard>
          ))}
        </div>
      </div>

      <BottomNav active="missions" role="carrier" />
    </ScreenFrame>
  );
};
