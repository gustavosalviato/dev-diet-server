import { Prisma } from "@prisma/client";
import { UsersRepository } from "./users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }

  async findUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    return user
  }

  async update(data: Prisma.UserUncheckedUpdateInput) {
    const user = await prisma.user.update({
      data: {
        avatar: data.avatar,
        createdAt: data.createdAt,
        email: data.email,
        githubId: data.githubId,
        name: data.name,
      },
      where: {
        id: data.id as string
      }
    })

    return user
  }
}