import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { prisma } from '../lib/prisma'
import { faker } from '@faker-js/faker'

const userId = '7c8403b3-ddd4-4ca0-afca-28b680539174'
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

describe('User', async () => {
  it('should be able to increment sequenceCount when user do a meal on diet', async () => {
    const firstMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'true',
    }).set('Authorization', `Bearer ${token}`).expect(201)

    const secondMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'true',
    }).set('Authorization', `Bearer ${token}`).expect(201)


    const userResponse =
      await request(app.server).get(`/user/${userId}`).set('Authorization', `Bearer ${token}`)


    expect(userResponse.body.sequenceCount).toBeGreaterThanOrEqual(2)

  })

  it('should be able to update sequenceCount to zero when user do a meal off diet', async() => {
    const firstMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'true',
    }).set('Authorization', `Bearer ${token}`).expect(201)

    const secondMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: 'true',
    }).set('Authorization', `Bearer ${token}`).expect(201)

    const thirdMeal = await request(app.server).post('/meal').send({
      createdAt: faker.date.birthdate(),
      description: faker.lorem.paragraph(),
      name: faker.commerce.productName(),
      hour: '21:00',
      isOnDiet: '',
    }).set('Authorization', `Bearer ${token}`).expect(201)

    const userResponse =
      await request(app.server).get(`/user/${userId}`).set('Authorization', `Bearer ${token}`)

    expect(userResponse.body.sequenceCount).toEqual(0)
  })
})