/**
 * Transporti Icon System
 *
 * Wrapper around @expo/vector-icons (Ionicons) that maps semantic app icon names
 * to the underlying glyph. Replace the `ioniconsName` mapping entries with custom
 * SVG icons when the branded icon set is ready (see GraphicalCharter/icon-generation-prompt.md).
 *
 * Usage:
 *   <AppIcon name="package" size={24} color={Colors.primary} />
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, IconSizes } from '../../theme';

// ─── Icon name catalogue ──────────────────────────────────────────────────────
// Every semantic name used across the app maps to an Ionicons glyph.
// When custom SVGs land, swap the mapping here without touching call sites.

export type AppIconName =
  // Navigation
  | 'home'
  | 'package'
  | 'truck'
  | 'route'
  | 'history'
  | 'profile'
  // Actions
  | 'plus'
  | 'search'
  | 'filter'
  | 'map-pin'
  | 'calendar'
  | 'camera'
  | 'document'
  | 'qr-code'
  | 'edit'
  | 'trash'
  | 'refresh'
  | 'arrow-back'
  | 'arrow-right'
  | 'chevron-right'
  | 'chevron-down'
  | 'close'
  | 'settings'
  // Status & feedback
  | 'check-circle'
  | 'clock'
  | 'x-circle'
  | 'alert-triangle'
  | 'info'
  | 'star'
  | 'star-filled'
  // Communication
  | 'bell'
  | 'bell-active'
  | 'message'
  | 'phone'
  // Payment & trust
  | 'wallet'
  | 'receipt'
  | 'shield'
  | 'verify'
  // Shipment attributes
  | 'weight'
  | 'fragile'
  | 'temperature'
  | 'dimensions'
  // Brand-specific
  | 'road'
  | 'tunisia'
  | 'logout'
  // Extra
  | 'arrow-left'
  | 'lock'
  | 'email';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const iconMap: Record<AppIconName, IoniconsName> = {
  // Navigation
  home: 'home-outline',
  package: 'cube-outline',
  truck: 'car-outline',
  route: 'navigate-outline',
  history: 'time-outline',
  profile: 'person-outline',
  // Actions
  plus: 'add',
  search: 'search-outline',
  filter: 'options-outline',
  'map-pin': 'location-outline',
  calendar: 'calendar-outline',
  camera: 'camera-outline',
  document: 'document-text-outline',
  'qr-code': 'qr-code-outline',
  edit: 'pencil-outline',
  trash: 'trash-outline',
  refresh: 'refresh-outline',
  'arrow-back': 'arrow-back-outline',
  'arrow-right': 'arrow-forward-outline',
  'chevron-right': 'chevron-forward-outline',
  'chevron-down': 'chevron-down-outline',
  close: 'close-outline',
  settings: 'settings-outline',
  // Status & feedback
  'check-circle': 'checkmark-circle-outline',
  clock: 'time-outline',
  'x-circle': 'close-circle-outline',
  'alert-triangle': 'warning-outline',
  info: 'information-circle-outline',
  star: 'star-outline',
  'star-filled': 'star',
  // Communication
  bell: 'notifications-outline',
  'bell-active': 'notifications',
  message: 'chatbubble-outline',
  phone: 'call-outline',
  // Payment & trust
  wallet: 'wallet-outline',
  receipt: 'receipt-outline',
  shield: 'shield-checkmark-outline',
  verify: 'checkmark-done-outline',
  // Shipment attributes
  weight: 'barbell-outline',
  fragile: 'wine-outline',
  temperature: 'thermometer-outline',
  dimensions: 'resize-outline',
  // Brand-specific
  road: 'map-outline',
  tunisia: 'flag-outline',
  logout: 'log-out-outline',
  'arrow-left': 'arrow-back-outline',
  lock: 'lock-closed-outline',
  email: 'mail-outline',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = IconSizes.md,
  color = Colors.charcoal,
}) => {
  const ioniconsName = iconMap[name] ?? 'help-circle-outline';
  return <Ionicons name={ioniconsName} size={size} color={color} />;
};

export default AppIcon;
