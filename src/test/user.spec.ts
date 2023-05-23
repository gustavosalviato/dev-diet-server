import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app'
import {execSync} from 'node:child_process'

beforeAll(async () => {
  execSync('npm run reset')
})


describe('transactions', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/user').send({
      name: 'johndoe',
      email: 'johndoe@gmail.com',
      avatar: 'https://github.com/johndoe.png'
    })


    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'johndoe',
        email: 'johndoe@gmail.com',
        avatar: 'https://github.com/johndoe.png'
      })
    )
  })
  

  it('should not be able to create a user with an existing email', async () => {
    const firstUser = await request(app.server).post('/user').send({
      name: 'johndoe2',
      email: 'johndoe2@gmail.com',
      avatar: 'https://github.com/johndoe.png'
    })


    const secondUser = await request(app.server).post('/user').send({
      name: 'John Doe',
      email: 'johndoe2@gmail.com',
      avatar: 'https://github.com/JohnDoe.png'
    })

    expect(secondUser.body).toEqual(
      expect.objectContaining({
        error: 'user already exists.'
      })
    )
  })
})
