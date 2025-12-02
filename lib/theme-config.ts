/**
 * Централизованная конфигурация цветов для светлой и темной темы
 * Все цвета определены здесь для легкого изменения
 */

export const themeColors = {
  light: {
    // Основные цвета
    background: '#ffffff',
    foreground: '#171717',
    
    // Карточки и контейнеры
    card: '#ffffff',
    cardForeground: '#0f172a',
    
    // Поповеры
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    
    // Основной цвет
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    
    // Вторичный цвет
    secondary: '#f1f5f9',
    secondaryForeground: '#0f172a',
    
    // Приглушенные цвета
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    
    // Акцент
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    
    // Деструктивные действия
    destructive: '#ef4444',
    destructiveForeground: '#f8fafc',
    
    // Границы и инпуты
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0f172a',
    
    // Сайдбар
    sidebar: '#fafafa',
    sidebarForeground: '#1f2937',
    sidebarPrimary: '#1f2937',
    sidebarPrimaryForeground: '#fafafa',
    sidebarAccent: '#f5f5f5',
    sidebarAccentForeground: '#1f2937',
    sidebarBorder: '#e5e7eb',
    sidebarRing: '#3b82f6',
  },
  
  dark: {
    // Основные цвета
    background: '#0f172a',
    foreground: '#f8fafc',
    
    // Карточки и контейнеры
    card: '#0f172a',
    cardForeground: '#f8fafc',
    
    // Поповеры
    popover: '#0f172a',
    popoverForeground: '#f8fafc',
    
    // Основной цвет
    primary: '#f8fafc',
    primaryForeground: '#0f172a',
    
    // Вторичный цвет
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    
    // Приглушенные цвета
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    
    // Акцент
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    
    // Деструктивные действия
    destructive: '#7f1d1d',
    destructiveForeground: '#f8fafc',
    
    // Границы и инпуты
    border: '#1e293b',
    input: '#1e293b',
    ring: '#cbd5e1',
    
    // Сайдбар
    sidebar: '#1a1a1a',
    sidebarForeground: '#e5e7eb',
    sidebarPrimary: '#3b82f6',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#262626',
    sidebarAccentForeground: '#e5e7eb',
    sidebarBorder: '#262626',
    sidebarRing: '#3b82f6',
  },
} as const;

/**
 * Утилита для получения цвета темы
 */
export function getThemeColor(theme: 'light' | 'dark', color: keyof typeof themeColors.light): string {
  return themeColors[theme][color];
}

