import { UserAlreadyExistsError } from "@/error/user-already-exists.error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";

interface CreateUserRequest {
  name: string,
  email: string
}
export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, name }: CreateUserRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      name,
      sequenceCount: 0
    })

    return {
      user
    }
  }
}