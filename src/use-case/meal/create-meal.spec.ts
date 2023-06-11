import { beforeEach, describe, expect, it } from 'vitest'
import { MealsRepository } from '@/respositories/prisma/meals/meals-respository'
import { InMemoryMealsRepository } from '@/respositories/in-memory/in-memory-meals.repository'
import { CreateMealUseCase } from './create-meal'
import { UsersRepository } from '@/respositories/prisma/users/users-repository'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'


let mealsRespository: MealsRepository
let usersRepository: UsersRepository
let sut: CreateMealUseCase


describe('Create meal', () => {
  beforeEach(() => {
    mealsRespository = new InMemoryMealsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateMealUseCase(mealsRespository, usersRepository)
  })

  it('should be able to create meal', async () => {

    const user = await usersRepository.create({
      email: '',
      name: '',
      sequenceCount: 0,
    })

    const { meal } = await sut.execute({
      description: 'test description',
      hour: 1,
      isOnDiet: true,
      name: 'test name',
      userId: user.id
    })

    expect(meal.id).toEqual(expect.any(String))
  })

  it('should not be able to creat a meal to a non existing user', async () => {
    await expect(() =>
      sut.execute({
        description: 'test description',
        hour: 1,
        isOnDiet: true,
        name: 'test name',
        userId: 'user-id-1'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})
