import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMealsRepository } from '@/respositories/in-memory/in-memory-meals.repository'
import { UpdateMealUseCase } from './update-meal'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'

let mealsRespository: InMemoryMealsRepository
let sut: UpdateMealUseCase

describe('Update Meal', () => {
  beforeEach(() => {
    mealsRespository = new InMemoryMealsRepository()
    sut = new UpdateMealUseCase(mealsRespository)

    mealsRespository.meals.push({
      id: 'meal-id-1',
      userId: 'user-1',
      createdAt: new Date(),
      description: '',
      hour: 1,
      isOnDiet: false,
      name: '',
    })
  })

  it('should be able to update a meal', async () => {
    const { meal } = await sut.execute({
      mealId: 'meal-id-1',
      name: 'modified name',
      createdAt: '',
      description: 'modified description',
      hour: 2,
      isOnDiet: true,
    })

    expect(meal.name).toEqual('modified name')
    expect(meal.description).toEqual('modified description')
  })

  it('should not be able to update a meal with a non existing meal id', async () => {
    await expect(() =>
      sut.execute({
        mealId: 'non-existing-meal-id',
        name: 'modified name',
        createdAt: '',
        description: 'modified description',
        hour: 2,
        isOnDiet: true,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})
