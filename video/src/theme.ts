// Theme and layout constants for PayPal Sentinel Remotion Film
import { PALETTE } from "./palette";

export const FONT_SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', system-ui, sans-serif";
export const FONT_MONO = "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, monospace";

export const THEME = {
  fontSans: FONT_SANS,
  fontMono: FONT_MONO,
  bg: PALETTE.bgDeep,
  surface: PALETTE.surface,
  card: PALETTE.surfaceCard,
  emerald: PALETTE.emerald,
  blue: PALETTE.paypalBlueBright,
  border: PALETTE.border,
  borderStrong: PALETTE.borderStrong,
  ink: PALETTE.ink,
  muted: PALETTE.muted,
} as const;
