import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { ProfileUseCase } from "../user/profile"

export function makeUserProfile() {
  const usersRepository = new PrismaUsersRepository()
  const profileUseCase = new ProfileUseCase(usersRepository)

  return profileUseCase
}