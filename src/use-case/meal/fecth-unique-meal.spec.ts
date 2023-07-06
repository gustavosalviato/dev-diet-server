import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMealsRepository } from "@/respositories/in-memory/in-memory-meals.repository";
import { InMemoryUsersRepository } from "@/respositories/in-memory/in-memory-users-repository";

import { FetchUniqueMealUseCase } from "./fetch-unique-meal";
import { ResourceNotFoundError } from "@/error/resource-not-found-error";


let mealsRepository: InMemoryMealsRepository
let userRepository: InMemoryUsersRepository
let sut: FetchUniqueMealUseCase
describe('Fetch unique meal', () => {
  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository()
    userRepository = new InMemoryUsersRepository()

    sut = new FetchUniqueMealUseCase(mealsRepository)

    userRepository.users.push({
      id: 'user-id-1',
      avatar: '',
      createdAt: new Date(),
      email: '',
      githubId: null,
      name: '',
      sequenceCount: 0,
      bestSequence: 0
    })

    mealsRepository.meals.push({
      id: 'meal-id-1',
      createdAt: new Date(),
      description: '',
      hour: '1',
      isOnDiet: true,
      name: 'meal 1',
      userId: 'user-id-1',
    })

    mealsRepository.meals.push({
      id: 'meal-id-2',
      createdAt: new Date(),
      description: '',
      hour: '1',
      isOnDiet: false,
      name: 'meal 2',
      userId: 'user-id-1',
    })
  })

  it('should be able to fetch an unique meal', async () => {
    const { meal } = await sut.execute({
      mealId: 'meal-id-1'
    })
    expect(meal.name).toEqual('meal 1')
  })

  it('should not be able to fecth a meal if meal does not exists', async () => {
    await expect(() =>
      sut.execute({
        mealId: 'meal-id-10'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})