import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('skan_theme') as Theme) || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.setProperty('--background', '#f8f5ff');
      root.style.setProperty('--foreground', '#1a0a2e');
      root.style.setProperty('--card-bg', '#f0eaff');
      root.style.setProperty('--card-border', '#d8c8f0');
      root.style.setProperty('--text-primary', '#1a0a2e');
      root.style.setProperty('--text-secondary', '#6b5b8a');
      root.style.setProperty('--text-muted', '#9b8bb8');
      root.style.setProperty('--accent-purple', '#8b5cf6');
      root.style.setProperty('--accent-pink', '#ec4899');
      root.style.setProperty('--nav-bg', 'rgba(248,245,255,0.85)');
      root.style.setProperty('--scrollbar-track', '#f0eaff');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.setProperty('--background', '#0a0514');
      root.style.setProperty('--foreground', '#e2e8f0');
      root.style.setProperty('--card-bg', 'rgba(139,92,246,0.05)');
      root.style.setProperty('--card-border', 'rgba(139,92,246,0.1)');
      root.style.setProperty('--text-primary', 'rgba(255,255,255,0.9)');
      root.style.setProperty('--text-secondary', 'rgba(196,181,253,0.5)');
      root.style.setProperty('--text-muted', 'rgba(196,181,253,0.3)');
      root.style.setProperty('--accent-purple', '#8b5cf6');
      root.style.setProperty('--accent-pink', '#ec4899');
      root.style.setProperty('--nav-bg', 'rgba(10,5,20,0.7)');
      root.style.setProperty('--scrollbar-track', '#0a0514');
    }
    localStorage.setItem('skan_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
