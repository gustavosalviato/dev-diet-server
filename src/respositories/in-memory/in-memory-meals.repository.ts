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

  async update(data: Prisma.MealUncheckedUpdateInput) {
    const mealIndex = this.meals.findIndex((meal) => meal.id === data.id)

    const updatedMeal = this.meals[mealIndex]

    updatedMeal.name = data.name as string
    updatedMeal.description = data.description as string
    updatedMeal.createdAt = data.createdAt as Date
    updatedMeal.hour = data.hour as number
    updatedMeal.isOnDiet = data.isOnDiet as boolean

    return updatedMeal

  }

  async findMealById(mealId: string) {
    const meal = this.meals.find(meal => meal.id === mealId)

    if (!meal) {
      return null
    }

    return meal
  }

}