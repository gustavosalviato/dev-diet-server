import { Prisma, Meal } from "@prisma/client";
import { MealsRepository } from "../prisma/meals/meals-respository";
import { randomUUID } from 'node:crypto'


export class InMemoryMealsRepository implements MealsRepository {
  public meals: Meal[] = []

  async create(data: Prisma.MealUncheckedCreateInput) {
    const meal: Meal = {
      id: randomUUID(),
      name: data.name,
      createdAt: new Date(),
      description: data.description,
      hour: data.hour,
      isOnDiet: data.isOnDiet,
      userId: data.userId
    }

    this.meals.push(meal)

    return meal
  }

}