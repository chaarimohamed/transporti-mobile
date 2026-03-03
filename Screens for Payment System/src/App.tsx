import React, { useState } from 'react';
import { ScreenP1, ScreenP2, ScreenP3, ScreenP4 } from './components/transporti/ConfirmationFlow';
import { ScreenP5, ScreenP6 } from './components/transporti/IssueFlow';
import { ScreenP7, ScreenP8 } from './components/transporti/HistoryFlow';
import { FontInjection } from './components/transporti/Shared';

const Showcase = () => {
  // State for P1 interactivity demo
  const [p1Key, setP1Key] = useState(0);

  // Function to handle P1 -> P2 transition demo
  const handleP1Next = (code: string) => {
    alert(`Code confirmed: ${code}. In a real app, this would navigate to the Success screen.`);
    setP1Key(prev => prev + 1); // Reset
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] p-8 font-sans">
      <FontInjection />
      <div className="max-w-[1700px] mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Transporti.tn - Système de Paiement</h1>
          <p className="text-[#666666]">8 Écrans Mobile (390x844px) • Design System Transporti</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
          
          {/* Group 1 */}
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P1: Saisie Code</span>
            <ScreenP1 key={p1Key} onNext={handleP1Next} onProblem={() => alert('Navigate to P5')} />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P2: Succès</span>
            <ScreenP2 onViewReceipt={() => alert('Navigate to P7')} />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P3: Erreur (Retry)</span>
            <ScreenP3 onRetry={() => alert('Retry logic')} />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P4: Bloqué</span>
            <ScreenP4 />
          </div>

          {/* Group 2 */}
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P5: Signalement</span>
            <ScreenP5 onSubmit={() => alert('Navigate to P6')} />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P6: Confirmation Signalement</span>
            <ScreenP6 />
          </div>

          {/* Group 3 */}
          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P7: Reçu Détaillé</span>
            <ScreenP7 />
          </div>

          <div className="flex flex-col gap-4 items-center">
            <span className="font-semibold text-[#444444]">P8: Historique</span>
            <ScreenP8 onSelectReceipt={() => alert('Navigate to P7')} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Showcase;
