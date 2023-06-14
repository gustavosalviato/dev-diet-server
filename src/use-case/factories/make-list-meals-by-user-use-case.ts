import { PrismaMealsRepository } from "@/respositories/prisma/meals/prisma-meals-repository"
import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { ListMealsByUserUseCase } from "../meal/list-meals-by-user"

export function makeListMealsByUserUseCase() {
  const mealsRepository = new PrismaMealsRepository()
  const usersRepository = new PrismaUsersRepository()
  const listMealsByUser = new ListMealsByUserUseCase(mealsRepository, usersRepository)

  return listMealsByUser
}