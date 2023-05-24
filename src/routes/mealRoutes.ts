import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import moment from "moment";

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.post('/meal', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      createdAt: z.string().datetime(),
      hour: z.string(),
      isOnDiet: z.coerce.boolean(),
    })

    const { createdAt, description, hour, isOnDiet, name } = bodySchema.parse(request.body)

    const hourInSeconds = moment.duration(hour).asSeconds()

    const mealResponse = await prisma.meal.create({
      data: {
        createdAt,
        description,
        hour: hourInSeconds,
        isOnDiet,
        name,
        userId: request.user.sub
      }
    })

    let user = await prisma.user.findUnique({
      where: {
        id: request.user.sub
      }
    })

    user = await prisma.user.update({
      where: {
        id: request.user.sub
      },
      data: {
        sequenceCount: mealResponse.isOnDiet === true ? user?.sequenceCount! + 1 : 0
      }
    })

    const meal = {
      id: mealResponse.id,
      name: mealResponse.name,
      description: mealResponse.description,
      createdAt: mealResponse.createdAt,
      hour: mealResponse.hour,
      isOnDiet: mealResponse.isOnDiet
    }
    return reply.status(201).send(meal)
  })

  app.put('/meal/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      createdAt: z.string().datetime(),
      hour: z.string(),
      isOnDiet: z.coerce.boolean(),
    })

    const { createdAt, description, hour, isOnDiet, name } = bodySchema.parse(request.body)

    const hourInSeconds = moment.duration(hour).asSeconds()

    const { id } = paramsSchema.parse(request.params)

    let meal = await prisma.meal.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (meal.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    meal = await prisma.meal.update({
      where: {
        id
      },
      data: {
        name,
        createdAt,
        description,
        hour: hourInSeconds,
        isOnDiet,
      }
    })

    return reply.status(204).send()

  })

  app.delete('/meal/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const meal = await prisma.meal.findUnique({
      where: {
        id
      }
    })

    if (meal?.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.meal.delete({
      where: {
        id
      }
    })

    return reply.status(204).send()
  })

  app.get('/meals', async (request, reply) => {
    const mealsResponse = await prisma.meal.findMany({
      where: {
        userId: request.user.sub
      }
    })

    const meals = mealsResponse.map((meal) => {
      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        createdAt: meal.createdAt,
        hour: meal.hour,
        isOnDiet: meal.isOnDiet,
      }
    })

    return {
      meals
    }
  })

  app.get('/meal/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const meal = await prisma.meal.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (meal.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return reply.send(meal)
  })

  app.get('/meals/count', async (request, reply) => {
    const meals = await prisma.meal.findMany({
      where: {
        userId: request.user.sub
      }
    })

    const totalMeals = meals.length

    return reply.send({
      totalMeals
    })
  })

  app.get('/meals/average', async (request, reply) => {
    const allMeals = await prisma.meal.findMany({
      where: {
        userId: request.user.sub
      }
    })

    const onMeals = allMeals.filter((meal) => meal.isOnDiet === true).length
    const offMeals = allMeals.filter((meal) => meal.isOnDiet === false).length

    return reply.send({
      onMeals,
      offMeals
    })
  })

  app.get('/meals/sequence', async (request, reply) =>{
    const userResponse = await prisma.user.findUnique({
      where: {
        id: request.user.sub
      }
    })

    return reply.send({
      sequence : userResponse?.sequenceCount
    })
  })
}