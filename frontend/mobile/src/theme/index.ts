export const theme = {
  colors: {
    // Primary brand colors
    primary: '#FF6B6B',
    primaryDark: '#EE5A52',
    primaryLight: '#FF8787',

    // Secondary colors
    secondary: '#4ECDC4',
    accent: '#FFE66D',

    // Gradients
    gradientStart: '#FF6B6B',
    gradientMiddle: '#FF8E53',
    gradientEnd: '#FFA94D',

    // Neutral colors
    background: '#FFFFFF',
    backgroundDark: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceLight: '#F8F9FA',

    // Text colors
    text: '#2D3436',
    textSecondary: '#636E72',
    textLight: '#B2BEC3',
    textInverse: '#FFFFFF',

    // Status colors
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#D63031',
    info: '#74B9FF',

    // Interactive states
    like: '#00D9A5',
    nope: '#FF6B9D',
    superLike: '#4FC3F7',

    // Dark mode
    dark: {
      background: '#121212',
      backgroundDark: '#1E1E1E',
      surface: '#1E1E1E',
      surfaceLight: '#2C2C2C',
      text: '#FFFFFF',
      textSecondary: '#B2B2B2',
      textLight: '#757575',
    },

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    overlayDark: 'rgba(0, 0, 0, 0.7)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      default: 'ease-in-out',
      spring: 'spring',
    },
  },
};

export type Theme = typeof theme;
