export const TextStyle = {
  size: {
    xxs: 11,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  family: {
    inter: "Inter",
    interItalic: "Inter-Italic",
  },
  weight: {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
  },
} as const;

export const DisplayStyle = {
  size: {
    xs: 24,
    sm: 30,
    md: 36,
    lg: 48,
    xl: 60,
  },
  family: {
    inter: "Inter",
    interItalic: "Inter-Italic",
  },
  weight: {
    Thin: 100,
    ExtraLight: 200,
    Light: 300,
    Regular: 400,
    Medium: 500,
    SemiBold: 600,
    Bold: 700,
    ExtraBold: 800,
    Black: 900,
  },
} as const;

// Kullanım: FontStyles.size.md, FontStyles.weight.bold
