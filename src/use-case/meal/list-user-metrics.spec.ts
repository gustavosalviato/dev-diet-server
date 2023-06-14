import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMealsRepository } from "@/respositories/in-memory/in-memory-meals.repository";
import { InMemoryUsersRepository } from "@/respositories/in-memory/in-memory-users-repository";
import { ListUserMetricsUseCase } from "./list-user-metrics";
import { ResourceNotFoundError } from "@/error/resource-not-found-error";


let mealsRepository: InMemoryMealsRepository
let userRepository: InMemoryUsersRepository
let sut: ListUserMetricsUseCase
describe('List user metrics', () => {
  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository()
    userRepository = new InMemoryUsersRepository()
    sut = new ListUserMetricsUseCase(mealsRepository, userRepository)


    userRepository.users.push({
      id: 'user-id-1',
      avatar: '',
      createdAt: new Date(),
      email: '',
      githubId: null,
      name: '',
      sequenceCount: 0,
    })

    mealsRepository.meals.push({
      id: 'meal-id-1',
      createdAt: new Date(),
      description: '',
      hour: 1,
      isOnDiet: true,
      name: '',
      userId: 'user-id-1',
    })

    mealsRepository.meals.push({
      id: 'meal-id-1',
      createdAt: new Date(),
      description: '',
      hour: 1,
      isOnDiet: false,
      name: '',
      userId: 'user-id-1',
    })
  })

  it('should be able to list user metrics', async () => {
    const { metrics } = await sut.execute({
      userId: 'user-id-1'
    })

    expect(metrics.totalMeals).toEqual(2)
    expect(metrics.totalMealOffDiet).toEqual(1)
    expect(metrics.totalMealOnDiet).toEqual(1)
  })

  it('should not be able to list user metrics if user does not exists', async () => {
    await expect(() => 
      sut.execute({
        userId: 'non-existing-user'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})