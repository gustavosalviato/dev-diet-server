import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeListUserMetrics } from '@/use-case/factories/make-list-user-metrics'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'


export async function ListUserMetrics(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string()
  })

  const { id } = paramsSchema.parse(request.params)

  try {

    const listUseMetrics = makeListUserMetrics()

    const { metrics } = await listUseMetrics.execute({ userId: id })

    return reply.send({ metrics })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}