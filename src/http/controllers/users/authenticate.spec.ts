import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Authenticate', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to authenticate', async () => {
    await request(app.server)
      .post('/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      })

    const authResponse = await request(app.server)
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456'
      })

    expect(authResponse.statusCode).toEqual(200)
    expect(authResponse.body).toEqual(expect.objectContaining({
      token: expect.any(String)
    }))
  })

})