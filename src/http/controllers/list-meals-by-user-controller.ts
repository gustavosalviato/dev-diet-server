import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeListMealsByUserUseCase } from '@/use-case/factories/make-list-meals-by-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listMealsByUser(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    id: z.string()
  })

  const { id } = bodySchema.parse(request.params)

  try {

    const listMealsByUser = makeListMealsByUserUseCase()

    const meals = await listMealsByUser.execute({
      userId: id
    })

    return reply.status(200).send({
      meals
    })


  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}