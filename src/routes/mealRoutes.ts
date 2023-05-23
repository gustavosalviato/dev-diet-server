import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import moment from "moment";
import { randomUUID } from 'node:crypto'

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

    await prisma.meal.create({
      data: {
        createdAt,
        description,
        hour: hourInSeconds,
        isOnDiet,
        name,
        userId: request.user.sub
      }
    })
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

  app.get('/meal', async (request, reply) => {
    const meals = await prisma.meal.findMany({
      where: {
        userId: request.user.sub
      }
    })

    return meals.map((meal) => {
      return {
        id: meal.id,
        name: meal.name,
        description: meal.description,
        createdAt: meal.createdAt,
        hour: meal.hour,
        isOnDiet: meal.isOnDiet,
      }
    })
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
}