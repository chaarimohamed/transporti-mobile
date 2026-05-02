/**
 * Transporti Icon System
 *
 * Centralised icon wrapper that prefers shipped brand SVG assets and falls back
 * to phosphor-react-native only for shapes that do not yet exist in the local set.
 */

import React from 'react';
import { Plus } from 'phosphor-react-native';
import type { SvgProps } from 'react-native-svg';

import ArrowCounterClockwiseSvg from '../../assets/icons/brand/arrow-counter-clockwise-duotone.svg';
import ArrowLeftSvg from '../../assets/icons/brand/arrow-left-duotone.svg';
import ArrowRightSvg from '../../assets/icons/brand/arrow-right-duotone.svg';
import ArrowsOutCardinalSvg from '../../assets/icons/brand/arrows-out-cardinal-duotone.svg';
import BarbellSvg from '../../assets/icons/brand/barbell-duotone.svg';
import BellRingingSvg from '../../assets/icons/brand/bell-ringing-duotone.svg';
import BellSvg from '../../assets/icons/brand/bell-duotone.svg';
import CalendarBlankSvg from '../../assets/icons/brand/calendar-blank-duotone.svg';
import CalendarSvg from '../../assets/icons/brand/calendar-duotone.svg';
import CameraSvg from '../../assets/icons/brand/camera-duotone.svg';
import CaretDownSvg from '../../assets/icons/brand/caret-down-duotone.svg';
import CaretRightSvg from '../../assets/icons/brand/caret-right-duotone.svg';
import ChatCircleSvg from '../../assets/icons/brand/chat-circle-duotone.svg';
import CheckCircleSvg from '../../assets/icons/brand/check-circle-duotone.svg';
import ChecksSvg from '../../assets/icons/brand/checks-duotone.svg';
import ClockCounterClockwiseSvg from '../../assets/icons/brand/clock-counter-clockwise-duotone.svg';
import ClockSvg from '../../assets/icons/brand/clock-duotone.svg';
import DownloadSimpleSvg from '../../assets/icons/brand/download-simple-duotone.svg';
import EnvelopeSvg from '../../assets/icons/brand/envelope-duotone.svg';
import EyeSlashSvg from '../../assets/icons/brand/eye-slash-duotone.svg';
import EyeSvg from '../../assets/icons/brand/eye-duotone.svg';
import FileTextSvg from '../../assets/icons/brand/file-text-duotone.svg';
import FunnelSvg from '../../assets/icons/brand/funnel-duotone.svg';
import GearSixSvg from '../../assets/icons/brand/gear-six-duotone.svg';
import HandFistSvg from '../../assets/icons/brand/hand-fist-duotone.svg';
import HandHeartSvg from '../../assets/icons/brand/hand-heart-duotone.svg';
import HandshakeSvg from '../../assets/icons/brand/handshake-duotone.svg';
import HouseSvg from '../../assets/icons/brand/house-duotone.svg';
import HourglassMediumSvg from '../../assets/icons/brand/hourglass-medium-duotone.svg';
import ImageSquareSvg from '../../assets/icons/brand/image-square-duotone.svg';
import InfoSvg from '../../assets/icons/brand/info-duotone.svg';
import LockSimpleSvg from '../../assets/icons/brand/lock-simple-duotone.svg';
import MagnifyingGlassSvg from '../../assets/icons/brand/magnifying-glass-duotone.svg';
import MapPinSvg from '../../assets/icons/brand/map-pin-duotone.svg';
import MapTrifoldSvg from '../../assets/icons/brand/map-trifold-duotone.svg';
import PackageSvg from '../../assets/icons/brand/package-duotone.svg';
import PathSvg from '../../assets/icons/brand/path-duotone.svg';
import PencilSimpleSvg from '../../assets/icons/brand/pencil-simple-duotone.svg';
import PhoneSvg from '../../assets/icons/brand/phone-duotone.svg';
import PlusCircleSvg from '../../assets/icons/brand/plus-circle-duotone.svg';
import ProhibitInsetSvg from '../../assets/icons/brand/prohibit-inset-duotone.svg';
import QrCodeSvg from '../../assets/icons/brand/qr-code-duotone.svg';
import ReceiptSvg from '../../assets/icons/brand/receipt-duotone.svg';
import ScalesSvg from '../../assets/icons/brand/scales-duotone.svg';
import SealCheckSvg from '../../assets/icons/brand/seal-check-duotone.svg';
import ShieldCheckSvg from '../../assets/icons/brand/shield-check-duotone.svg';
import SignOutSvg from '../../assets/icons/brand/sign-out-duotone.svg';
import SnowflakeSvg from '../../assets/icons/brand/snowflake-duotone.svg';
import StarSvg from '../../assets/icons/brand/star-duotone.svg';
import ThermometerSvg from '../../assets/icons/brand/thermometer-duotone.svg';
import TrashSvg from '../../assets/icons/brand/trash-duotone.svg';
import TruckSvg from '../../assets/icons/brand/truck-duotone.svg';
import UploadSimpleSvg from '../../assets/icons/brand/upload-simple-duotone.svg';
import VehicleBerlingoSvg from '../../assets/icons/brand/vehicle-berlingo-duotone.svg';
import VehicleCamionSvg from '../../assets/icons/brand/vehicle-camion-duotone.svg';
import VehicleSemiRemorqueSvg from '../../assets/icons/brand/vehicle-semi-remorque-duotone.svg';
import VehicleSprinterSvg from '../../assets/icons/brand/vehicle-sprinter-duotone.svg';
import UserCircleSvg from '../../assets/icons/brand/user-circle-duotone.svg';
import UserSvg from '../../assets/icons/brand/user-duotone.svg';
import WalletSvg from '../../assets/icons/brand/wallet-duotone.svg';
import WarningSvg from '../../assets/icons/brand/warning-duotone.svg';
import WineSvg from '../../assets/icons/brand/wine-duotone.svg';
import XCircleSvg from '../../assets/icons/brand/x-circle-duotone.svg';
import XSvg from '../../assets/icons/brand/x-duotone.svg';
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
  | 'vehicle-capacity'
  // Vehicle types
  | 'vehicle-berlingo'
  | 'vehicle-sprinter'
  | 'vehicle-camion'
  | 'vehicle-semi-remorque';

// ─── Phosphor component type ──────────────────────────────────────────────────

type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface PhosphorIconComponentProps {
  size?: number;
  color?: string;
  weight?: PhosphorWeight;
}

type PhosphorComponent = React.ComponentType<PhosphorIconComponentProps>;
type SvgComponent = React.ComponentType<SvgProps>;

// ─── Semantic → Phosphor component map ───────────────────────────────────────

const customIconMap: Partial<Record<AppIconName, SvgComponent>> = {
  // Navigation
  home: HouseSvg,
  package: PackageSvg,
  'package-box': PackageSvg,
  'package-open': PackageSvg,
  truck: TruckSvg,
  route: PathSvg,
  history: ClockCounterClockwiseSvg,
  profile: UserCircleSvg,
  'profile-user': UserSvg,
  'person-inline': UserSvg,
  // Actions
  'add-circle': PlusCircleSvg,
  'add-photo': PlusCircleSvg,
  search: MagnifyingGlassSvg,
  filter: FunnelSvg,
  'map-pin': MapPinSvg,
  'location-pin': MapPinSvg,
  'map-picker': MapTrifoldSvg,
  'map-current-location': MapPinSvg,
  calendar: CalendarSvg,
  'date-field': CalendarBlankSvg,
  camera: CameraSvg,
  'camera-legacy': CameraSvg,
  'gallery-image': ImageSquareSvg,
  document: FileTextSvg,
  'qr-code': QrCodeSvg,
  edit: PencilSimpleSvg,
  trash: TrashSvg,
  delete: TrashSvg,
  refresh: ArrowCounterClockwiseSvg,
  'arrow-back': ArrowLeftSvg,
  'arrow-left': ArrowLeftSvg,
  'arrow-right': ArrowRightSvg,
  download: DownloadSimpleSvg,
  upload: UploadSimpleSvg,
  eye: EyeSvg,
  'eye-open': EyeSvg,
  'eye-closed': EyeSlashSvg,
  'chevron-right': CaretRightSvg,
  'chevron-down': CaretDownSvg,
  'caret-down': CaretDownSvg,
  close: XSvg,
  'modal-close': XSvg,
  settings: GearSixSvg,
  // Status & feedback
  'check-circle': CheckCircleSvg,
  'double-check': ChecksSvg,
  'selection-check': ChecksSvg,
  clock: ClockSvg,
  'x-circle': XCircleSvg,
  'alert-triangle': WarningSvg,
  info: InfoSvg,
  'info-circle': InfoSvg,
  star: StarSvg,
  'star-filled': StarSvg,
  'star-rating': StarSvg,
  'star-legacy': StarSvg,
  'pending-wait': HourglassMediumSvg,
  // Communication
  bell: BellSvg,
  'bell-active': BellRingingSvg,
  'notification-bell': BellSvg,
  message: ChatCircleSvg,
  chat: ChatCircleSvg,
  'support-chat': ChatCircleSvg,
  phone: PhoneSvg,
  'phone-inline': PhoneSvg,
  'support-phone': PhoneSvg,
  email: EnvelopeSvg,
  // Payment & trust
  wallet: WalletSvg,
  'money-legacy': WalletSvg,
  receipt: ReceiptSvg,
  shield: ShieldCheckSvg,
  verify: SealCheckSvg,
  'verified-shield': ShieldCheckSvg,
  'verified-check-badge': SealCheckSvg,
  'insurance-shield': ShieldCheckSvg,
  logout: SignOutSvg,
  lock: LockSimpleSvg,
  'security-lock-legacy': LockSimpleSvg,
  // Shipment attributes
  weight: BarbellSvg,
  'heavy-weight': BarbellSvg,
  'weight-scale': ScalesSvg,
  fragile: WineSvg,
  'handle-with-care': HandHeartSvg,
  handover: HandshakeSvg,
  temperature: ThermometerSvg,
  'temperature-sensitive': ThermometerSvg,
  'temperature-cold': SnowflakeSvg,
  dimensions: ArrowsOutCardinalSvg,
  'assistance-help': HandFistSvg,
  'blocked-ban': ProhibitInsetSvg,
  // Brand-specific / map
  road: PathSvg,
  tunisia: MapTrifoldSvg,
  'map-tunisia': MapTrifoldSvg,
  'package-legacy': PackageSvg,
  'vehicle-capacity': TruckSvg,
  // Vehicle types
  'vehicle-berlingo': VehicleBerlingoSvg,
  'vehicle-sprinter': VehicleSprinterSvg,
  'vehicle-camion': VehicleCamionSvg,
  'vehicle-semi-remorque': VehicleSemiRemorqueSvg,
};

const fallbackIconMap: Partial<Record<AppIconName, PhosphorComponent>> = {
  plus: Plus,
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
  const CustomIcon = customIconMap[name];

  if (CustomIcon) {
    return <CustomIcon width={size} height={size} color={color} />;
  }

  const FallbackIcon = fallbackIconMap[name];
  if (!FallbackIcon) return null;

  return <FallbackIcon size={size} color={color} weight={weight} />;
};

export default AppIcon;
