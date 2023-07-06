import { ResourceNotFoundError, } from "@/error/resource-not-found-error";
import { MealsRepository } from "@/respositories/prisma/meals/meals-respository";

interface FetchUniqueMealRequest {
  mealId: string
}

export class FetchUniqueMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({  mealId }: FetchUniqueMealRequest) {
    const meal = await this.mealsRepository.findMealById(mealId)

    if (!meal){
      throw new ResourceNotFoundError()
    }


    return {
      meal
    }
  }
}