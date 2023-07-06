import { PrismaMealsRepository } from "@/respositories/prisma/meals/prisma-meals-repository"
import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { ListUserMetricsUseCase } from "../meal/list-user-metrics"

export function makeListUserMetrics () {
  
  const mealsRepository = new PrismaMealsRepository()
  const usersRepository = new PrismaUsersRepository()
  const listUserMetricsUseCase = new ListUserMetricsUseCase(mealsRepository,usersRepository)

  return listUserMetricsUseCase
}