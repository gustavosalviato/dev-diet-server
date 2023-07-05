import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../prisma/users/users-repository";
import { randomUUID } from 'node:crypto'
export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      sequenceCount: 0,
      githubId: null,
      avatar: null,
      createdAt: new Date(),
      bestSequence: 0,
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null
    }

    return user
  }

  async findUserById(id: string) {
    const user = this.users.find(user => user.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async update(data: Prisma.UserUncheckedUpdateInput) {
    const userIndex = this.users.findIndex(user => user.id === data.id)

    const updatedUser = this.users[userIndex]

    updatedUser.avatar = data.avatar as string
    updatedUser.createdAt = data.createdAt as Date
    updatedUser.email = data.email as string
    updatedUser.githubId = data.githubId as number
    updatedUser.name = data.name as string
    updatedUser.sequenceCount = data.sequenceCount as number

    return updatedUser
  }
}