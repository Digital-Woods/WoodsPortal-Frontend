import { useEffect } from 'react';
import { useTheme } from '@/state/use-theme';

const ThemeManager = () => {
  const { themeMode } = useTheme();

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [themeMode]);

  return null;
};

export default ThemeManager;