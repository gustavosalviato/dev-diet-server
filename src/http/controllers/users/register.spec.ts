import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Register', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to register', async () => { 
    const registerResponse = await request(app.server)
    .post('/register')
    .send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(registerResponse.statusCode).toEqual(201)
  })
  
})