// NextRide Brand Design Tokens
// Derived directly from the official NextRide logo

export const BRAND_TOKENS = {
  name: 'NextRide',
  tagline: 'Your next ride, on time, every time',
  taglineHi: 'आपकी अगली सवारी, समय पर, हर बार',
  
  colors: {
    // Primary brand blue derived from the official logo
    primary: {
      DEFAULT: '#1258D4', // Logo-matched primary electric royal blue
      hover: '#0D4BB8',
      active: '#0A3C94',
      dark: '#0D40AB',   // Deep gradient tone from logo bottom
      light: '#256BF5',
      surface: '#F0F5FF', // Subtle blue tint for cards and highlights
      border: '#C7DCFE',
    },
    // Supporting white & neutral surfaces
    neutral: {
      background: '#F8FAFC', // Slate-50 background for clean contrast
      surface: '#FFFFFF',    // Pure white cards & containers
      cardHover: '#F1F5F9',
      border: '#E2E8F0',     // Crisp neutral borders
      borderDark: '#CBD5E1',
      textPrimary: '#0F172A', // Slate-900 high readability
      textSecondary: '#475569', // Slate-600
      textMuted: '#94A3B8',    // Slate-400
    },
    // Semantic status colors - carefully harmonized with brand blue
    semantic: {
      success: {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        text: '#166534',
        badge: '#16A34A',
      },
      warning: {
        bg: '#FFFBEB',
        border: '#FDE68A',
        text: '#92400E',
        badge: '#D97706',
      },
      error: {
        bg: '#FEF2F2',
        border: '#FECACA',
        text: '#991B1B',
        badge: '#DC2626',
      },
      info: {
        bg: '#F0F5FF',
        border: '#BFDBFE',
        text: '#1E40AF',
        badge: '#1258D4',
      }
    }
  },

  typography: {
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif',
    fontHindi: '"Noto Sans Devanagari", "Inter", sans-serif',
  },

  radii: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px - matching squircle proportions
    full: '9999px',
  },

  shadows: {
    subtle: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
    card: '0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)',
    brand: '0 10px 25px -5px rgba(18, 88, 212, 0.25)',
  }
} as const;

export type BrandTokens = typeof BRAND_TOKENS;
