import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create meal', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to create a meal', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meal 01',
        description: 'Meal description',
        createdAt: new Date().toISOString(),
        hour: '12:30',
        isOnDiet: 'true',
      })

    expect(response.statusCode).toEqual(201)

  })

})