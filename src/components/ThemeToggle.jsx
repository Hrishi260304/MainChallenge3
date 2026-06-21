import React, { useEffect, useState } from 'react';

/**
 * ThemeToggle - toggles between dark and light mode.
 * Saves preference in localStorage under 'theme' and applies it to <html> data-theme attribute.
 * Uses CSS variables defined in index.css to switch palettes.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      aria-label="Toggle dark and light theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
