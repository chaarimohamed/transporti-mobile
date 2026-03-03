import React from "react";
import { ScreenFrame, TButton, TCard, TBadge, BottomNav, DS, StatusTimeline } from "./Shared";
import { ChevronLeft, Bell, User, Settings, LogOut, CreditCard, FileText, MessageSquare, Shield, Mail, Phone } from "lucide-react";

// --- D1: Tracking ---
export const Tracking = () => {
  return (
    <ScreenFrame title="D1 – Suivi d’Expédition">
       <div className="px-6 pt-12 pb-4 bg-white flex items-center gap-4 border-b border-[#E9E9E9] z-10 relative shadow-sm">
        <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center"><ChevronLeft size={20} /></button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">Suivi #EXP-2938</h1>
      </div>

      <div className="flex-1 relative">
        {/* Fake Map Background */}
        <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
           <div className="text-[#999] font-bold text-4xl opacity-20 rotate-[-15deg]">MAP VIEW</div>
           {/* Route path mock */}
           <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <path d="M100,200 Q200,400 300,300" fill="none" stroke="#1464F6" strokeWidth="4" strokeDasharray="8 4" />
              <circle cx="100" cy="200" r="6" fill="#1464F6" />
              <circle cx="300" cy="300" r="6" fill="#1464F6" />
           </svg>
           {/* Truck Marker */}
           <div className="absolute top-[35%] left-[45%] w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-[#1464F6] z-10 border-2 border-[#1464F6]">
              <span className="text-xl">🚚</span>
           </div>
        </div>

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-2xl p-6 pb-8">
           <div className="w-12 h-1 bg-[#E9E9E9] rounded-full mx-auto mb-6" />
           
           <div className="mb-6">
             <StatusTimeline steps={["Créée", "Pris en charge", "En transit", "Livré"]} currentStep={2} />
             <div className="text-center mt-2 text-sm font-bold text-[#1464F6]">En route vers Sousse</div>
             <div className="text-center text-xs text-[#666666]">Arrivée estimée : 16:30</div>
           </div>

           <TCard className="flex items-center gap-4 border border-[#E9E9E9] shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#F6F6F6] overflow-hidden border border-[#E9E9E9]">
                 <User size={48} className="translate-y-2 text-[#999]" /> 
              </div>
              <div className="flex-1">
                 <div className="font-bold text-[#1A1A1A]">Sami Ben Ali</div>
                 <div className="flex items-center gap-2 text-xs text-[#666666]">
                    <span>⭐ 4.8</span>
                    <span>•</span>
                    <span className="bg-[#E9E9E9] px-1.5 py-0.5 rounded text-[10px]">184 TN 2938</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#1A1A1A]">
                    <MessageSquare size={18} />
                 </button>
                 <button className="w-10 h-10 rounded-full bg-[#1464F6] flex items-center justify-center text-white">
                    <Phone size={18} />
                 </button>
              </div>
           </TCard>
        </div>
      </div>
    </ScreenFrame>
  );
};

// --- D2: Notifications ---
export const Notifications = () => {
  return (
    <ScreenFrame title="D2 – Notifications">
      <div className="px-6 pt-12 pb-2 bg-white border-b border-[#E9E9E9]">
         <h1 className="text-[24px] font-bold text-[#1A1A1A]">Notifications</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {[
           { title: "Expédition acceptée", desc: "Votre expédition #REF123 a été acceptée par Sami Transport.", time: "Il y a 5 min", type: "success" },
           { title: "Nouveau message", desc: "Le transporteur vous a envoyé une photo.", time: "Il y a 20 min", type: "info" },
           { title: "Mission terminée", desc: "La livraison #REF992 a été confirmée.", time: "Il y a 1h", type: "neutral" },
         ].map((notif, i) => (
           <div key={i} className="p-4 bg-white border border-[#E9E9E9] rounded-[16px] flex gap-3 items-start shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                notif.type === 'success' ? 'bg-[#2E8B57]/10 text-[#2E8B57]' : 
                notif.type === 'info' ? 'bg-[#1464F6]/10 text-[#1464F6]' : 'bg-[#F6F6F6] text-[#666666]'
              }`}>
                 <Bell size={20} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#1A1A1A] text-sm">{notif.title}</h3>
                    <span className="text-[10px] text-[#666666] whitespace-nowrap ml-2">{notif.time}</span>
                 </div>
                 <p className="text-xs text-[#666666] mt-1 leading-relaxed">{notif.desc}</p>
              </div>
           </div>
         ))}
      </div>
      <BottomNav active="notifications" role="sender" />
    </ScreenFrame>
  );
};

// --- D3: Profile ---
export const Profile = () => {
  return (
    <ScreenFrame title="D3 – Profil Utilisateur">
       <div className="px-6 pt-12 pb-6 bg-white border-b border-[#E9E9E9] flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#F6F6F6] border-4 border-white shadow-lg mb-4 overflow-hidden flex items-center justify-center">
             <User size={48} className="text-[#CCC]" />
          </div>
          <h1 className="text-[22px] font-bold text-[#1A1A1A]">Ahmed Ben Salah</h1>
          <p className="text-sm text-[#666666]">Expéditeur • Membre depuis 2023</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
         {[
           { icon: User, label: "Informations personnelles" },
           { icon: CreditCard, label: "Moyens de paiement" },
           { icon: Bell, label: "Préférences de notification", href: "settings" },
           { icon: Shield, label: "Sécurité et Confidentialité" },
           { icon: FileText, label: "Conditions Générales" },
         ].map((item, i) => (
           <button key={i} className="w-full flex items-center justify-between p-4 bg-white border border-[#E9E9E9] rounded-[16px] hover:bg-[#F9F9F9] transition-colors">
              <div className="flex items-center gap-3">
                 <item.icon size={20} className="text-[#666666]" />
                 <span className="font-medium text-[#1A1A1A] text-sm">{item.label}</span>
              </div>
              <ChevronLeft size={16} className="rotate-180 text-[#CCC]" />
           </button>
         ))}

         <div className="pt-4">
            <button className="w-full p-4 flex items-center justify-center gap-2 text-[#D92D20] font-medium bg-[#D92D20]/5 rounded-[16px]">
               <LogOut size={18} /> Déconnexion
            </button>
         </div>
      </div>
      <BottomNav active="profile" role="sender" />
    </ScreenFrame>
  );
};

// --- D4: Notification Settings ---
export const NotificationSettings = () => {
  return (
    <ScreenFrame title="D4 – Paramètres Notifications">
      <div className="px-6 pt-12 pb-4 bg-white flex items-center gap-4 border-b border-[#E9E9E9]">
        <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center"><ChevronLeft size={20} /></button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">Notifications</h1>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
         <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#444444] uppercase tracking-wider">Canaux</h3>
            <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-[#E9E9E9]">
               <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[#1464F6]" />
                  <span className="font-medium text-[#1A1A1A]">Push Mobile</span>
               </div>
               <div className="w-12 h-6 bg-[#1464F6] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-[#E9E9E9]">
               <div className="flex items-center gap-3">
                  <Mail size={20} className="text-[#666666]" />
                  <span className="font-medium text-[#1A1A1A]">Email</span>
               </div>
               <div className="w-12 h-6 bg-[#E9E9E9] rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
               </div>
            </div>
         </div>

         <div className="w-full h-[1px] bg-[#E9E9E9]" />

         <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#444444] uppercase tracking-wider">Alertes</h3>
            {[
               "Mises à jour de statut",
               "Nouvelles offres de mission",
               "Messages reçus",
               "Promotions et actus"
            ].map((label, i) => (
               <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-[#1A1A1A]">{label}</span>
                  <div className={`w-12 h-6 ${i < 3 ? "bg-[#1464F6]" : "bg-[#E9E9E9]"} rounded-full relative cursor-pointer`}>
                     <div className={`absolute ${i < 3 ? "right-1" : "left-1"} top-1 w-4 h-4 bg-white rounded-full shadow-sm`} />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </ScreenFrame>
  );
};
