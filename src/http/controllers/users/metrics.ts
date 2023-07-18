import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeListUserMetrics } from '@/use-case/factories/make-list-user-metrics'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'


export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    userId: z.string().uuid()
  })

  const { userId } = paramsSchema.parse(request.params)

  try {

    const listUseMetrics = makeListUserMetrics()

    const { metrics } = await listUseMetrics.execute({ userId })

    return reply.send({ metrics })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}