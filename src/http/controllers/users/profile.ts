import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { makeUserProfile } from '@/use-case/factories/make-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {

  try {

    const userProfileUseCase = makeUserProfile()

    const { user } = await userProfileUseCase.execute({
      userId: request.user.sub
    })

    return reply.status(200).send({ user })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}