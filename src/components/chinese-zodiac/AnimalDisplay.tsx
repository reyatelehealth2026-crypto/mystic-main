// Chinese Zodiac Animal Display Component
// Feature: popular-fortune-features
// Displays Chinese zodiac animal with icon, Thai name, and element

import * as React from "react";
import { cn } from "@/lib/cn";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import {
  ChineseZodiacAnimal,
  ChineseElement,
} from "@/lib/chinese-zodiac/types";
import {
  getAnimalMetadata,
  getElementMetadata,
} from "@/lib/chinese-zodiac/animals";

export interface AnimalDisplayProps {
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  className?: string;
  showDetails?: boolean; // Show traits and lucky items
}

/**
 * Map animal to emoji icon
 * Using Unicode emoji for visual representation
 */
const ANIMAL_ICONS: Record<ChineseZodiacAnimal, string> = {
  [ChineseZodiacAnimal.RAT]: "🐀",
  [ChineseZodiacAnimal.OX]: "🐂",
  [ChineseZodiacAnimal.TIGER]: "🐅",
  [ChineseZodiacAnimal.RABBIT]: "🐇",
  [ChineseZodiacAnimal.DRAGON]: "🐉",
  [ChineseZodiacAnimal.SNAKE]: "🐍",
  [ChineseZodiacAnimal.HORSE]: "🐎",
  [ChineseZodiacAnimal.GOAT]: "🐐",
  [ChineseZodiacAnimal.MONKEY]: "🐒",
  [ChineseZodiacAnimal.ROOSTER]: "🐓",
  [ChineseZodiacAnimal.DOG]: "🐕",
  [ChineseZodiacAnimal.PIG]: "🐖",
};

/**
 * Map element to color class
 */
const ELEMENT_COLORS: Record<ChineseElement, string> = {
  [ChineseElement.WOOD]: "text-green-600",
  [ChineseElement.FIRE]: "text-red-600",
  [ChineseElement.EARTH]: "text-yellow-700",
  [ChineseElement.METAL]: "text-gray-500",
  [ChineseElement.WATER]: "text-blue-600",
};

/**
 * Map element to background gradient
 */
const ELEMENT_GRADIENTS: Record<ChineseElement, string> = {
  [ChineseElement.WOOD]: "from-green-50 to-green-100",
  [ChineseElement.FIRE]: "from-red-50 to-red-100",
  [ChineseElement.EARTH]: "from-yellow-50 to-yellow-100",
  [ChineseElement.METAL]: "from-gray-50 to-gray-100",
  [ChineseElement.WATER]: "from-blue-50 to-blue-100",
};

/**
 * AnimalDisplay Component
 * 
 * Displays Chinese zodiac animal information including:
 * - Animal icon (emoji)
 * - Thai name
 * - Chinese name
 * - Element with Thai name
 * - Optional: traits, lucky colors, numbers, directions
 * 
 * @example
 * <AnimalDisplay 
 *   animal={ChineseZodiacAnimal.DRAGON} 
 *   element={ChineseElement.WOOD}
 * />
 */
export function AnimalDisplay({
  animal,
  element,
  className,
  showDetails = false,
}: AnimalDisplayProps) {
  const animalMeta = getAnimalMetadata(animal);
  const elementMeta = getElementMetadata(element);

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        `bg-gradient-to-br ${ELEMENT_GRADIENTS[element]}`,
        className
      )}
    >
      {/* Animal Icon and Names */}
      <div className="flex items-start gap-4">
        {/* Large Animal Icon */}
        <div className="flex-shrink-0">
          <div className="text-6xl leading-none">{ANIMAL_ICONS[animal]}</div>
        </div>

        {/* Animal and Element Info */}
        <div className="flex-1 min-w-0">
          {/* Thai Name */}
          <CardTitle className="text-xl mb-1">
            {animalMeta.thaiName}
          </CardTitle>

          {/* Chinese Name */}
          <CardDesc className="mb-2 text-base">
            {animalMeta.chineseName}
          </CardDesc>

          {/* Element Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium shadow-sm">
            <span className={cn("font-semibold", ELEMENT_COLORS[element])}>
              ธาตุ{elementMeta.thaiName}
            </span>
            <span className="text-fg-muted">
              {elementMeta.chineseName}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Details */}
      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
          {/* Traits */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-1">
              ลักษณะนิสัย
            </div>
            <div className="flex flex-wrap gap-1.5">
              {animalMeta.traits.map((trait, index) => (
                <span
                  key={index}
                  className="inline-block rounded-md bg-white/60 px-2 py-0.5 text-xs text-fg"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Colors */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-1">
              สีมงคล
            </div>
            <div className="flex flex-wrap gap-1.5">
              {animalMeta.luckyColors.map((color, index) => (
                <span
                  key={index}
                  className="inline-block rounded-md bg-white/60 px-2 py-0.5 text-xs text-fg"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-1">
              เลขมงคล
            </div>
            <div className="flex gap-1.5">
              {animalMeta.luckyNumbers.map((number, index) => (
                <span
                  key={index}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm font-semibold text-fg shadow-sm"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Directions */}
          <div>
            <div className="text-xs font-semibold text-fg-muted mb-1">
              ทิศมงคล
            </div>
            <div className="flex flex-wrap gap-1.5">
              {animalMeta.luckyDirections.map((direction, index) => (
                <span
                  key={index}
                  className="inline-block rounded-md bg-white/60 px-2 py-0.5 text-xs text-fg"
                >
                  {direction}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
