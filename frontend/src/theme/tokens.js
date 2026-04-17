export const colors = {
  // Backgrounds
  bg:        '#0d0f14',
  bgDeep:    '#080a0e',
  panel:     '#141720',
  panelAlt:  '#1a1f2e',
  surface:   '#1e2333',
  raised:    '#222840',
  border:    '#2a3050',
  borderDim: '#1e2440',

  // Text
  textPrimary:   '#e8ecf8',
  textSecondary: '#9aa5c4',
  textMuted:     '#5a6480',
  textDim:       '#3a4060',

  // Accent
  accent:     '#ff2d4a',
  accentDim:  '#cc2038',
  accentGlow: 'rgba(255, 45, 74, 0.25)',
  accent2:    '#00d4ff',
  accent2Dim: '#0099bb',
  accent2Glow:'rgba(0, 212, 255, 0.2)',

  // Status
  green:    '#00e676',
  greenDim: 'rgba(0, 230, 118, 0.2)',
  amber:    '#ffab00',
  amberDim: 'rgba(255, 171, 0, 0.2)',
  red:      '#ff2d4a',
};

export const fonts = {
  mono:    'ShareTechMono_400Regular',
  body:    'Rajdhani_400Regular',
  bodyMed: 'Rajdhani_500Medium',
  bodySB:  'Rajdhani_600SemiBold',
  bodyBold:'Rajdhani_700Bold',
  display: 'Orbitron_700Bold',
  displayXL: 'Orbitron_900ExtraBold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  }),
};
