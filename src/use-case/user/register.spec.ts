import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from '../user/register'
import { InMemoryUsersRepository } from '@/respositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/respositories/prisma/users/users-repository'
import { UserAlreadyExistsError } from '@/error/user-already-exists.error'

let usersRepository: UsersRepository
let sut: RegisterUserUseCase

describe('Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      name: 'John doe',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register a user with the same e-mail', async () => {
    const email = 'example@gmail.com'

    await sut.execute({
      email,
      name: 'John doe',
      password: '123456'
    })

    await expect(sut.execute({
      email,
      name: 'John doe',
      password: '123456'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})