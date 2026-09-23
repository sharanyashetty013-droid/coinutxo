import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  isDayMode: boolean;
  setIsDayMode: (val: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDayMode: true,
  setIsDayMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Permanently locked into high-contrast Editorial Cyberpunk Light law enforcement aesthetic
  const isDayMode = true;

  useEffect(() => {
    try {
      localStorage.setItem('coin_utxo_theme_mode', 'day');
    } catch {
      // ignore
    }

    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    document.body.style.backgroundColor = '#EDF7F5';
    document.body.style.color = '#0F172A';
  }, []);

  const noop = () => {};

  return (
    <ThemeContext.Provider value={{ isDayMode: true, setIsDayMode: noop, toggleTheme: noop }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

