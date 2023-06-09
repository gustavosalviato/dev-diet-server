import { UserAlreadyExistsError } from '@/error/user-already-exists.error'
import { makeRegisterUserUseCase } from '@/use-case/factories/make-register-user-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    email: z.string().email(),
    name: z.string()
  })

  const { email, name } = bodySchema.parse(request.body)
  try {
    const registerUserUseCase = makeRegisterUserUseCase()

    await registerUserUseCase.execute({
      email,
      name
    })

  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}