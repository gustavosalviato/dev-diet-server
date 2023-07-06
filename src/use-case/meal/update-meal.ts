import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { MealsRepository } from "@/respositories/prisma/meals/meals-respository";

interface UpdateMealRequest {
  mealId: string
  description: string,
  name: string,
  createdAt: string,
  isOnDiet: boolean
  hour: string
}

export class UpdateMealUseCase {
  constructor(private mealsRepository: MealsRepository) { }

  async execute({ createdAt, description, hour, isOnDiet, mealId, name }: UpdateMealRequest) {
    const doesMealExists = await this.mealsRepository.findMealById(mealId)

    if (!doesMealExists) {
      throw new ResourceNotFoundError()
    }

    const meal = await this.mealsRepository.update({
      createdAt,
      description,
      hour,
      id: mealId,
      isOnDiet,
      name,
    })

    return {
      meal
    }
  }
}