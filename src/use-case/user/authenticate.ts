import { InvalidCredentialsError } from "@/error/invalid-credential.error";
import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) { }


  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)


    if (!user) {
      throw new ResourceNotFoundError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user
    }
  }
}