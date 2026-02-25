// Example usage of AnimalDisplay component
// Feature: popular-fortune-features

import { AnimalDisplay } from './AnimalDisplay';
import { ChineseZodiacAnimal, ChineseElement } from '@/lib/chinese-zodiac/types';

/**
 * Example 1: Basic usage - Display animal without details
 */
export function BasicAnimalDisplay() {
  return (
    <AnimalDisplay
      animal={ChineseZodiacAnimal.DRAGON}
      element={ChineseElement.WOOD}
    />
  );
}

/**
 * Example 2: Display animal with full details
 */
export function DetailedAnimalDisplay() {
  return (
    <AnimalDisplay
      animal={ChineseZodiacAnimal.DRAGON}
      element={ChineseElement.WOOD}
      showDetails={true}
    />
  );
}

/**
 * Example 3: Display multiple animals in a grid
 */
export function AnimalGrid() {
  const animals = [
    { animal: ChineseZodiacAnimal.RAT, element: ChineseElement.WATER },
    { animal: ChineseZodiacAnimal.OX, element: ChineseElement.EARTH },
    { animal: ChineseZodiacAnimal.TIGER, element: ChineseElement.WOOD },
    { animal: ChineseZodiacAnimal.RABBIT, element: ChineseElement.WOOD },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {animals.map(({ animal, element }) => (
        <AnimalDisplay
          key={animal}
          animal={animal}
          element={element}
        />
      ))}
    </div>
  );
}

/**
 * Example 4: Display animal with custom styling
 */
export function CustomStyledAnimalDisplay() {
  return (
    <AnimalDisplay
      animal={ChineseZodiacAnimal.SNAKE}
      element={ChineseElement.FIRE}
      showDetails={true}
      className="max-w-md mx-auto"
    />
  );
}

/**
 * Example 5: Display all 12 animals
 */
export function AllAnimalsDisplay() {
  const allAnimals = [
    { animal: ChineseZodiacAnimal.RAT, element: ChineseElement.WATER },
    { animal: ChineseZodiacAnimal.OX, element: ChineseElement.EARTH },
    { animal: ChineseZodiacAnimal.TIGER, element: ChineseElement.WOOD },
    { animal: ChineseZodiacAnimal.RABBIT, element: ChineseElement.WOOD },
    { animal: ChineseZodiacAnimal.DRAGON, element: ChineseElement.EARTH },
    { animal: ChineseZodiacAnimal.SNAKE, element: ChineseElement.FIRE },
    { animal: ChineseZodiacAnimal.HORSE, element: ChineseElement.FIRE },
    { animal: ChineseZodiacAnimal.GOAT, element: ChineseElement.EARTH },
    { animal: ChineseZodiacAnimal.MONKEY, element: ChineseElement.METAL },
    { animal: ChineseZodiacAnimal.ROOSTER, element: ChineseElement.METAL },
    { animal: ChineseZodiacAnimal.DOG, element: ChineseElement.EARTH },
    { animal: ChineseZodiacAnimal.PIG, element: ChineseElement.WATER },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {allAnimals.map(({ animal, element }) => (
        <AnimalDisplay
          key={animal}
          animal={animal}
          element={element}
        />
      ))}
    </div>
  );
}
