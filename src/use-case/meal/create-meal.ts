// import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { MealsRepository } from "@/respositories/prisma/meals/meals-respository";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";
import { Meal } from "@prisma/client";

interface CreateMealRequest {
  userId: string,
  description: string,
  name: string,
  hour: number,
  isOnDiet: boolean,
  createdAt: Date
}
interface CreateMealResponse {
  meal: Meal
}

export class CreateMealUseCase {
  constructor(private mealsRepository: MealsRepository, private usersRepository: UsersRepository) { }

  async execute({ description, hour, isOnDiet, name, userId, createdAt }: CreateMealRequest): Promise<CreateMealResponse> {

    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const meal = await this.mealsRepository.create({
      description,
      hour,
      isOnDiet,
      name,
      userId,
      createdAt
    })

    return {
      meal
    }
  }
}