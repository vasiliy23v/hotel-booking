/**
 * Утилиты для работы с темами
 * Используйте эти классы вместо жестко заданных цветов
 */

export const themeClasses = {
  // Фоны
  bg: {
    main: 'bg-white dark:bg-card',
    card: 'bg-white dark:bg-card',
    muted: 'bg-gray-50 dark:bg-muted',
    accent: 'bg-gray-100 dark:bg-accent',
  },
  
  // Текст
  text: {
    primary: 'text-gray-900 dark:text-foreground',
    secondary: 'text-gray-700 dark:text-foreground',
    muted: 'light:text-gray-600 dark:text-gray-600 dark:text-muted-foreground',
    light: 'text-gray-500 dark:text-muted-foreground',
  },
  
  // Границы
  border: {
    default: 'border-gray-200 dark:border-border',
    input: 'border-gray-300 dark:border-border',
    focus: 'border-gray-900 dark:border-ring',
  },
  
  // Инпуты
  input: 'bg-white dark:bg-input text-gray-900 dark:text-foreground border-gray-300 dark:border-border focus:border-gray-900 dark:focus:border-ring',
  
  // Кнопки
  button: {
    primary: 'bg-gray-900 dark:bg-primary text-white dark:text-primary-foreground hover:bg-gray-800 dark:hover:bg-accent',
    secondary: 'bg-white dark:bg-card text-gray-700 dark:text-foreground border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-accent',
    outline: 'bg-white dark:bg-card border border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent',
  },
} as const;

