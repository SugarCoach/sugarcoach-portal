// Glucose level color indicators
export const glucoseColors = {
  hypo: '#EF4444',      // Red - Hypoglycemia
  normal: '#10B981',    // Green - Normal range
  hyper: '#F59E0B',     // Yellow/Amber - Hyperglycemia
  warning: '#9333EA',   // Purple - Warning/Alert
} as const;

export type GlucoseColorKey = keyof typeof glucoseColors;

// Glassmorphism styles
export const glassmorphismStyles = {
  backdrop: 'backdrop-blur-md',
  background: 'bg-white/10 dark:bg-black/10',
  border: 'border border-white/20 dark:border-white/10',
  shadow: 'shadow-xl',
  combined: 'backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 shadow-xl',
} as const;

// CSS Variables for glucose colors (can be used in tailwind config)
export const glucoseColorsCss = {
  '--glucose-hypo': 'rgb(239, 68, 68)',     // #EF4444
  '--glucose-normal': 'rgb(16, 185, 129)',  // #10B981
  '--glucose-hyper': 'rgb(245, 158, 11)',   // #F59E0B
  '--glucose-warning': 'rgb(147, 51, 234)', // #9333EA
} as const;

// Utility function to get color by glucose value
export const getGlucoseColor = (value: number, unit: 'mg/dL' | 'mmol/L' = 'mg/dL'): GlucoseColorKey => {
  // Convert to mg/dL if needed (1 mmol/L ≈ 18 mg/dL)
  const mgdl = unit === 'mmol/L' ? value * 18 : value;

  // Glucose ranges (typical values)
  // Hypoglycemia: < 70 mg/dL
  // Normal: 70-180 mg/dL
  // Hyperglycemia: > 180 mg/dL
  // Warning: > 250 mg/dL

  if (mgdl < 70) return 'hypo';
  if (mgdl > 250) return 'warning';
  if (mgdl > 180) return 'hyper';
  return 'normal';
};

// Export color sets for different themes
export const colorScheme = {
  light: {
    background: '#F9FAFB',
    foreground: '#1F2937',
    primary: glucoseColors.normal,
    hypo: glucoseColors.hypo,
    hyper: glucoseColors.hyper,
    warning: glucoseColors.warning,
  },
  dark: {
    background: '#111827',
    foreground: '#F9FAFB',
    primary: glucoseColors.normal,
    hypo: glucoseColors.hypo,
    hyper: glucoseColors.hyper,
    warning: glucoseColors.warning,
  },
} as const;
