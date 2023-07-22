import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";

interface ProfileUseCaseRequest {
  userId: string
}

export class ProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }


  async execute({ userId }: ProfileUseCaseRequest) {
    const userResponse = await this.usersRepository.findUserById(userId)


    if (!userResponse) {
      throw new ResourceNotFoundError()
    }

    const user = {
      name: userResponse.name,
      email: userResponse.email
    }

    return {
      user
    }
  }
}