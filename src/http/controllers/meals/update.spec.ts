import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update Meal', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })


  it('should be able to update meal', async () => {
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
      .put(`/meals/${createdMeal.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Meal modified',
        description: 'description modified',
        createdAt: new Date().toISOString(),
        hour: '11:30',
        isOnDiet: '',
      })

    expect(response.statusCode).toEqual(204)


    const meal = await prisma.meal.findUnique({
      where: {
        id: createdMeal.id
      }
    })

    expect(meal?.name).toEqual('Meal modified')
    expect(meal?.description).toEqual('description modified')
  })

})