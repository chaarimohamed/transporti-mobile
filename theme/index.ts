/**
 * Transporti Design System — Brand Token Library
 *
 * Brand palette:
 *   Golden Yellow  #EBB95F  — primary, active states, CTAs
 *   Dark Charcoal  #3E4957  — body text, labels
 *   Deep Navy      #1A2332  — splash bg, dark headers
 *   Warm Orange    #F5A962  — accent, secondary CTAs
 *   Light Cream    #F9F6F1  — page backgrounds
 *
 * Font: Poppins (loaded via @expo-google-fonts/poppins)
 */

// ─── Color tokens ────────────────────────────────────────────────────────────

export const Colors = {
  // Brand core
  primary: '#EBB95F',
  primaryDark: '#D4A74A',
  primaryLight: '#F5D9A0',
  primarySurface: '#FBF3E2',

  navy: '#1A2332',
  navyMid: '#263447',
  charcoal: '#3E4957',
  accent: '#F5A962',
  accentDark: '#E0924E',
  cream: '#F9F6F1',

  // Surfaces
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  background: '#F9F6F1',
  backgroundAlt: '#F2EDE5',

  // Text
  textPrimary: '#3E4957',
  textSecondary: '#6B7786',
  textMuted: '#9CA8B5',
  textInverse: '#FFFFFF',
  textOnPrimary: '#1A2332',

  // Borders
  border: '#E8DDD0',
  borderLight: '#F0EAE0',
  borderFocus: '#EBB95F',

  // Feedback
  success: '#2D9E6B',
  successSurface: '#E8F7F1',
  error: '#D92D20',
  errorSurface: '#FDECEA',
  warning: '#F59E0B',
  warningSurface: '#FEF3C7',
  info: '#3B82F6',
  infoSurface: '#EFF6FF',

  // Placeholders & disabled
  placeholder: '#A8B3BC',
  disabled: '#C8D0D8',
  disabledSurface: '#F0F3F5',

  // Overlay
  overlay: 'rgba(26, 35, 50, 0.5)',
  overlayLight: 'rgba(26, 35, 50, 0.15)',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  display: 34,
} as const;

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryGlow: {
    shadowColor: '#EBB95F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// ─── Icon sizes ───────────────────────────────────────────────────────────────

export const IconSizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  xxl: 48,
} as const;

// ─── Z-index ──────────────────────────────────────────────────────────────────

export const ZIndex = {
  base: 0,
  card: 10,
  nav: 100,
  modal: 200,
  toast: 300,
} as const;

// ─── Convenience text styles (use with StyleSheet) ────────────────────────────

export const TextStyles = {
  display: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.display,
    color: Colors.textPrimary,
    lineHeight: FontSizes.display * LineHeights.tight,
  },
  h1: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  h2: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  captionMedium: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  micro: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
} as const;
