/**
 * Transporti Icon System — Phosphor Icons (Duotone weight)
 *
 * Centralised icon wrapper using phosphor-react-native with the Duotone weight.
 * Every semantic name used across the app maps to a Phosphor icon component.
 * Swap the mapping here without touching call sites.
 *
 * Usage:
 *   <AppIcon name="package" size={24} color={Colors.primary} />
 */

import React from 'react';
import {
  House,
  Package,
  Truck,
  PathIcon,
  ClockCounterClockwise,
  UserCircle,
  User,
  Plus,
  PlusCircle,
  MagnifyingGlass,
  Funnel,
  MapPin,
  MapTrifold,
  Calendar,
  CalendarBlank,
  Camera,
  FileText,
  QrCode,
  PencilSimple,
  Trash,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  DownloadSimple,
  UploadSimple,
  Eye,
  EyeSlash,
  CaretRight,
  CaretDown,
  X,
  GearSix,
  CheckCircle,
  Checks,
  Clock,
  XCircle,
  Warning,
  Info,
  Star,
  Bell,
  BellRinging,
  ChatCircle,
  Phone,
  Wallet,
  Receipt,
  ShieldCheck,
  SealCheck,
  Barbell,
  Wine,
  HandHeart,
  Thermometer,
  Snowflake,
  ArrowsOutCardinal,
  SignOut,
  LockSimple,
  Envelope,
  Scales,
  Handshake,
  HourglassMedium,
  HandFist,
  ProhibitInset,
  ImageSquare,
} from 'phosphor-react-native';
import { Colors, IconSizes } from '../../theme';

// ─── Icon name catalogue ──────────────────────────────────────────────────────

export type AppIconName =
  // Navigation
  | 'home'
  | 'package'
  | 'package-box'
  | 'package-open'
  | 'truck'
  | 'route'
  | 'history'
  | 'profile'
  | 'profile-user'
  | 'person-inline'
  // Actions
  | 'plus'
  | 'add-circle'
  | 'add-photo'
  | 'search'
  | 'filter'
  | 'map-pin'
  | 'location-pin'
  | 'map-picker'
  | 'map-current-location'
  | 'calendar'
  | 'date-field'
  | 'camera'
  | 'camera-legacy'
  | 'gallery-image'
  | 'document'
  | 'qr-code'
  | 'edit'
  | 'trash'
  | 'delete'
  | 'refresh'
  | 'arrow-back'
  | 'arrow-right'
  | 'arrow-left'
  | 'download'
  | 'upload'
  | 'eye'
  | 'eye-open'
  | 'eye-closed'
  | 'chevron-right'
  | 'chevron-down'
  | 'caret-down'
  | 'close'
  | 'modal-close'
  | 'settings'
  // Status & feedback
  | 'check-circle'
  | 'double-check'
  | 'selection-check'
  | 'clock'
  | 'x-circle'
  | 'alert-triangle'
  | 'info'
  | 'info-circle'
  | 'star'
  | 'star-filled'
  | 'star-rating'
  | 'star-legacy'
  | 'pending-wait'
  // Communication
  | 'bell'
  | 'bell-active'
  | 'notification-bell'
  | 'message'
  | 'chat'
  | 'support-chat'
  | 'phone'
  | 'phone-inline'
  | 'support-phone'
  | 'email'
  // Payment & trust
  | 'wallet'
  | 'money-legacy'
  | 'receipt'
  | 'shield'
  | 'verify'
  | 'verified-shield'
  | 'verified-check-badge'
  | 'insurance-shield'
  | 'logout'
  | 'lock'
  | 'security-lock-legacy'
  // Shipment attributes
  | 'weight'
  | 'heavy-weight'
  | 'weight-scale'
  | 'fragile'
  | 'handle-with-care'
  | 'handover'
  | 'temperature'
  | 'temperature-sensitive'
  | 'temperature-cold'
  | 'dimensions'
  | 'assistance-help'
  | 'blocked-ban'
  // Brand-specific / map
  | 'road'
  | 'tunisia'
  | 'map-tunisia'
  | 'package-legacy'
  | 'vehicle-capacity';

// ─── Phosphor component type ──────────────────────────────────────────────────

type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface PhosphorIconComponentProps {
  size?: number;
  color?: string;
  weight?: PhosphorWeight;
}

type PhosphorComponent = React.ComponentType<PhosphorIconComponentProps>;

// ─── Semantic → Phosphor component map ───────────────────────────────────────

const iconMap: Record<AppIconName, PhosphorComponent> = {
  // Navigation
  home: House,
  package: Package,
  'package-box': Package,
  'package-open': Package,        // PackageOpen not in library; Package is the closest
  truck: Truck,
  route: PathIcon,
  history: ClockCounterClockwise,
  profile: UserCircle,
  'profile-user': User,
  'person-inline': User,
  // Actions
  plus: Plus,
  'add-circle': PlusCircle,
  'add-photo': PlusCircle,
  search: MagnifyingGlass,
  filter: Funnel,
  'map-pin': MapPin,
  'location-pin': MapPin,
  'map-picker': MapTrifold,
  'map-current-location': MapPin,
  calendar: Calendar,
  'date-field': CalendarBlank,
  camera: Camera,
  'camera-legacy': Camera,
  'gallery-image': ImageSquare,
  document: FileText,
  'qr-code': QrCode,
  edit: PencilSimple,
  trash: Trash,
  delete: Trash,
  refresh: ArrowCounterClockwise,
  'arrow-back': ArrowLeft,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  download: DownloadSimple,
  upload: UploadSimple,
  eye: Eye,
  'eye-open': Eye,
  'eye-closed': EyeSlash,
  'chevron-right': CaretRight,
  'chevron-down': CaretDown,
  'caret-down': CaretDown,
  close: X,
  'modal-close': X,
  settings: GearSix,
  // Status & feedback
  'check-circle': CheckCircle,
  'double-check': Checks,
  'selection-check': Checks,
  clock: Clock,
  'x-circle': XCircle,
  'alert-triangle': Warning,
  info: Info,
  'info-circle': Info,
  star: Star,
  'star-filled': Star,
  'star-rating': Star,
  'star-legacy': Star,
  'pending-wait': HourglassMedium,
  // Communication
  bell: Bell,
  'bell-active': BellRinging,
  'notification-bell': Bell,
  message: ChatCircle,
  chat: ChatCircle,
  'support-chat': ChatCircle,
  phone: Phone,
  'phone-inline': Phone,
  'support-phone': Phone,
  email: Envelope,
  // Payment & trust
  wallet: Wallet,
  'money-legacy': Wallet,
  receipt: Receipt,
  shield: ShieldCheck,
  verify: SealCheck,
  'verified-shield': ShieldCheck,
  'verified-check-badge': SealCheck,
  'insurance-shield': ShieldCheck,
  logout: SignOut,
  lock: LockSimple,
  'security-lock-legacy': LockSimple,
  // Shipment attributes
  weight: Barbell,
  'heavy-weight': Barbell,
  'weight-scale': Scales,
  fragile: Wine,
  'handle-with-care': HandHeart,
  handover: Handshake,
  temperature: Thermometer,
  'temperature-sensitive': Thermometer,
  'temperature-cold': Snowflake,
  dimensions: ArrowsOutCardinal,
  'assistance-help': HandFist,
  'blocked-ban': ProhibitInset,
  // Brand-specific / map
  road: PathIcon,
  tunisia: MapTrifold,
  'map-tunisia': MapTrifold,
  'package-legacy': Package,
  'vehicle-capacity': Truck,
};

// ─── Component ────────────────────────────────────────────────────────────────

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  /** Override the Phosphor weight. Defaults to 'duotone' for Transporti brand style. */
  weight?: PhosphorWeight;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = IconSizes.md,
  color = Colors.charcoal,
  weight = 'duotone',
}) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} weight={weight} />;
};

export default AppIcon;
