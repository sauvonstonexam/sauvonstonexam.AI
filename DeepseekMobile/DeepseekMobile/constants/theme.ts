import { Platform } from "react-native";

const primaryPurple = "#6366F1";
const primaryBlue = "#1E40AF";
const accentCyan = "#06B6D4";

export const Colors = {
  light: {
    text: "#11181C",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: primaryPurple,
    link: primaryBlue,
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F2F2F2",
    backgroundSecondary: "#E6E6E6",
    backgroundTertiary: "#D9D9D9",
    primary: primaryPurple,
    secondary: primaryBlue,
    accent: accentCyan,
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    userBubble: primaryPurple,
    aiBubble: "#2D3748",
  },
  dark: {
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryPurple,
    link: accentCyan,
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#2D3748",
    backgroundTertiary: "#374151",
    primary: primaryPurple,
    secondary: primaryBlue,
    accent: accentCyan,
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    userBubble: primaryPurple,
    aiBubble: "#2D3748",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
