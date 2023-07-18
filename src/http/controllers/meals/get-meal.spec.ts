import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Get Meal', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to get a meal', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const createdMeal = await prisma.meal.create({
      data: {
        createdAt: new Date(),
        description: 'some descritption',
        hour: '12:30',
        isOnDiet: true,
        name: 'Meal 01',
        userId: user.id
      }
    })

    const response = await request(app.server)
      .get(`/meals/user/${createdMeal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.meal).toEqual(expect.objectContaining({
      name: 'Meal 01',
      description: 'some descritption',
    }))
  })

})