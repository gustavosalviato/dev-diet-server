import { z } from 'zod'
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { makeRegisterUserUseCase } from "@/use-case/factories/make-register-user-use-case";
import { UserAlreadyExistsError } from "@/error/user-already-exists.error";


export async function register(request: FastifyRequest, response: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  })


  const { email, name, password } = registerBodySchema.parse(request.body)


  try {
    const registerUseCase = makeRegisterUserUseCase()

    await registerUseCase.execute({
      email,
      name,
      password
    })

    return response.status(201).send()

  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return response.status(400).send({
        message: err.message
      })
    }
  }

}