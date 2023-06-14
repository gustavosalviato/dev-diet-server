import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { MealsRepository } from "@/respositories/prisma/meals/meals-respository";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";

interface ListUserMetricsRequest {
  userId: string
}

export class ListUserMetricsUseCase {
  constructor(private mealsRepository: MealsRepository, private usersRepository: UsersRepository) { }

  async execute({ userId }: ListUserMetricsRequest) {
    const doesUserExists = await this.usersRepository.findUserById(userId)

    if (!doesUserExists) {
      throw new ResourceNotFoundError()
    }

    const meals = await this.mealsRepository.getMealsByUser(userId)


    const metrics = {
      totalMeals: meals.length,
      totalMealOnDiet: meals.filter(meal => meal.isOnDiet === true).length,
      totalMealOffDiet: meals.filter(meal => meal.isOnDiet === false).length
    }


    return {
      metrics
    }
  }
}