import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { PrismaMealsRepository } from '@/respositories/prisma/meals/prisma-meals-repository'
import { UpdateMealUseCase } from '@/use-case/meal/update-meal'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {

  const paramsSchema = z.object({
    id: z.string()
  })

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    createdAt: z.string().datetime(),
    hour: z.string(),
    isOnDiet: z.coerce.boolean(),
  })

  const { createdAt, description, hour, isOnDiet, name } = bodySchema.parse(request.body)

  const { id } = paramsSchema.parse(request.params)
  try {
    const mealsRepository = new PrismaMealsRepository()
    const updateMealUseCase = new UpdateMealUseCase(mealsRepository)

    await updateMealUseCase.execute({
      createdAt,
      description,
      hour,
      isOnDiet,
      name,
      mealId: id
    })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}