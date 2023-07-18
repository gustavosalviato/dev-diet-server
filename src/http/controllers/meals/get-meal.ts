import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { MakeFetchUniqueMeal } from '@/use-case/factories/make-fecth-unique-meal'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'


export async function getMeal(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    mealId: z.string()
  })

  const { mealId } = paramsSchema.parse(request.params)

  try {

    const fecthUniqueMeal = MakeFetchUniqueMeal()

    const { meal } = await fecthUniqueMeal.execute({
      mealId
    })

    return reply.send({ meal  })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}