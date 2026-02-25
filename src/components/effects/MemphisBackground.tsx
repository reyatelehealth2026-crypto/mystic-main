"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface MemphisElement {
  id: number;
  type: "circle" | "x" | "wave" | "dots" | "zigzag";
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}

export function MemphisBackground() {
  const { theme } = useTheme();
  const [elements, setElements] = useState<MemphisElement[]>([]);

  useEffect(() => {
    // Generate random Memphis elements
    const generateElements = (): MemphisElement[] => {
      const types: ("circle" | "x" | "wave" | "dots" | "zigzag")[] = ["circle", "x", "wave", "dots", "zigzag"];
      const colors = [
        "rgba(255, 255, 255, 0.4)",
        "rgba(255, 200, 230, 0.35)",
        "rgba(230, 180, 255, 0.35)",
        "rgba(255, 150, 200, 0.3)",
      ];
      const newElements: MemphisElement[] = [];
      
      for (let i = 0; i < 20; i++) {
        newElements.push({
          id: i,
          type: types[Math.floor(Math.random() * types.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 15 + Math.random() * 50,
          rotation: Math.random() * 360,
          opacity: 0.2 + Math.random() * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      
      return newElements;
    };

    setElements(generateElements());
  }, []);

  // Only show in pastel theme
  if (theme !== "pastel") {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(255, 0, 110, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(123, 44, 191, 0.05) 0%, transparent 70%)
          `,
        }}
      />
      
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute floating"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `rotate(${el.rotation}deg)`,
            opacity: el.opacity,
            animationDelay: `${el.id * 0.3}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        >
          {el.type === "circle" && (
            <div
              className="rounded-full border-2"
              style={{
                width: el.size,
                height: el.size,
                borderColor: el.color,
                backgroundColor: `${el.color.replace(/[\d.]+%?\)$/, '0.1)')}`,
              }}
            />
          )}
          {el.type === "x" && (
            <span
              className="font-light"
              style={{ 
                fontSize: el.size, 
                color: el.color,
                textShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              ×
            </span>
          )}
          {el.type === "wave" && (
            <div
              className="flex gap-1"
              style={{ width: el.size * 2 }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: el.size / 3,
                    height: el.size / 3,
                    backgroundColor: el.color,
                  }}
                />
              ))}
            </div>
          )}
          {el.type === "dots" && (
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: el.size / 4,
                    height: el.size / 4,
                    backgroundColor: el.color,
                  }}
                />
              ))}
            </div>
          )}
          {el.type === "zigzag" && (
            <svg
              width={el.size}
              height={el.size / 2}
              viewBox="0 0 40 20"
              fill="none"
              style={{ opacity: el.opacity + 0.2 }}
            >
              <path
                d="M0 10 L10 0 L20 10 L30 0 L40 10"
                stroke={el.color}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
