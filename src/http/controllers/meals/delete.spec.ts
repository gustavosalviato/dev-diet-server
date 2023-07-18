import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Delete meal', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to delete meal', async () => {
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
      .delete(`/meals/${createdMeal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })

})