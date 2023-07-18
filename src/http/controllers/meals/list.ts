import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeListMealsByUserUseCase } from '@/use-case/factories/make-list-meals-by-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  try {

    const listMealsByUser = makeListMealsByUserUseCase()

    const meals = await listMealsByUser.execute({
      userId: request.user.sub
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