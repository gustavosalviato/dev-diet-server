import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { PrismaMealsRepository } from '@/respositories/prisma/meals/prisma-meals-repository'
import { DeleteMealUseCase } from '@/use-case/meal/delete-meal'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    mealId: z.string()
  })

  const { mealId } = paramsSchema.parse(request.params)

  try {
    const mealsRepository = new PrismaMealsRepository()
    const deleteMealUseCase = new DeleteMealUseCase(mealsRepository)

    await deleteMealUseCase.execute({
      mealId
    })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(204).send()
}