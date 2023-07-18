import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateUseUseCase } from './update.user'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUseUseCase

describe('Update Meal', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUseUseCase(usersRepository)

    usersRepository.users.push({
      avatar: 'https://github.com/johndoe.png',
      createdAt: new Date(),
      email: 'johndoe@gmail.com',
      githubId: 1,
      id: 'user-id-1',
      name: 'john doe',
      sequenceCount: 0,
      bestSequence: 0,
      password_hash: '',
    })
  })

  it('should be able to update user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'name-1',
      sequenceCount: 1,
      userId: 'user-id-1'
    })

    expect(user.name).toEqual('name-1')
    expect(user.sequenceCount).toEqual(1)

  })

  it('should not be able to update a non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id',
        email: 'johndoe@gmail.com',
        name: 'name-1',
        sequenceCount: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
