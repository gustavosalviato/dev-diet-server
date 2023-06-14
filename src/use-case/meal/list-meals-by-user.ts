import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { MealsRepository, } from "@/respositories/prisma/meals/meals-respository";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";


interface ListMealByUserRequest {
  userId: string
}

export class ListMealsByUserUseCase {
  constructor(private mealsRepository: MealsRepository, private usersRepository: UsersRepository) { }

  async execute({ userId }: ListMealByUserRequest) {
    const doesUserExists = await this.usersRepository.findUserById(userId)

    if(!doesUserExists) {
      throw new ResourceNotFoundError()
    }
    
    const meals = await this.mealsRepository.getMealsByUser(userId)

    return meals
  }
}