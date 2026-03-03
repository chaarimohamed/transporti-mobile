import React from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  Filter, 
  Package, 
  User, 
  ShieldCheck, 
  ThumbsUp, 
  MessageCircle,
  Calendar,
  Home,
  History,
  List
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

// Design System Constants
const COLORS = {
  textMain: '#1A1A1A',
  textTitle: '#444444',
  textSecondary: '#666666',
  accent: '#1464F6',
  bgApp: '#F6F6F6',
  bgCard: '#FCFCFC',
  border: '#E9E9E9',
  success: '#2E8B57',
  warning: '#FFB347',
  error: '#D92D20'
};

const MobileFrame = ({ children, title }: { children: React.ReactNode, title?: string }) => (
  <div className="w-[390px] h-[844px] bg-[#F6F6F6] border border-gray-200 overflow-hidden flex flex-col relative shadow-2xl rounded-[40px]">
    {/* Status Bar Placeholder */}
    <div className="h-[44px] w-full bg-transparent flex justify-between items-center px-6 text-xs font-semibold text-black/80 z-10">
      <span>9:41</span>
      <div className="flex gap-1">
        <div className="w-4 h-4 rounded-full bg-black/10" />
        <div className="w-4 h-4 rounded-full bg-black/10" />
      </div>
    </div>
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {children}
    </div>
    {/* Home Indicator */}
    <div className="absolute bottom-0 w-full h-[34px] flex justify-center items-center pointer-events-none">
      <div className="w-[134px] h-[5px] bg-black/20 rounded-full" />
    </div>
  </div>
);

const Header = ({ title, showBack = true }: { title?: string, showBack?: boolean }) => (
  <div className="px-6 py-4 flex items-center gap-4 bg-[#F6F6F6] sticky top-0 z-20">
    {showBack && (
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full -ml-2">
        <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" />
      </Button>
    )}
    {title && <h3 className="text-[20px] font-semibold text-[#444444] flex-1 text-center pr-8">{title}</h3>}
  </div>
);

// --- M1: Top 5 Suggested Transporters ---
const ScreenM1 = () => (
  <MobileFrame>
    <Header title="Suggestions" />
    <div className="px-6 pb-6 flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold text-[#444444] leading-tight">5 Transporteurs disponibles</h2>
        <p className="text-[#666666] text-[16px] mt-2">Les plus proches de votre point de collecte</p>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#FCFCFC] rounded-2xl p-6 border border-[#E9E9E9] shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-98 transition-transform">
            <div className="flex gap-4 items-start">
              <Avatar className="w-12 h-12 rounded-full border border-gray-100">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                <AvatarFallback>T{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[#1A1A1A] font-semibold text-[16px]">Ahmed Ben Ali</h3>
                  {i === 1 && <span className="text-[#1464F6] font-bold text-[16px]">45 DT</span>}
                </div>
                <div className="flex items-center gap-1 text-[#666666] text-[14px] mt-1">
                  <Star className="w-4 h-4 fill-[#FFB347] text-[#FFB347]" />
                  <span className="font-medium text-[#1A1A1A]">4.8</span>
                  <span>•</span>
                  <span>156 livraisons</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="bg-gray-100 text-[#666666] hover:bg-gray-200 font-normal rounded-full px-3">
                    <MapPin className="w-3 h-3 mr-1" /> 2.5 km
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-[#666666] hover:bg-gray-200 font-normal rounded-full px-3">
                    Tunis
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button className="flex-1 h-[48px] rounded-full bg-transparent border border-[#1464F6] text-[#1464F6] hover:bg-[#1464F6]/5 shadow-none font-medium">
                Inviter
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="h-20" /> {/* Spacer */}
    </div>
    <div className="absolute bottom-[34px] left-0 w-full px-6 py-4 bg-gradient-to-t from-[#F6F6F6] via-[#F6F6F6] to-transparent">
        <Button className="w-full h-[56px] rounded-full bg-[#1A1A1A] hover:bg-[#333] text-white font-medium shadow-lg">
          Voir toutes les candidatures
        </Button>
    </div>
  </MobileFrame>
);

// --- M2: Transporter Profile ---
const ScreenM2 = () => (
  <MobileFrame>
    <Header title="Ahmed Ben Ali" />
    <div className="px-6 pb-32 flex flex-col gap-8">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
           <Avatar className="w-20 h-20 rounded-full border-2 border-white shadow-md">
            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 bg-[#2E8B57] rounded-full p-1 border-2 border-white">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-[24px] font-semibold text-[#1A1A1A]">Ahmed Ben Ali</h2>
          <div className="flex items-center justify-center gap-2 mt-1 text-[#666666]">
             <Star className="w-4 h-4 fill-[#FFB347] text-[#FFB347]" />
             <span className="text-[#1A1A1A] font-medium">4.8</span>
             <span>•</span>
             <span>Tunis</span>
          </div>
          <Badge className="mt-2 bg-[#2E8B57]/10 text-[#2E8B57] hover:bg-[#2E8B57]/20 border-0 rounded-full">
            Identité vérifiée
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FCFCFC] p-4 rounded-2xl border border-[#E9E9E9] flex flex-col items-center gap-1 text-center">
            <Package className="w-6 h-6 text-[#1464F6] mb-1" />
            <span className="text-[18px] font-bold text-[#1A1A1A]">156</span>
            <span className="text-[12px] text-[#666666]">Livraisons</span>
        </div>
        <div className="bg-[#FCFCFC] p-4 rounded-2xl border border-[#E9E9E9] flex flex-col items-center gap-1 text-center">
            <ThumbsUp className="w-6 h-6 text-[#1464F6] mb-1" />
            <span className="text-[18px] font-bold text-[#1A1A1A]">98%</span>
            <span className="text-[12px] text-[#666666]">Satisfaction</span>
        </div>
        <div className="bg-[#FCFCFC] p-4 rounded-2xl border border-[#E9E9E9] flex flex-col items-center gap-1 text-center">
            <Clock className="w-6 h-6 text-[#1464F6] mb-1" />
            <span className="text-[18px] font-bold text-[#1A1A1A]">~ 2h</span>
            <span className="text-[12px] text-[#666666]">Temps réponse</span>
        </div>
        <div className="bg-[#FCFCFC] p-4 rounded-2xl border border-[#E9E9E9] flex flex-col items-center gap-1 text-center">
            <User className="w-6 h-6 text-[#1464F6] mb-1" />
            <span className="text-[18px] font-bold text-[#1A1A1A]">2023</span>
            <span className="text-[12px] text-[#666666]">Membre depuis</span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="space-y-4">
        <h3 className="text-[18px] font-semibold text-[#444444]">Véhicule</h3>
        <div className="bg-[#FCFCFC] p-5 rounded-2xl border border-[#E9E9E9]">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#1464F6]/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#1464F6]" />
                 </div>
                 <div>
                   <div className="font-semibold text-[#1A1A1A]">Fourgonnette (M)</div>
                   <div className="text-sm text-[#666666]">TUN 1234</div>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <Badge variant="secondary" className="bg-gray-100 rounded-full font-normal">Palette</Badge>
              <Badge variant="secondary" className="bg-gray-100 rounded-full font-normal">Réfrigéré</Badge>
           </div>
        </div>
      </div>

    </div>
    
    {/* Fixed Bottom Actions */}
    <div className="absolute bottom-0 w-full bg-white border-t border-[#E9E9E9] p-6 pb-10 flex flex-col gap-3">
      <Button className="w-full h-[56px] rounded-full bg-[#1464F6] hover:bg-[#1464F6]/90 text-white text-[16px] font-semibold">
        Inviter ce transporteur
      </Button>
      <Button variant="ghost" className="w-full h-[56px] rounded-full text-[#666666] hover:text-[#1A1A1A] font-medium">
        Voir ses avis
      </Button>
    </div>
  </MobileFrame>
);

// --- M3: Invitation Sent ---
const ScreenM3 = () => (
  <MobileFrame>
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#2E8B57]/10 flex items-center justify-center mb-6">
         <CheckCircle className="w-10 h-10 text-[#2E8B57]" />
      </div>
      <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-3">Invitation envoyée !</h2>
      <p className="text-[#666666] text-[16px] leading-relaxed mb-10">
        Le transporteur <strong>Ahmed Ben Ali</strong> a été notifié. Vous recevrez une réponse sous 24h.
      </p>
      
      <Button className="w-full h-[56px] rounded-full bg-[#1464F6] hover:bg-[#1464F6]/90 text-white text-[16px] font-semibold mb-4">
        Retour à mes demandes
      </Button>
      <Button variant="ghost" className="w-full h-[56px] rounded-full text-[#666666] hover:text-[#1A1A1A] font-medium">
        Inviter un autre transporteur
      </Button>
    </div>
  </MobileFrame>
);

// --- M4: Applications List ---
const ScreenM4 = () => (
  <MobileFrame>
     <Header title="Candidatures" />
     
     <div className="px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
           <Badge className="h-8 px-4 rounded-full bg-[#1A1A1A] text-white hover:bg-[#333] border-0 text-sm">Toutes (3)</Badge>
           <Badge className="h-8 px-4 rounded-full bg-white text-[#666666] border border-[#E9E9E9] hover:bg-gray-50 text-sm">Nouvelles (2)</Badge>
           <Badge className="h-8 px-4 rounded-full bg-white text-[#666666] border border-[#E9E9E9] hover:bg-gray-50 text-sm">Vues (1)</Badge>
        </div>
     </div>

     <div className="px-6 flex flex-col gap-4">
        {/* Retry Banner (Conditional example) */}
        <div className="bg-[#FFB347]/10 border border-[#FFB347]/20 p-4 rounded-2xl mb-2">
           <div className="flex gap-3">
              <Clock className="w-5 h-5 text-[#FFB347] shrink-0" />
              <div>
                 <h4 className="font-semibold text-[#1A1A1A] text-sm">Demande en attente</h4>
                 <p className="text-xs text-[#666666] mt-1">Nous notifions continuellement les transporteurs.</p>
              </div>
           </div>
        </div>

        {[1, 2, 3].map((i) => (
           <div key={i} className="bg-[#FCFCFC] rounded-2xl p-5 border border-[#E9E9E9] shadow-sm relative">
              {i < 3 && (
                 <div className="absolute top-4 right-4 bg-[#FFB347] w-2.5 h-2.5 rounded-full" />
              )}
              
              <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-3">
                    <Avatar className="w-12 h-12 rounded-full border border-gray-100">
                       <AvatarImage src={`https://i.pravatar.cc/150?u=${i+10}`} />
                       <AvatarFallback>TR</AvatarFallback>
                    </Avatar>
                    <div>
                       <h3 className="font-semibold text-[#1A1A1A]">Transport Express</h3>
                       <div className="flex items-center gap-1 text-xs text-[#666666] mt-0.5">
                          <Star className="w-3 h-3 fill-[#FFB347] text-[#FFB347]" />
                          <span className="text-[#1A1A1A] font-medium">4.8</span>
                          <span>• 156 avis</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[18px] font-bold text-[#1464F6]">45 DT</div>
                    <div className="text-xs text-[#666666]">Il y a 2h</div>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-[#666666] mb-4 px-1">
                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 2.5 km</span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full" />
                 <span>Véhicule vérifié</span>
              </div>

              <Button className="w-full h-[44px] rounded-full bg-[#1A1A1A] hover:bg-[#333] text-white text-sm font-medium">
                 Voir profil & offre
              </Button>
           </div>
        ))}
     </div>
  </MobileFrame>
);

// --- M5: Application Detail ---
const ScreenM5 = () => (
  <MobileFrame>
    <Header title="Détail Candidature" />
    <div className="px-6 pb-32 flex flex-col gap-6">
       
       {/* Mini Profile */}
       <div className="bg-white rounded-2xl p-4 border border-[#E9E9E9] flex items-center gap-4">
          <Avatar className="w-14 h-14 rounded-full">
             <AvatarImage src="https://i.pravatar.cc/150?u=11" />
             <AvatarFallback>TE</AvatarFallback>
          </Avatar>
          <div className="flex-1">
             <h3 className="font-semibold text-[#1A1A1A] text-lg">Transport Express</h3>
             <div className="flex items-center gap-1 text-sm text-[#666666]">
                <Star className="w-3 h-3 fill-[#FFB347] text-[#FFB347]" />
                <span>4.9 (120 avis)</span>
             </div>
             <div className="text-sm text-[#1464F6] mt-1 font-medium">Voir le profil complet</div>
          </div>
       </div>

       {/* Proposal */}
       <div className="bg-[#1464F6]/5 rounded-2xl p-6 border border-[#1464F6]/20">
          <h3 className="text-[#1464F6] font-semibold mb-4 text-sm uppercase tracking-wide">Proposition</h3>
          <div className="flex justify-between items-baseline mb-4">
             <span className="text-[#666666]">Prix accepté</span>
             <span className="text-[28px] font-bold text-[#1A1A1A]">45 DT</span>
          </div>
          <div className="space-y-3">
             <div className="flex gap-3 text-[#1A1A1A]">
                <Clock className="w-5 h-5 text-[#666666]" />
                <div>
                   <div className="font-medium">Aujourd'hui</div>
                   <div className="text-sm text-[#666666]">14:00 - 18:00</div>
                </div>
             </div>
             <div className="flex gap-3 text-[#1A1A1A] pt-2">
                <MessageCircle className="w-5 h-5 text-[#666666]" />
                <div className="text-sm italic text-[#666666]">
                   "Je suis disponible et j'ai de la place dans mon camion. Je peux prendre soin de votre palette."
                </div>
             </div>
          </div>
       </div>

       {/* Request Recap */}
       <div className="space-y-3">
          <h3 className="text-[16px] font-semibold text-[#444444]">Votre demande</h3>
          <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-2xl p-4 space-y-4">
             <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 mt-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
                   <div className="w-0.5 h-8 bg-gray-200" />
                   <div className="w-2.5 h-2.5 rounded-full border-2 border-[#1A1A1A]" />
                </div>
                <div className="space-y-6">
                   <div>
                      <div className="font-medium text-[#1A1A1A]">Tunis, Les Berges du Lac</div>
                      <div className="text-xs text-[#666666]">Rue du Lac 1</div>
                   </div>
                   <div>
                      <div className="font-medium text-[#1A1A1A]">Ariana, Soukra</div>
                      <div className="text-xs text-[#666666]">Av. de l'UMA</div>
                   </div>
                </div>
             </div>
             <Separator />
             <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Palette • 5-10 kg</span>
             </div>
          </div>
       </div>
    </div>

    <div className="absolute bottom-0 w-full bg-white border-t border-[#E9E9E9] p-6 pb-10 flex flex-col gap-3">
      <Button className="w-full h-[56px] rounded-full bg-[#1464F6] hover:bg-[#1464F6]/90 text-white text-[16px] font-semibold">
        Approuver cette candidature
      </Button>
      <Button variant="ghost" className="w-full h-[56px] rounded-full text-[#D92D20] hover:bg-[#D92D20]/5 font-medium">
        Refuser
      </Button>
    </div>
  </MobileFrame>
);

// --- M6: Matching Confirmed ---
const ScreenM6 = () => (
  <MobileFrame>
     <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-[#2E8B57]/10 flex items-center justify-center mb-6 animate-bounce">
           <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-3 text-center">Match confirmé !</h2>
        <p className="text-[#666666] text-[16px] text-center mb-10">
           Vous avez approuvé <strong>Transport Express</strong>.<br/>Votre commande #12345 est créée.
        </p>

        <div className="w-full bg-[#FCFCFC] border border-[#E9E9E9] rounded-2xl p-5 mb-8 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12">
                 <AvatarImage src="https://i.pravatar.cc/150?u=11" />
                 <AvatarFallback>TE</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                 <div className="font-semibold text-[#1A1A1A]">Transport Express</div>
                 <div className="text-sm text-[#666666]">En attente de collecte</div>
              </div>
              <div className="font-bold text-[#1464F6]">45 DT</div>
           </div>
           <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-1/4 h-full bg-[#1464F6]" />
           </div>
        </div>

        <div className="w-full space-y-3">
           <Button className="w-full h-[56px] rounded-full bg-[#1464F6] hover:bg-[#1464F6]/90 text-white text-[16px] font-semibold">
              Voir ma commande
           </Button>
           <Button variant="ghost" className="w-full h-[56px] rounded-full text-[#1A1A1A] border border-[#E9E9E9] font-medium">
              Contacter le transporteur
           </Button>
        </div>
     </div>
  </MobileFrame>
);

// --- M7: Available Requests (Transporter View) ---
const ScreenM7 = () => (
  <MobileFrame>
     <div className="px-6 py-4 flex justify-between items-center bg-[#F6F6F6] sticky top-0 z-20">
        <h2 className="text-[24px] font-bold text-[#1A1A1A]">Missions</h2>
        <Button size="icon" variant="ghost" className="rounded-full bg-white shadow-sm border border-[#E9E9E9]">
           <Filter className="w-5 h-5 text-[#1A1A1A]" />
        </Button>
     </div>

     <div className="px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
           <Badge className="h-8 px-4 rounded-full bg-[#1A1A1A] text-white border-0 text-sm cursor-pointer">Toutes</Badge>
           <Badge className="h-8 px-4 rounded-full bg-white text-[#666666] border border-[#E9E9E9] hover:bg-gray-50 text-sm cursor-pointer">&lt; 5 km</Badge>
           <Badge className="h-8 px-4 rounded-full bg-white text-[#666666] border border-[#E9E9E9] hover:bg-gray-50 text-sm cursor-pointer">&lt; 20 km</Badge>
        </div>
     </div>

     <div className="px-6 flex flex-col gap-4 pb-24">
        {[1, 2, 3].map((i) => (
           <div key={i} className="bg-[#FCFCFC] rounded-2xl p-5 border border-[#E9E9E9] shadow-sm relative active:scale-98 transition-transform">
              <div className="flex justify-between items-start mb-4">
                 <Badge variant="secondary" className="bg-gray-100 text-[#666666] font-normal flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {i === 1 ? '2.5' : '12'} km
                 </Badge>
                 {i === 1 && <Badge className="bg-[#FFB347]/20 text-[#FFB347] hover:bg-[#FFB347]/30 border-0 flex gap-1">
                    <span>🔥</span> Urgent
                 </Badge>}
              </div>

              <div className="flex gap-3 mb-4 relative">
                 <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#666666]" />
                    <div className="w-0.5 h-6 bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#666666]" />
                 </div>
                 <div className="space-y-4 flex-1">
                    <div className="font-semibold text-[#1A1A1A] leading-none">Tunis</div>
                    <div className="font-semibold text-[#1A1A1A] leading-none">Sousse</div>
                 </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#666666] mb-4 bg-gray-50 p-3 rounded-xl">
                 <div className="flex items-center gap-1 font-medium text-[#1A1A1A]"><Package className="w-4 h-4 text-[#666666]" /> Palette</div>
                 <div className="w-px h-3 bg-gray-300" />
                 <span>5-10 kg</span>
                 <div className="w-px h-3 bg-gray-300" />
                 <span>30 Nov</span>
              </div>

              <div className="flex items-center justify-between">
                 <div className="text-[22px] font-bold text-[#1464F6]">45 DT <span className="text-xs text-[#666666] font-normal">estimé</span></div>
                 <Button className="h-[40px] px-6 rounded-full bg-[#1A1A1A] text-white text-sm font-medium">
                    Voir détails
                 </Button>
              </div>
           </div>
        ))}
     </div>

     {/* Bottom Tab Bar */}
     <div className="absolute bottom-[34px] left-6 right-6 h-[64px] bg-[#1A1A1A] rounded-full shadow-2xl flex justify-around items-center px-2 z-30">
        <div className="flex flex-col items-center justify-center gap-1 w-16">
           <List className="w-6 h-6 text-white" />
           <span className="text-[10px] text-white font-medium">Missions</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 w-16 opacity-50">
           <Package className="w-6 h-6 text-white" />
           <span className="text-[10px] text-white font-medium">En cours</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 w-16 opacity-50">
           <History className="w-6 h-6 text-white" />
           <span className="text-[10px] text-white font-medium">Historique</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 w-16 opacity-50">
           <User className="w-6 h-6 text-white" />
           <span className="text-[10px] text-white font-medium">Profil</span>
        </div>
     </div>
  </MobileFrame>
);

// --- M8: Mission Detail (Transporter View) ---
const ScreenM8 = () => (
  <MobileFrame>
    <Header title="Détails Mission" />
    <div className="px-6 pb-40 flex flex-col gap-6">
       
       {/* Header Status */}
       <div className="flex justify-between items-center">
          <Badge className="bg-[#2E8B57]/10 text-[#2E8B57] hover:bg-[#2E8B57]/20 border-0 px-3 py-1">
             DISPONIBLE
          </Badge>
          <div className="flex items-center gap-1 text-sm text-[#666666]">
             <MapPin className="w-4 h-4" />
             2.5 km de vous
          </div>
       </div>

       {/* Map Placeholder */}
       <div className="w-full h-[160px] bg-gray-200 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-[#666666]/50 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center opacity-50">
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <MapPin className="w-8 h-8 text-[#1A1A1A] drop-shadow-md" />
          </div>
       </div>

       {/* Route Info */}
       <div className="bg-[#FCFCFC] border border-[#E9E9E9] rounded-2xl p-5">
          <div className="flex gap-4 mb-4">
             <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-[#1464F6]" />
                <div className="w-0.5 h-10 bg-gray-200" />
                <div className="w-3 h-3 rounded-full border-2 border-[#1A1A1A]" />
             </div>
             <div className="space-y-6 flex-1">
                <div>
                   <div className="font-semibold text-[#1A1A1A]">Tunis, Les Berges du Lac</div>
                   <div className="text-sm text-[#666666]">Rue du Lac 1, Résidence A</div>
                </div>
                <div>
                   <div className="font-semibold text-[#1A1A1A]">Ariana, Soukra</div>
                   <div className="text-sm text-[#666666]">Av. de l'UMA, Bâtiment B</div>
                </div>
             </div>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between items-center text-sm">
             <div className="flex items-center gap-2 text-[#1A1A1A]">
                <Calendar className="w-4 h-4 text-[#666666]" />
                30 Nov 2025
             </div>
             <div className="text-[#666666]">14h - 18h</div>
          </div>
       </div>

       {/* Cargo Info */}
       <div className="space-y-3">
          <h3 className="text-[16px] font-semibold text-[#444444]">Cargaison</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-[#FCFCFC] border border-[#E9E9E9] p-3 rounded-xl text-center">
                <div className="text-sm text-[#666666] mb-1">Type</div>
                <div className="font-semibold text-[#1A1A1A]">Palette</div>
             </div>
             <div className="bg-[#FCFCFC] border border-[#E9E9E9] p-3 rounded-xl text-center">
                <div className="text-sm text-[#666666] mb-1">Poids</div>
                <div className="font-semibold text-[#1A1A1A]">5-10 kg</div>
             </div>
          </div>
          <div className="text-sm text-[#666666] bg-gray-50 p-3 rounded-xl">
             Attention : Contenu fragile, manipuler avec précaution.
          </div>
       </div>

       {/* Sender Info */}
       <div className="flex items-center gap-3 py-2">
          <Avatar>
             <AvatarImage src="https://i.pravatar.cc/150?u=55" />
             <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
             <div className="font-semibold text-[#1A1A1A]">Sarra M.</div>
             <div className="text-xs text-[#666666]">Membre depuis 2022 • ⭐ 5.0</div>
          </div>
       </div>

       {/* Price & Action */}
       <div className="bg-[#F6F6F6] rounded-2xl p-5 space-y-4 border border-[#E9E9E9]">
          <div className="flex justify-between items-center">
             <span className="text-[#666666]">Prix estimé</span>
             <span className="text-xl font-bold text-[#1A1A1A]">45 DT</span>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-semibold text-[#444444] uppercase">Votre offre</label>
             <Input className="h-[56px] bg-white border-[#E9E9E9] text-lg font-semibold" defaultValue="45 DT" />
             <p className="text-xs text-[#666666]">Vous pouvez ajuster le prix si nécessaire.</p>
          </div>
       </div>

    </div>

    <div className="absolute bottom-0 w-full bg-white border-t border-[#E9E9E9] p-6 pb-10">
      <Button className="w-full h-[56px] rounded-full bg-[#1464F6] hover:bg-[#1464F6]/90 text-white text-[16px] font-semibold shadow-xl shadow-blue-100">
        Postuler maintenant
      </Button>
      <p className="text-center text-[10px] text-[#666666] mt-3">L'expéditeur sera notifié instantanément</p>
    </div>
  </MobileFrame>
);


export const TransportiMatchingScreens = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-12 overflow-x-auto">
      <div className="flex flex-col gap-12 min-w-max">
        
        {/* Header */}
        <div className="space-y-2">
           <h1 className="text-3xl font-bold text-[#1A1A1A]">Transporti.tn - Matching System</h1>
           <p className="text-[#666666]">Flux de matching, candidatures et espace transporteur</p>
        </div>

        {/* Group 1: Auto-Matching (Sender) */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#1464F6] text-white flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-semibold text-[#444444]">Groupe 1 : Auto-Matching (Expéditeur)</h2>
           </div>
           <div className="flex gap-[80px]">
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM1 />
                 <span className="font-mono text-sm text-gray-500">M1 - Top 5</span>
              </div>
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM2 />
                 <span className="font-mono text-sm text-gray-500">M2 - Profil Transporteur</span>
              </div>
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM3 />
                 <span className="font-mono text-sm text-gray-500">M3 - Invitation</span>
              </div>
           </div>
        </div>

        <Separator className="bg-gray-300" />

        {/* Group 2: Candidatures (Sender) */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#1464F6] text-white flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-semibold text-[#444444]">Groupe 2 : Candidatures (Expéditeur)</h2>
           </div>
           <div className="flex gap-[80px]">
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM4 />
                 <span className="font-mono text-sm text-gray-500">M4 - Liste Candidatures</span>
              </div>
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM5 />
                 <span className="font-mono text-sm text-gray-500">M5 - Détail Candidature</span>
              </div>
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM6 />
                 <span className="font-mono text-sm text-gray-500">M6 - Confirmation</span>
              </div>
           </div>
        </div>

        <Separator className="bg-gray-300" />

        {/* Group 3: Available Requests (Transporter) */}
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold">3</div>
              <h2 className="text-xl font-semibold text-[#444444]">Groupe 3 : Espace Transporteur</h2>
           </div>
           <div className="flex gap-[80px]">
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM7 />
                 <span className="font-mono text-sm text-gray-500">M7 - Missions Disponibles</span>
              </div>
              <div className="flex flex-col gap-4 items-center">
                 <ScreenM8 />
                 <span className="font-mono text-sm text-gray-500">M8 - Détail Mission + Postuler</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
