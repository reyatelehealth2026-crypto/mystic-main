"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "pastel" | "rainbow" | "soft";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("mysticflow-theme") as Theme;
    if (savedTheme && ["light", "soft", "pastel", "rainbow"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Save to localStorage
    localStorage.setItem("mysticflow-theme", theme);
    
    // Apply theme class to document
    document.documentElement.setAttribute("data-theme", theme);
    
    // Apply CSS variables based on theme
    applyThemeVariables(theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "soft", "pastel", "rainbow"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeState(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function applyThemeVariables(theme: Theme) {
  const root = document.documentElement;
  
  switch (theme) {
    case "pastel":
      // More contrasting gradient - deeper purple to vibrant pink
      root.style.setProperty("--bg", "linear-gradient(135deg, #7B2CBF 0%, #C77DFF 30%, #FF006E 70%, #FF9ECD 100%)");
      root.style.setProperty("--bg-elevated", "rgba(255, 255, 255, 0.25)");
      root.style.setProperty("--bg-soft", "rgba(255, 255, 255, 0.15)");
      root.style.setProperty("--bg-muted", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty("--text", "#FFFFFF");
      root.style.setProperty("--text-muted", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--text-subtle", "rgba(255, 255, 255, 0.7)");
      root.style.setProperty("--accent", "#FF006E");
      root.style.setProperty("--accent-hover", "#FF4D9E");
      root.style.setProperty("--accent-light", "#FF9ECD");
      root.style.setProperty("--border", "rgba(255, 255, 255, 0.4)");
      root.style.setProperty("--border-mystical", "rgba(255, 255, 255, 0.6)");
      root.style.setProperty("--surface-1", "rgba(255, 255, 255, 0.25)");
      root.style.setProperty("--surface-2", "rgba(255, 255, 255, 0.2)");
      root.style.setProperty("--surface-3", "rgba(255, 255, 255, 0.15)");
      root.style.setProperty("--shadow-soft", "0 8px 32px rgba(123, 44, 191, 0.4)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(255, 0, 110, 0.3)");
      root.style.setProperty("--shadow-card-hover", "0 12px 40px rgba(255, 0, 110, 0.45)");
      root.style.setProperty("--bg-gradient", `
        linear-gradient(135deg, #5A189A 0%, #7B2CBF 15%, #9D4EDD 35%, #C77DFF 50%, #FF006E 75%, #FF9ECD 100%)
      `);
      
      // Add pastel Memphis styles
      if (!document.getElementById("pastel-styles")) {
        const style = document.createElement("style");
        style.id = "pastel-styles";
        style.textContent = `
          [data-theme="pastel"] {
            background: linear-gradient(135deg, #5A189A 0%, #7B2CBF 15%, #9D4EDD 35%, #C77DFF 50%, #FF006E 75%, #FF9ECD 100%);
            min-height: 100vh;
          }
          [data-theme="pastel"] .memphis-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(2px);
          }
          [data-theme="pastel"] .memphis-x {
            position: absolute;
            color: rgba(255, 255, 255, 0.5);
            font-size: 24px;
            font-weight: 300;
          }
          [data-theme="pastel"] .memphis-wave {
            position: absolute;
            width: 60px;
            height: 8px;
            background: repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.4) 0px,
              rgba(255, 255, 255, 0.4) 4px,
              transparent 4px,
              transparent 8px
            );
            border-radius: 4px;
          }
          [data-theme="pastel"] .glass-card {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(90, 24, 154, 0.3);
          }
          [data-theme="pastel"] .glass-button {
            background: rgba(255, 255, 255, 0.35);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50px;
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(255, 0, 110, 0.35);
            transition: all 0.3s ease;
          }
          [data-theme="pastel"] .glass-button:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(255, 0, 110, 0.5);
          }
          [data-theme="pastel"] h1, [data-theme="pastel"] h2, [data-theme="pastel"] h3 {
            color: white;
            text-shadow: 0 2px 10px rgba(90, 24, 154, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          [data-theme="pastel"] .gradient-text {
            background: linear-gradient(90deg, #FFFFFF, #FFE4F0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          [data-theme="pastel"] .floating {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
          }
          [data-theme="pastel"] .pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
      }
      break;
      
    case "rainbow":
      root.style.setProperty("--bg", "#0f0f1a");
      root.style.setProperty("--bg-elevated", "#1a1a2e");
      root.style.setProperty("--bg-soft", "#252545");
      root.style.setProperty("--bg-muted", "#1f1f35");
      root.style.setProperty("--text", "#ffffff");
      root.style.setProperty("--text-muted", "#c0c0d0");
      root.style.setProperty("--text-subtle", "#808090");
      root.style.setProperty("--accent", "#ff00ff");
      root.style.setProperty("--accent-hover", "#ff44ff");
      root.style.setProperty("--accent-light", "#ff88ff");
      root.style.setProperty("--border", "#3a3a5a");
      root.style.setProperty("--border-mystical", "#ff00ff");
      root.style.setProperty("--surface-1", "#1a1a2e");
      root.style.setProperty("--surface-2", "#252545");
      root.style.setProperty("--surface-3", "#3a3a6a");
      root.style.setProperty("--shadow-soft", "0 4px 20px rgba(255, 0, 255, 0.2)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(0, 255, 255, 0.15)");
      root.style.setProperty("--shadow-card-hover", "0 8px 32px rgba(255, 0, 255, 0.3)");
      root.style.setProperty("--bg-gradient", `
        radial-gradient(1200px 600px at 12% -10%, rgba(255, 0, 255, 0.2), transparent 58%),
        radial-gradient(900px 520px at 85% 0%, rgba(0, 255, 255, 0.15), transparent 60%),
        radial-gradient(800px 400px at 50% 100%, rgba(255, 215, 0, 0.1), transparent 50%),
        linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 55%, #0f0f1a 100%)
      `);
      
      // Add rainbow animation class
      if (!document.getElementById("rainbow-styles")) {
        const style = document.createElement("style");
        style.id = "rainbow-styles";
        style.textContent = `
          [data-theme="rainbow"] .rainbow-text {
            background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% auto;
            animation: rainbow-shift 3s linear infinite;
          }
          [data-theme="rainbow"] .rainbow-border {
            border-image: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3) 1;
          }
          [data-theme="rainbow"] .rainbow-glow {
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2);
          }
          [data-theme="rainbow"] .card-hover:hover {
            box-shadow: 0 8px 32px rgba(255, 0, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2);
          }
          @keyframes rainbow-shift {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes magical-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          [data-theme="rainbow"] .magical-float {
            animation: magical-float 3s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
      }
      break;

    case "soft":
      // Soft Neumorphism theme - based on UI Kit reference
      root.style.setProperty("--bg", "#e8e4f0");
      root.style.setProperty("--bg-elevated", "#f0ecf5");
      root.style.setProperty("--bg-soft", "#e5e1ec");
      root.style.setProperty("--bg-muted", "#d8d4e0");
      root.style.setProperty("--text", "#2d2a35");
      root.style.setProperty("--text-muted", "#5a5665");
      root.style.setProperty("--text-subtle", "#8a8695");
      root.style.setProperty("--accent", "#7c3aed");
      root.style.setProperty("--accent-hover", "#6d28d9");
      root.style.setProperty("--accent-light", "#a78bfa");
      root.style.setProperty("--border", "rgba(255, 255, 255, 0.5)");
      root.style.setProperty("--border-mystical", "rgba(124, 58, 237, 0.3)");
      root.style.setProperty("--surface-1", "linear-gradient(145deg, #f0ecf5, #e2dee8)");
      root.style.setProperty("--surface-2", "linear-gradient(145deg, #e8e4f0, #dad6e2)");
      root.style.setProperty("--surface-3", "#d1cde0");
      root.style.setProperty("--shadow-soft", "8px 8px 16px #d1cdd8, -8px -8px 16px #ffffff");
      root.style.setProperty("--shadow-card", "12px 12px 24px #d1cdd8, -12px -12px 24px #ffffff");
      root.style.setProperty("--shadow-card-hover", "16px 16px 32px #c9c5d0, -16px -16px 32px #ffffff");
      root.style.setProperty("--shadow-inset", "inset 6px 6px 12px #d1cdd8, inset -6px -6px 12px #ffffff");
      root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #e8e4f0 0%, #f0ecf5 50%, #e5e1ec 100%)");
      
      // Add soft neumorphism styles
      if (!document.getElementById("soft-styles")) {
        const style = document.createElement("style");
        style.id = "soft-styles";
        style.textContent = `
          [data-theme="soft"] {
            background: linear-gradient(135deg, #e8e4f0 0%, #f0ecf5 50%, #e5e1ec 100%);
            min-height: 100vh;
          }
          [data-theme="soft"] .neumorph-card {
            background: linear-gradient(145deg, #f0ecf5, #e2dee8);
            border-radius: 24px;
            box-shadow: 12px 12px 24px #d1cdd8, -12px -12px 24px #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          [data-theme="soft"] .neumorph-button {
            background: linear-gradient(145deg, #f0ecf5, #e2dee8);
            border-radius: 50px;
            box-shadow: 8px 8px 16px #d1cdd8, -8px -8px 16px #ffffff;
            border: none;
            color: #7c3aed;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          [data-theme="soft"] .neumorph-button:hover {
            box-shadow: 12px 12px 24px #c9c5d0, -12px -12px 24px #ffffff;
            transform: translateY(-2px);
          }
          [data-theme="soft"] .neumorph-button:active {
            box-shadow: inset 6px 6px 12px #d1cdd8, inset -6px -6px 12px #ffffff;
            transform: translateY(0);
          }
          [data-theme="soft"] .neumorph-inset {
            background: #e8e4f0;
            border-radius: 20px;
            box-shadow: inset 6px 6px 12px #d1cdd8, inset -6px -6px 12px #ffffff;
          }
          [data-theme="soft"] .gradient-button {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #7c3aed 100%);
            border-radius: 50px;
            box-shadow: 6px 6px 12px rgba(124, 58, 237, 0.3), -6px -6px 12px rgba(255, 255, 255, 0.8);
            color: white;
            font-weight: 600;
            border: none;
            transition: all 0.3s ease;
          }
          [data-theme="soft"] .gradient-button:hover {
            box-shadow: 8px 8px 16px rgba(124, 58, 237, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
          }
          [data-theme="soft"] .gradient-text {
            background: linear-gradient(90deg, #8b5cf6, #ec4899, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          [data-theme="soft"] .soft-glow {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(236, 72, 153, 0.15);
          }
          [data-theme="soft"] .floating-card {
            animation: soft-float 6s ease-in-out infinite;
          }
          @keyframes soft-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          [data-theme="soft"] h1, [data-theme="soft"] h2, [data-theme="soft"] h3 {
            color: #2d2a35;
            text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
          }
        `;
        document.head.appendChild(style);
      }
      break;
      
    default: // light
      root.style.setProperty("--bg", "#ffffff");
      root.style.setProperty("--bg-elevated", "#ffffff");
      root.style.setProperty("--bg-soft", "#faf5ff");
      root.style.setProperty("--bg-muted", "#f3f4f6");
      root.style.setProperty("--text", "#1f2937");
      root.style.setProperty("--text-muted", "#6b7280");
      root.style.setProperty("--text-subtle", "#9ca3af");
      root.style.setProperty("--accent", "#7c3aed");
      root.style.setProperty("--accent-hover", "#5b21b6");
      root.style.setProperty("--accent-light", "#a78bfa");
      root.style.setProperty("--border", "#e5e7eb");
      root.style.setProperty("--border-mystical", "#e9d5ff");
      root.style.setProperty("--surface-1", "#ffffff");
      root.style.setProperty("--surface-2", "#faf5ff");
      root.style.setProperty("--surface-3", "#f3e8ff");
      root.style.setProperty("--shadow-soft", "0 4px 20px rgba(124, 58, 237, 0.08)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(0, 0, 0, 0.06)");
      root.style.setProperty("--shadow-card-hover", "0 8px 32px rgba(124, 58, 237, 0.12)");
      root.style.setProperty("--bg-gradient", `
        radial-gradient(1200px 600px at 12% -10%, rgba(124, 58, 237, 0.08), transparent 58%),
        radial-gradient(900px 520px at 85% 0%, rgba(124, 58, 237, 0.05), transparent 60%),
        linear-gradient(180deg, #ffffff 0%, #faf5ff 55%, #ffffff 100%)
      `);
      break;
  }
}
