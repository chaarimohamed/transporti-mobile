# GROUPE C - Carrier Screens Implementation

## Overview
Complete implementation of carrier mission management flow (4 screens) integrated with backend mission APIs.

## Screens Created

### C1: Mission List Screen
**File:** `mobile-app/components/screens/carrier/MissionListScreen.tsx`

**Features:**
- Browse available missions (status: AVAILABLE)
- Filter pills: Toutes, Proches, Date, Prix
- Mission cards with:
  - Route (from → to)
  - Distance & duration estimates
  - Price display
  - Cargo type badge
  - Urgent badge (for missions within 24h)
  - "Détails" and "Accepter" buttons
- Empty state with icon and message
- Error handling with retry
- Loading spinner
- Bottom navigation with "missions" active

**API Integration:**
- `getAvailableMissions()` - Fetches missions with status AVAILABLE

---

### C2: Mission Details Screen
**File:** `mobile-app/components/screens/carrier/MissionDetailsScreen.tsx`

**Features:**
- Mission reference number badge
- Sender information card with avatar
- Route details with:
  - Start/end locations
  - Estimated times
  - Visual timeline (green/blue dots)
  - Distance & duration stats
- Cargo type display with pickup date
- Price section with large display
- Counter-offer input (optional)
  - Text input with TND currency
  - Submit with or without counter-offer
- Action buttons:
  - "Refuser" (gray) - Returns to mission list
  - "Accepter la mission" or "Envoyer contre-offre" (blue)
- Success alerts on acceptance
- Navigates to active missions after success

**API Integration:**
- `getMissionById(id)` - Fetches mission details
- `acceptMission(id, counterOffer?)` - Accepts mission with optional price negotiation

---

### C3: Active Missions Screen
**File:** `mobile-app/components/screens/carrier/ActiveMissionsScreen.tsx`

**Features:**
- Header with stats cards:
  - Assignées count (blue)
  - En cours count (orange)
  - Complétées count
- Mission cards with colored left borders:
  - Blue border for ASSIGNED status
  - Orange border for IN_PROGRESS status
- Each card shows:
  - Reference number badge
  - Status badge (Assignée/En cours)
  - Route & cargo info
  - Date with calendar icon
  - Price display
  - "Voir le détail" button
  - "Commencer" (ASSIGNED) or "Mettre à jour" (IN_PROGRESS) button
  - "Annuler la mission" link (red text)
- Empty state with "Parcourir les missions" button
- Cancel confirmation dialog
- Bottom navigation with "active" active

**API Integration:**
- `getMyMissions()` - Fetches carrier's missions (filtered to ASSIGNED + IN_PROGRESS)
- `getMissionStats()` - Gets count statistics
- `cancelMission(id)` - Cancels a mission

---

### C4: Update Status Screen
**File:** `mobile-app/components/screens/carrier/UpdateStatusScreen.tsx`

**Features:**
- Mission info card at top (route, price, cargo)
- Vertical timeline with 4 steps:
  1. **Enlèvement** (Pickup) - Green dot
  2. **Chargement** (Loading) - Visual indicator
  3. **En transit** (In Transit) - Visual indicator  
  4. **Livré** (Delivered) - Blue dot
- Each step shows:
  - Icon/checkmark
  - Label & description
  - Completion badge if done
  - Action button if current
- Timeline visual with dots and connecting lines
- Color-coded:
  - Completed steps: green with checkmark
  - Current step: blue highlight
  - Future steps: gray
- Action buttons:
  - "Confirmer l'enlèvement" (starts mission → IN_PROGRESS)
  - "Confirmer la livraison" (completes mission → COMPLETED)
- Info messages for guidance
- Success card when mission completed
- Returns to active missions after completion

**API Integration:**
- `getMissionById(id)` - Gets current mission status
- `updateMissionStatus(id, status)` - Updates to IN_PROGRESS or COMPLETED

---

## Navigation Flow

```
Dashboard (Carrier)
    ├─ Mission List (C1)
    │   └─ Mission Details (C2)
    │       └─ Active Missions (C3) [after accept]
    │
    └─ Active Missions (C3)
        ├─ Mission Details (C2) [via "Voir le détail"]
        └─ Update Status (C4) [via "Commencer" or "Mettre à jour"]
            └─ Active Missions (C3) [after completion]
```

## App.tsx Integration

Added carrier screen routes:
- `missionList` → MissionListScreen
- `missionDetails` → MissionDetailsScreen (with route params for ID)
- `activeMissions` → ActiveMissionsScreen
- `updateStatus` → UpdateStatusScreen (with route params for ID)

## BottomNav Updates

Updated to handle carrier navigation:
- "Missions" icon → navigates to `missionList`
- "En cours" icon → navigates to `activeMissions`
- "Historique" icon → (future implementation)
- "Profil" icon → (future implementation)

## Backend APIs Used

All screens integrate with mission controller endpoints:

1. **GET** `/api/missions/available` - Browse available missions
2. **GET** `/api/missions/my-missions` - Get carrier's assigned missions
3. **GET** `/api/missions/stats` - Get mission count statistics
4. **GET** `/api/missions/:id` - Get mission details
5. **POST** `/api/missions/:id/accept` - Accept mission (with optional counterOffer)
6. **PUT** `/api/missions/:id/status` - Update mission status
7. **DELETE** `/api/missions/:id` - Cancel mission

## Mission Service Layer

**File:** `mobile-app/services/mission.service.ts`

Complete TypeScript service with:
- Mission interface (id, refNumber, from, to, cargo, price, date, status, carrier)
- MissionStats interface (assigned, inProgress, completed)
- AcceptMissionData interface (counterOffer optional)
- 7 async functions matching backend APIs
- Consistent error handling
- JWT authentication headers

## Status Flow

```
AVAILABLE (browsing)
    ↓ [Accept]
ASSIGNED (assigned to carrier)
    ↓ [Confirm pickup]
IN_PROGRESS (carrier confirms start)
    ↓ [Confirm delivery]
COMPLETED (mission finished)
```

## Key Features

✅ Complete mission browsing & acceptance flow
✅ Real-time status tracking with timeline
✅ Counter-offer negotiation capability
✅ Mission cancellation with confirmation
✅ Statistics dashboard
✅ Error handling & loading states
✅ Empty states with helpful messages
✅ Responsive navigation between screens
✅ Color-coded status indicators
✅ Bottom navigation integration
✅ TypeScript type safety

## Testing Checklist

- [ ] Login as carrier
- [ ] View mission list with available missions
- [ ] Filter missions by different criteria
- [ ] Click mission card to view details
- [ ] Accept mission without counter-offer
- [ ] Accept mission with counter-offer
- [ ] View active missions list
- [ ] See statistics update after acceptance
- [ ] Click "Commencer" to start mission
- [ ] Verify status changes to IN_PROGRESS
- [ ] Navigate to update status screen
- [ ] Confirm pickup to start mission
- [ ] Confirm delivery to complete mission
- [ ] Verify completed mission disappears from active list
- [ ] Cancel mission and verify removal
- [ ] Test empty states when no missions
- [ ] Test error states with network issues

## Next Steps

1. Implement mission history screen
2. Add real geolocation for distance calculation
3. Add photo upload for delivery confirmation
4. Implement push notifications for new missions
5. Add mission filtering by actual criteria (date, price, location)
6. Implement chat between carrier and sender
7. Add mission rating system after completion
