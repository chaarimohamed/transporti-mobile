import React from "react";
import { DashboardSender, DashboardCarrier } from "./components/transporti/GroupA";
import { ShipmentList, CreateShipment1, CreateShipment2, CreateShipment3, ShipmentDetails, AddressPickup, AddressDelivery } from "./components/transporti/GroupB";
import { MissionList, MissionDetails, ActiveMissions, UpdateStatus } from "./components/transporti/GroupC";
import { Tracking, Notifications, Profile, NotificationSettings } from "./components/transporti/GroupD";

const GroupSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-2 w-fit">{title}</h2>
    <div className="flex gap-12 items-start overflow-x-auto pb-8 px-4">
      {children}
    </div>
  </div>
);

const App = () => {
  return (
    <div className="min-h-screen bg-[#E5E5E5] p-12 font-sans overflow-x-auto">
      <div className="flex flex-col gap-20 w-max">
        
        {/* Intro / Title */}
        <div>
           <h1 className="text-4xl font-extrabold text-[#1A1A1A]">Transporti.tn – Mobile Screens</h1>
           <p className="text-[#666666] mt-2">Wireframes haute-fidélité basés sur le Design System authentification.</p>
        </div>

        <GroupSection title="GROUPE A – Dashboard & Navigation">
           <DashboardSender />
           <DashboardCarrier />
        </GroupSection>

        <GroupSection title="GROUPE B – Flux Expéditeur : Création & Gestion">
           <ShipmentList />
           <CreateShipment1 />
           <AddressPickup />
           <AddressDelivery />
           <CreateShipment2 />
           <CreateShipment3 />
           <ShipmentDetails />
        </GroupSection>

        <GroupSection title="GROUPE C – Flux Transporteur : Missions & Suivi">
           <MissionList />
           <MissionDetails />
           <ActiveMissions />
           <UpdateStatus />
        </GroupSection>

        <GroupSection title="GROUPE D – Suivi, Notifications & Profil">
           <Tracking />
           <Notifications />
           <Profile />
           <NotificationSettings />
        </GroupSection>

      </div>
    </div>
  );
};

export default App;
