import { Prisma, Meal } from "@prisma/client";
import { MealsRepository } from "./meals-respository";
import { prisma } from "@/lib/prisma";

export class PrismaMealsRepository implements MealsRepository {

  async create(data: Prisma.MealCreateInput): Promise<Meal> {
    const meal = await prisma.meal.create({
      data
    })

    return meal
  }
}