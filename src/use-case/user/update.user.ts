import { ResourceNotFoundError } from "@/error/resource-not-found-error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";

interface UpdateUserResquest {
  name: string
  email: string
  avatar?: string
  sequenceCount: number,
  userId: string
}
export class UpdateUseUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ avatar, email, name, sequenceCount, userId }: UpdateUserResquest) {
  const doesUserExists = await this.usersRepository.findUserById(userId)

    if (!doesUserExists) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.update({
      avatar,
      email,
      name,
      sequenceCount,
      id: userId
    })

    return {
      user
    }
  }
}