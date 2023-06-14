import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMealsRepository } from '@/respositories/in-memory/in-memory-meals.repository'
import {  ResourceNotFoundError } from '@/error/resource-not-found-error'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { ListMealsByUserUseCase } from './list-meals-by-user'

let mealsRespository: InMemoryMealsRepository
let usersRepository: InMemoryUsersRepository
let sut: ListMealsByUserUseCase

describe('List meals by user', () => {
  beforeEach(() => {
    mealsRespository = new InMemoryMealsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new ListMealsByUserUseCase(mealsRespository, usersRepository)

    usersRepository.users.push({
      id: 'user-id-1',
      avatar: '',
      createdAt: new Date(),
      email: '',
      githubId: null,
      name: '',
      sequenceCount: 0
    })

    mealsRespository.meals.push({
      id: 'meal-id-1',
      createdAt: new Date(),
      description: '',
      hour: 1,
      isOnDiet: true,
      name: '',
      userId: 'user-id-1'
    })

    mealsRespository.meals.push({
      id: 'meal-id-1',
      createdAt: new Date(),
      description: '',
      hour: 1,
      isOnDiet: true,
      name: '',
      userId: 'user-id-1'
    })
  })

  it('should be able to list all meals by user', async () => {
    const meals = await sut.execute({
      userId: 'user-id-1'
    })

    expect(meals).toBeTruthy()
  })

  it('should not be able to list all meals with a non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
