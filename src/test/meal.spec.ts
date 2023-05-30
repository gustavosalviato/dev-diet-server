import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { faker } from '@faker-js/faker'
import { app } from '../app'
import request from 'supertest'
import { prisma } from '../lib/prisma'

const userId = '5e8b4e1b-5bae-434d-a209-a89d024bcf72'
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VzdGF2byBIZW5yaXF1ZSIsImF2YXRhclVybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS83NTc2Mjk3Nj92PTQiLCJzdWIiOiI3Yzg0MDNiMy1kZGQ0LTRjYTAtYWZjYS0yOGI2ODA1MzkxNzQiLCJpYXQiOjE2ODU0NDk2OTgsImV4cCI6MTY4ODA0MTY5OH0.WGu7yOX2HORdfRd-qRUP-QQCTSNFw4tLNtvxdxnnuq8"

beforeAll(async () => {
  app.ready()

  await prisma.$queryRaw`
    DELETE FROM meal
  `
})

afterAll(async () => {
  app.close()
})

describe('Meal', () => {
  it('should be able to create a meal', async () => {
    const name = faker.commerce.productName()
    const createdAt = faker.date.birthdate()
    const description = faker.lorem.paragraph()

    const response = await request(app.server).post('/meal').send({
      name,
      createdAt,
      description,
      hour: '15:00',
      isOnDiet: 'true',
      userId,
    }).set('Authorization', `Bearer ${token}`)

    expect(response.body).toEqual(
      expect.objectContaining({
        name,
        description,
        createdAt: createdAt.toISOString()
      })
    )
  })

  it('should not be able to create a new meal without token authorization', async () => {
    const response = await request(app.server).post('/meal').send({
      name: faker.commerce.productName(),
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      hour: '15:00',
      isOnDiet: 'true',
    })

    expect(response.body).toEqual(
      expect.objectContaining({
        error: 'Unauthorized',
        statusCode: 401
      })
    )
  })

  it('should be able to update a meal', async () => {
    const response = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'false',
    }).set('Authorization', `Bearer ${token}`)

    await request(app.server).put(`/meal/${response.body.id}`).send({
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.birthdate(),
      isOnDiet: "true",
      hour: "12:00"
    }).set('Authorization', `Bearer ${token}`).expect(204)

  })

  it('should be able to delete a meal', async () => {
    const response = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'false',
    }).set('Authorization', `Bearer ${token}`)


    await request(app.server).delete(`/meal/${response.body.id}`).set('Authorization', `Bearer ${token}`).expect(204)
  })


  it('should be able to list all meals', async () => {
    const name = faker.commerce.productName()
    const createdAt = faker.date.birthdate()
    const description = faker.lorem.paragraph()

    const response = await request(app.server).post('/meal').send({
      name: 'testname1',
      createdAt,
      description,
      hour: '21:00',
      isOnDiet: 'false',
    }).set('Authorization', `Bearer ${token}`)


    const getMealsResponse = await request(app.server).get('/meals').set('Authorization', `Bearer ${token}`)

    expect(getMealsResponse.body.meals).toBeTruthy()
  })

  it('should be able to list an unique meal', async () => {
    const response = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'false',
    }).set('Authorization', `Bearer ${token}`)

    const getMealResponse = await request(app.server).get(`/meal/${response.body.id}`).set('Authorization', `Bearer ${token}`)

    expect(getMealResponse.body.id).toEqual(response.body.id)
  })


  it('should be able to list total of meals registered', async () => {
    const response = await request(app.server).get('/meals/count').set('Authorization', `Bearer ${token}`)


    expect(response.body.totalMeals).toBeTruthy()
  })

  it('should be able to list average of meals registered', async () => {
    const firstMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: true,
    }).set('Authorization', `Bearer ${token}`)

    const secondMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: false,
    }).set('Authorization', `Bearer ${token}`)


    const response = await request(app.server).get('/meals/average').set('Authorization', `Bearer ${token}`)

    expect(response.body.onMeals).toBeTruthy()
    expect(response.body.offMeals).toBeTruthy()
  })

})