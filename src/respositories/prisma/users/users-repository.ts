import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  update(data: Prisma.UserUncheckedUpdateInput) : Promise<User>
  findByEmail(email: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
}