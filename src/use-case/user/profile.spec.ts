import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/respositories/prisma/users/users-repository'
import { hash } from 'bcryptjs'
import { ProfileUseCase } from './profile'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'

let usersRepository: UsersRepository
let sut: ProfileUseCase

describe('User profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ProfileUseCase(usersRepository)
  })

  it('should be able to authenticate user', async () => {
    const userCreated = await usersRepository.create({
      bestSequence: 0,
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
      name: 'John doe',
      sequenceCount: 0,
    })


    const { user } = await sut.execute({
      userId: userCreated.id
    })

    expect(user).toMatchObject({
      name: 'John doe',
      email: 'johndoe@gmail.com',
    })
  })

  it('should not be able to get user profile if user does not exists', async () => {

    await expect(sut.execute({
      userId: 'non-exists-user-id'
    })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

  })
})