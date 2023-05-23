import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url(),
    })

    const { avatar, email, name } = bodySchema.parse(request.body)

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userAlreadyExists) {
      return reply.status(400).send({ error: 'user already exists.' })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatar,
      }
    })

    return reply.status(201).send(user)
  })
}