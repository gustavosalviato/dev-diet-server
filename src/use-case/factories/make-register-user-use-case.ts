import { PrismaUsersRepository } from "@/respositories/prisma/users/prisma-users-repository"
import { RegisterUserUseCase } from "../user/register-user"

export function makeRegisterUserUseCase() {
  const usersRespository = new PrismaUsersRepository()
  const registerUserUseCase = new RegisterUserUseCase(usersRespository)

  return registerUserUseCase
}