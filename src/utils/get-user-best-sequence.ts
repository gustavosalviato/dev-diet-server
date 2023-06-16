import { Meal } from "@prisma/client";

export function getUserBestSequence(meals: Meal[]): number | null {
  if (meals.length === 0) {
    return null;
  }

  let sequence: number = 0

  for (let i = 1; i < meals.length; i++) {
    const currentMeal = meals[i];
    const previousMeal = meals[i - 1];

    if (currentMeal.isOnDiet === true && previousMeal.isOnDiet === true) {
      sequence = sequence + 1
    }
  }
  return sequence;
}