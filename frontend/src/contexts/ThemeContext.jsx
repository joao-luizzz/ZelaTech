import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Estado inicial do tema. 
  // 1. Tenta recuperar o tema salvo no localStorage (memória do navegador).
  // 2. Se não existir, verifica a preferência de cor do sistema operacional do usuário. (Andrey)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('zelatech-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Toda vez que a variável 'theme' mudar, este hook é executado.
  // Ele injeta a classe 'dark' ou 'light' na raiz do HTML (necessário para o Tailwind)
  // e salva a escolha no localStorage para a próxima visita. (Andrey)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('zelatech-theme', theme);
  }, [theme]);

  // Função "interruptor". Alterna entre o modo claro e escuro. (Andrey)
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
