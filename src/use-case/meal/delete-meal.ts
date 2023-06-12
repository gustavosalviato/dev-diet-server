import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { MealsRepository } from "@/respositories/prisma/meals/meals-respository";

interface DeleteMealRequest {
  mealId: string
}
export class DeleteMealUseCase {
  constructor(private mealRepository: MealsRepository) { }

  async execute({ mealId }: DeleteMealRequest) {
    const doesMealExists = await this.mealRepository.findMealById(mealId)

    if (!doesMealExists) {
      throw new ResourceNotFoundError()
    }

    await this.mealRepository.deleteMealById(mealId)
  }
}