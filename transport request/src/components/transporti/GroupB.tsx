import React from "react";
import {
  ScreenFrame,
  TButton,
  TCard,
  TBadge,
  TInput,
  BottomNav,
  DS,
  StatusTimeline,
} from "./Shared";
import {
  ChevronLeft,
  Search,
  ArrowRight,
  Package,
  Info,
  MapPin,
  Calendar,
  Scale,
  Shield,
  DollarSign,
  Phone,
  User,
  X,
  Clock,
} from "lucide-react";

// --- B1: Shipment List ---
export const ShipmentList = () => {
  const tabs = ["Toutes", "En cours", "En attente", "Livrées"];
  return (
    <ScreenFrame title="B1 – Liste des Expéditions">
      <div className="px-6 pt-12 pb-2 bg-white border-b border-[#E9E9E9]">
        <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-4">
          Mes expéditions
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((t, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? "bg-[#1A1A1A] text-white" : "bg-[#F6F6F6] text-[#666666]"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[1, 2, 3, 4].map((_, i) => (
          <TCard key={i} className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-[#666666]">
                REF-8392{i}
              </span>
              <TBadge
                text={
                  i === 0
                    ? "En transit"
                    : i === 1
                      ? "Livré"
                      : "En attente"
                }
                status={
                  i === 0
                    ? "warning"
                    : i === 1
                      ? "success"
                      : "neutral"
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="text-[15px] font-bold text-[#1A1A1A]">
                  Tunis → Sfax
                </div>
                <div className="text-xs text-[#666666]">
                  Palette • 24 Nov
                </div>
              </div>
              <TButton
                variant="ghost"
                size="sm"
                className="text-[#1464F6] hover:bg-[#1464F6]/5 h-8"
              >
                Détails
              </TButton>
            </div>
          </TCard>
        ))}
      </div>
      <BottomNav active="shipments" role="sender" />
    </ScreenFrame>
  );
};

// --- B2: Create Step 1 ---
export const CreateShipment1 = () => {
  const [weightRange, setWeightRange] = React.useState("");

  return (
    <ScreenFrame title="B2 – Création Étape 1">
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E9E9E9]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">
            Nouvelle expédition
          </h1>
          <span className="text-sm text-[#666666]">1/3</span>
        </div>
        <div className="w-full h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
          <div className="h-full bg-[#1464F6] w-1/3" />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
            Ajouter des photos
          </label>
          <div className="flex gap-3">
            <button className="w-20 h-20 rounded-[16px] border border-dashed border-[#1464F6] bg-[#1464F6]/5 flex flex-col items-center justify-center gap-1 shrink-0 transition-colors hover:bg-[#1464F6]/10 px-[28px] py-[0px]">
              <span className="text-2xl text-[#1464F6] leading-none">
                +
              </span>
            </button>
            <div className="w-20 h-20 rounded-[16px] bg-[#E9E9E9] flex items-center justify-center relative border border-[#E9E9E9] overflow-hidden">
              <Package size={24} className="text-[#999]" />
              <button className="absolute top-1 right-1 w-5 h-5 bg-[#D92D20] rounded-full flex items-center justify-center border border-white text-white z-10">
                <X size={10} />
              </button>
            </div>
          </div>
        </div>

        <TInput
          type="date"
          label="Date de collecte"
          icon={<Calendar size={18} />}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
            Poids estimé (kg)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] z-10">
              <Scale size={18} />
            </div>
            <select
              value={weightRange}
              onChange={(e) => setWeightRange(e.target.value)}
              className="h-[48px] w-full bg-white rounded-[16px] border border-[#E9E9E9] pl-12 pr-10 outline-none focus:border-[#1464F6] text-[#1A1A1A] appearance-none cursor-pointer"
            >
              <option value="">Sélectionner le poids</option>
              <option value="<5">Moins de 5 kg</option>
              <option value="5-30">Entre 5 kg et 30 kg</option>
              <option value="30-50">Entre 30 kg et 50 kg</option>
              <option value="50-100">Entre 50 kg et 100 kg</option>
              <option value=">100">Plus de 100 kg</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9] flex gap-4">
        <TButton variant="ghost" className="flex-1">
          Annuler
        </TButton>
        <TButton className="flex-[2]">Suivant</TButton>
      </div>
    </ScreenFrame>
  );
};

// --- B3: Create Step 2 ---
export const CreateShipment2 = () => {
  const [showDimensions, setShowDimensions] =
    React.useState(false);
  const [format, setFormat] = React.useState("M");
  const formats = ["S", "M", "L", "XL"];

  return (
    <ScreenFrame title="B3 – Création Étape 2">
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E9E9E9]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">
            Détails supplémentaires
          </h1>
          <span className="text-sm text-[#666666]">2/3</span>
        </div>
        <div className="w-full h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
          <div className="h-full bg-[#1464F6] w-2/3" />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
            Format du colis
          </label>
          <div className="relative">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full h-[52px] px-4 pr-10 rounded-[12px] border-2 border-[#1464F6] bg-white text-[15px] text-[#1A1A1A] appearance-none outline-none cursor-pointer"
            >
              <option value="S">Taille S - Tient dans une boîte à chaussures (téléphone, clés, peluche...)</option>
              <option value="M">Taille M - Petit sac ou boîte (vêtements, livres, petits appareils électroniques...)</option>
              <option value="L">Taille L - Boîte moyenne (ordinateur portable, plusieurs articles, petits appareils...)</option>
              <option value="XL">Taille XL - Grande boîte ou meuble (TV, chaise, plusieurs boîtes...)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1464F6]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div
            className="flex items-center gap-3 px-1 pt-1 cursor-pointer"
            onClick={() => setShowDimensions(!showDimensions)}
          >
            <button
              className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-colors ${
                showDimensions
                  ? "border-[#1464F6] bg-[#1464F6]"
                  : "border-[#E9E9E9] bg-white"
              }`}
            >
              {showDimensions && (
                <div className="text-white text-[10px]">✓</div>
              )}
            </button>
            <span className="text-[14px] font-medium text-[#1A1A1A]">
              Connaissez-vous les dimensions exactes ?
            </span>
          </div>

          {showDimensions && (
            <div className="grid grid-cols-3 gap-3 pl-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#666666]">
                  Hauteur
                </label>
                <input
                  className="h-[48px] w-full bg-white rounded-[12px] border border-[#E9E9E9] px-3 outline-none focus:border-[#1464F6] text-[#1A1A1A] text-sm"
                  placeholder="cm"
                  type="number"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#666666]">
                  Largeur
                </label>
                <input
                  className="h-[48px] w-full bg-white rounded-[12px] border border-[#E9E9E9] px-3 outline-none focus:border-[#1464F6] text-[#1A1A1A] text-sm"
                  placeholder="cm"
                  type="number"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#666666]">
                  Longueur
                </label>
                <input
                  className="h-[48px] w-full bg-white rounded-[12px] border border-[#E9E9E9] px-3 outline-none focus:border-[#1464F6] text-[#1A1A1A] text-sm"
                  placeholder="cm"
                  type="number"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
            Instructions spéciales
          </label>
          <textarea
            className="h-[120px] w-full bg-white rounded-[16px] border border-[#E9E9E9] p-4 outline-none resize-none text-[#1A1A1A] placeholder:text-[#666666]/50"
            placeholder="Code porte, contact sur place, etc."
          />
        </div>

        <TInput
          label="Valeur déclarée (TND)"
          placeholder="Ex: 2500"
          icon={<DollarSign size={18} />}
        />

        <TCard className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1464F6]/10 flex items-center justify-center text-[#1464F6]">
              <Shield size={20} />
            </div>
            <div>
              <div className="font-medium text-[#1A1A1A]">
                Assurance
              </div>
              <div className="text-xs text-[#666666]">
                Recommandé pour valeur {">"} 500 TND
              </div>
            </div>
          </div>
          <div className="w-12 h-6 bg-[#1464F6] rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </TCard>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9] flex gap-4">
        <TButton variant="secondary" className="flex-1">
          Précédent
        </TButton>
        <TButton className="flex-[2]">Suivant</TButton>
      </div>
    </ScreenFrame>
  );
};

// --- B4: Create Step 3 ---
export const CreateShipment3 = () => {
  return (
    <ScreenFrame title="B4 – Création Étape 3">
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E9E9E9]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">
            Résumé
          </h1>
          <span className="text-sm text-[#666666]">3/3</span>
        </div>
        <div className="w-full h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
          <div className="h-full bg-[#1464F6] w-full" />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <TCard className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <MapPin size={18} className="text-[#1464F6]" />
            </div>
            <div>
              <div className="text-xs text-[#666666] uppercase font-medium">
                Collecte
              </div>
              <div className="text-sm font-medium text-[#1A1A1A]">
                12 Rue de la République, Tunis
              </div>
              <div className="text-xs text-[#666666]">
                25 Nov, 14:00
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E9E9E9]" />
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <MapPin size={18} className="text-[#1464F6]" />
            </div>
            <div>
              <div className="text-xs text-[#666666] uppercase font-medium">
                Livraison
              </div>
              <div className="text-sm font-medium text-[#1A1A1A]">
                Zone Industrielle, Sfax
              </div>
            </div>
          </div>
        </TCard>

        <TCard className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[#666666]">Type</div>
            <div className="font-medium text-sm">Palette</div>
          </div>
          <div>
            <div className="text-xs text-[#666666]">Poids</div>
            <div className="font-medium text-sm">150 kg</div>
          </div>
          <div>
            <div className="text-xs text-[#666666]">Valeur</div>
            <div className="font-medium text-sm">2 500 TND</div>
          </div>
          <div>
            <div className="text-xs text-[#666666]">
              Assurance
            </div>
            <div className="font-medium text-sm text-[#2E8B57]">
              Oui
            </div>
          </div>
        </TCard>

        <div className="bg-[#1464F6]/5 border border-[#1464F6]/20 rounded-[16px] p-4 text-center">
          <div className="text-sm text-[#666666]">
            Prix estimé
          </div>
          <div className="text-[32px] font-bold text-[#1464F6]">
            230,00 TND
          </div>
        </div>

        <div className="flex items-start gap-3 px-1">
          <div className="w-5 h-5 border-2 border-[#1464F6] rounded-[6px] flex items-center justify-center mt-0.5 bg-[#1464F6]">
            <div className="text-white text-[10px]">✓</div>
          </div>
          <p className="text-xs text-[#666666] leading-snug">
            J'accepte les{" "}
            <span className="text-[#1A1A1A] underline">
              Conditions Générales d'Utilisation
            </span>{" "}
            et la politique de confidentialité.
          </p>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9] flex flex-col gap-3">
        <TButton fullWidth>Confirmer l'expédition</TButton>
        <TButton
          variant="ghost"
          fullWidth
          className="text-[#666666]"
        >
          Modifier les détails
        </TButton>
      </div>
    </ScreenFrame>
  );
};

// --- B5: Shipment Details ---
export const ShipmentDetails = () => {
  return (
    <ScreenFrame title="B5 – Détails d'une Expédition">
      <div className="px-6 pt-12 pb-4 bg-white flex items-center gap-4 border-b border-[#E9E9E9]">
        <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-[18px] font-bold text-[#1A1A1A]">
          Détails EXP-2938
        </h1>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Status Card */}
        <TCard className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#666666]">
              Statut actuel
            </span>
            <TBadge text="En transit" status="warning" />
          </div>
          <StatusTimeline
            steps={[
              "Créée",
              "Assignée",
              "En transit",
              "Livrée",
            ]}
            currentStep={2}
          />
        </TCard>

        {/* Info Sections */}
        <div>
          <h3 className="text-[16px] font-bold text-[#444444] mb-3">
            Informations
          </h3>
          <TCard className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <MapPin size={16} className="text-[#666666]" />
              </div>
              <div className="text-sm">
                <div className="text-[#666666] text-xs">
                  Départ
                </div>
                <div className="font-medium">
                  Tunis, Centre Ville
                </div>
              </div>
            </div>
            <div className="w-full border-b border-dashed border-[#E9E9E9]" />
            <div className="flex gap-3">
              <div className="mt-1">
                <MapPin size={16} className="text-[#666666]" />
              </div>
              <div className="text-sm">
                <div className="text-[#666666] text-xs">
                  Arrivée
                </div>
                <div className="font-medium">
                  Sousse, Port El Kantaoui
                </div>
              </div>
            </div>
          </TCard>
        </div>

        {/* Carrier Info */}
        <div>
          <h3 className="text-[16px] font-bold text-[#444444] mb-3">
            Transporteur
          </h3>
          <TCard className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E9E9E9] flex items-center justify-center text-[#666666]">
              <User size={24} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[#1A1A1A]">
                Sami Transport
              </div>
              <div className="text-xs text-[#666666]">
                ⭐ 4.8 (124 courses)
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#1464F6]/10 flex items-center justify-center text-[#1464F6]">
              <Phone size={20} />
            </button>
          </TCard>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-[#E9E9E9] flex flex-col gap-3">
        <TButton variant="secondary" fullWidth>
          Suivre la livraison
        </TButton>
        <TButton
          variant="outline"
          fullWidth
          className="border-[#D92D20] text-[#D92D20] hover:bg-[#D92D20]/5"
        >
          Annuler l'expédition
        </TButton>
      </div>
    </ScreenFrame>
  );
};

// --- B6: Address Pickup ---
export const AddressPickup = () => {
  const [isSender, setIsSender] = React.useState(false);

  return (
    <ScreenFrame title="B6 – Adresse de Collecte">
      <div className="bg-white p-4 pb-2 border-b border-[#E9E9E9] sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[18px] font-bold text-[#1A1A1A]">
            Définir le trajet
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
          </div>
          <div className="flex-1 flex flex-col gap-3 pb-2">
            <div className="relative">
              <input
                autoFocus
                className="w-full h-11 bg-[#F6F6F6] rounded-xl px-4 text-[15px] text-[#1A1A1A] outline-none ring-2 ring-[#1464F6]/20 border border-[#1464F6]"
                placeholder="Adresse de collecte"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <button className="w-full flex items-center gap-4 p-4 border-b border-[#E9E9E9] hover:bg-[#F6F6F6] transition-colors text-left">
          <div className="w-10 h-10 rounded-full bg-[#1464F6]/10 flex items-center justify-center text-[#1464F6]">
            <MapPin size={20} />
          </div>
          <div>
            <div className="font-medium text-[#1A1A1A]">
              Ma position actuelle
            </div>
            <div className="text-xs text-[#666666]">
              Utiliser le GPS
            </div>
          </div>
        </button>

        <div className="p-4 border-b border-[#E9E9E9]">
          <div className="text-sm font-bold text-[#1A1A1A] mb-3">
            Où on se rencontre?
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#1464F6] bg-[#1464F6]/5 hover:bg-[#1464F6]/10 transition-colors text-left">
              <div className="w-5 h-5 rounded-full border-2 border-[#1464F6] bg-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Près du véhicule
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#E9E9E9] bg-white hover:bg-[#F6F6F6] transition-colors text-left">
              <div className="w-5 h-5 rounded-full border-2 border-[#E9E9E9] bg-white" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Chez vous
                </span>
                <span className="text-xs text-[#666666]">
                  Frais 15DT
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#E9E9E9]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#1A1A1A]">
              Vous n'etes pas l'expéditeur?
            </span>
            <button
              onClick={() => setIsSender(!isSender)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isSender ? "bg-[#1464F6]" : "bg-[#E9E9E9]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  isSender ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {isSender && (
            <div className="space-y-3 mt-4">
              <TInput
                label="Nom et prénom"
                placeholder="Ex: Ahmed Ben Salah"
                icon={<User size={18} />}
              />
              <TInput
                label="Numéro de téléphone"
                placeholder="Ex: +216 20 123 456"
                icon={<Phone size={18} />}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
                  Instructions supplémentaires
                </label>
                <textarea
                  className="h-[100px] w-full bg-white rounded-[16px] border border-[#E9E9E9] p-4 outline-none resize-none text-[#1A1A1A] placeholder:text-[#666666]/50"
                  placeholder="Code porte, étage, etc."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenFrame>
  );
};

// --- B7: Address Delivery ---
export const AddressDelivery = () => {
  const [isSender, setIsSender] = React.useState(false);

  return (
    <ScreenFrame title="B7 – Adresse de Livraison">
      <div className="bg-white p-4 pb-2 border-b border-[#E9E9E9] sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button className="w-8 h-8 rounded-full bg-[#F6F6F6] flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-[18px] font-bold text-[#1A1A1A]">
            Définir le trajet
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
          </div>
          <div className="flex-1 flex flex-col gap-3 pb-2">
            <div className="relative">
              <input
                autoFocus
                className="w-full h-11 bg-white rounded-xl px-4 text-[15px] text-[#1A1A1A] outline-none ring-2 ring-[#1464F6]/20 border border-[#1464F6]"
                placeholder="Adresse de livraison"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <button className="w-full flex items-center gap-4 p-4 border-b border-[#E9E9E9] hover:bg-[#F6F6F6] transition-colors text-left">
          <div className="w-10 h-10 rounded-full bg-[#1464F6]/10 flex items-center justify-center text-[#1464F6]">
            <MapPin size={20} />
          </div>
          <div>
            <div className="font-medium text-[#1A1A1A]">
              Ma position actuelle
            </div>
            <div className="text-xs text-[#666666]">
              Utiliser le GPS
            </div>
          </div>
        </button>

        <div className="p-4 border-b border-[#E9E9E9]">
          <div className="text-sm font-bold text-[#1A1A1A] mb-3">
            Où on se rencontre?
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#1464F6] bg-[#1464F6]/5 hover:bg-[#1464F6]/10 transition-colors text-left">
              <div className="w-5 h-5 rounded-full border-2 border-[#1464F6] bg-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1464F6]" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Près du véhicule
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-[#E9E9E9] bg-white hover:bg-[#F6F6F6] transition-colors text-left">
              <div className="w-5 h-5 rounded-full border-2 border-[#E9E9E9] bg-white" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#1A1A1A]">
                  Chez vous
                </span>
                <span className="text-xs text-[#666666]">
                  Frais 15DT
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#E9E9E9]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#1A1A1A]">
              Vous n'etes pas le recepteur?
            </span>
            <button
              onClick={() => setIsSender(!isSender)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isSender ? "bg-[#1464F6]" : "bg-[#E9E9E9]"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  isSender ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {isSender && (
            <div className="space-y-3 mt-4">
              <TInput
                label="Nom et prénom"
                placeholder="Ex: Ahmed Ben Salah"
                icon={<User size={18} />}
              />
              <TInput
                label="Numéro de téléphone"
                placeholder="Ex: +216 20 123 456"
                icon={<Phone size={18} />}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-medium text-[#1A1A1A] ml-1">
                  Instructions supplémentaires
                </label>
                <textarea
                  className="h-[100px] w-full bg-white rounded-[16px] border border-[#E9E9E9] p-4 outline-none resize-none text-[#1A1A1A] placeholder:text-[#666666]/50"
                  placeholder="Code porte, étage, etc."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ScreenFrame>
  );
};