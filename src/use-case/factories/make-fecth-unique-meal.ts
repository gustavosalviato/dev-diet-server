import { PrismaMealsRepository } from "@/respositories/prisma/meals/prisma-meals-repository"
import { FetchUniqueMealUseCase } from "../meal/fetch-unique-meal"

export function MakeFetchUniqueMeal() {
  const mealsRepository = new PrismaMealsRepository()
  const fecthUniqueMeal = new FetchUniqueMealUseCase(mealsRepository)

  return fecthUniqueMeal
}