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


  async update(data: Prisma.MealUncheckedUpdateInput) {
    const meal = await prisma.meal.update({
      data: {
        createdAt: data.createdAt,
        description: data.description,
        hour: data.hour,
        isOnDiet: data.isOnDiet,
        name: data.name,
        userId: data.userId
      },
      where: {
        id: data.id as string
      }
    })

    return meal
  }

  async findMealById(mealId: string) {
    const meal = await prisma.meal.findUnique({
      where: {
        id: mealId
      }
    })

    return meal
  }

  async deleteMealById(mealId: string) {
    await prisma.meal.delete({
      where: {
        id: mealId
      }
    })
  }
}

