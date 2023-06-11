import { Prisma } from "@prisma/client";
import { MealsRepository } from "./meals-respository";
import { prisma } from "@/lib/prisma";


export class PrismaMealsRepository implements MealsRepository {
  async create(data: Prisma.MealUncheckedCreateInput) {
    const meal = await prisma.meal.create({
      data
    })

    return meal
  }

  async findUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }
}

