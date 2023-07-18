import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('List meals', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to list meals', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meal 01',
        description: 'Meal description',
        createdAt: new Date().toISOString(),
        hour: '12:30',
        isOnDiet: 'true',
      })

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meal 02',
        description: 'Meal description',
        createdAt: new Date().toISOString(),
        hour: '12:30',
        isOnDiet: 'true',
      })

    const response = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.meals).toEqual([
      expect.objectContaining({
        name: 'Meal 01'
      }),
      expect.objectContaining({
        name: 'Meal 02'
      })
    ])
    expect(response.body.meals).toHaveLength(2)
  })

})