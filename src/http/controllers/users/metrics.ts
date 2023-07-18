import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeListUserMetrics } from '@/use-case/factories/make-list-user-metrics'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

  try {

    const listUseMetrics = makeListUserMetrics()

    const { metrics } = await listUseMetrics.execute(
      {
        userId: request.user.sub
      })

    return reply.status(200).send(
      { metrics }
    )

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}