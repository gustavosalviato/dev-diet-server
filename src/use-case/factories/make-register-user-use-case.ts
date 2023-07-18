import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { RegisterUserUseCase } from "../user/register"

export function makeRegisterUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const createMealUseCase = new RegisterUserUseCase(usersRepository)

  return createMealUseCase
}