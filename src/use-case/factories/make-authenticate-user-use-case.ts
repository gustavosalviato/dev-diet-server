import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { AuthenticateUseCase } from "../user/authenticate"

export function MakeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}