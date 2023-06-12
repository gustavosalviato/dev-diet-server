import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMealsRepository } from '@/respositories/in-memory/in-memory-meals.repository'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { DeleteMealUseCase } from './delete-meal'

let mealsRespository: InMemoryMealsRepository
let sut: DeleteMealUseCase

describe('Update Meal', () => {
  beforeEach(() => {
    mealsRespository = new InMemoryMealsRepository()
    sut = new DeleteMealUseCase(mealsRespository)

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

  it('should be able to delete a meal', async () => {
    await sut.execute({
      mealId: 'meal-id-1'
    })
  })

  it('should not be able to delete a non existing meal', async () => {
    await expect(() =>
      sut.execute({
        mealId: 'non-existing-meal-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
