import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { RefreshTokenUseCase } from "../user/refresh"

export function MakeRefreshTokenUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokenUsecase = new RefreshTokenUseCase(usersRepository)

  return refreshTokenUsecase
}