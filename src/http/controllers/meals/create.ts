import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { MakeCreateMealUseCase } from '@/use-case/factories/make-create-meal-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    createdAt: z.string().datetime(),
    hour: z.string(),
    isOnDiet: z.coerce.boolean(),
    userId: z.string().uuid()
  })

  const { createdAt, description, hour, isOnDiet, name, userId } = bodySchema.parse(request.body)
  try {

    const createMealUseCase = MakeCreateMealUseCase()

    await createMealUseCase.execute({
      description,
      hour,
      isOnDiet,
      name,
      userId,
      createdAt: new Date(createdAt)
    })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}