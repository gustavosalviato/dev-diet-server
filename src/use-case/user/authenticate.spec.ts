import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/respositories/prisma/users/users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { InvalidCredentialsError } from '@/error/invalid-credential.error'

let usersRepository: UsersRepository
let sut: AuthenticateUseCase

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate user', async () => {
    await usersRepository.create({
      bestSequence: 0,
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
      name: 'John doe',
      sequenceCount: 0,
    })


    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John doe')
  })

  it('should not be able to authenticate an user that does not exists ', async () => {

    await expect(sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

  })


  it('should not be able to authenticate user with invalid credential', async () => {

    await usersRepository.create({
      bestSequence: 0,
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
      name: 'John doe',
      sequenceCount: 0,
    })

    await expect(sut.execute({
      email: 'johndoe@gmail.com',
      password: '66666'
    })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)

  })
})