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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 100 * 60 * 60 * 24 * 7 //7 days
      })
    }

    await prisma.meal.create({
      data: {
        createdAt,
        description,
        hour: hourInSeconds,
        isOnDiet,
        name,
        userId: '88a9c854-a6ce-47cf-97ec-f5ee39b4f56e'
      }
    })
  })

  app.put('/meal/:id', async (request) => {
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
        userId: '88a9c854-a6ce-47cf-97ec-f5ee39b4f56e'
      }
    })

  })

  app.delete('/meal/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.meal.delete({
      where: {
        id
      }
    })

    return reply.status(204).send()
  })

  app.get('/meal', async (request, reply) => {
    const meals = await prisma.meal.findMany()

    return reply.send({
      meals
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

    return reply.send({
      meal
    })
  })
}