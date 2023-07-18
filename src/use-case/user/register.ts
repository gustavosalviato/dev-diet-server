import { UserAlreadyExistsError } from "@/error/user-already-exists.error";
import { UsersRepository } from "@/respositories/prisma/users/users-repository";
import { hash } from "bcryptjs";

interface CreateUserRequest {
  name: string,
  email: string
  password: string
}
export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, name, password }: CreateUserRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const user = await this.usersRepository.create({
      email,
      name,
      sequenceCount: 0,
      bestSequence: 0,
      password_hash: await hash(password, 6)
    })

    return {
      user
    }
  }
}