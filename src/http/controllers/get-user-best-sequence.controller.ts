import { ResourceNotFoundError } from '@/error/resource-not-found-error'
import { PrismaMealsRepository } from '@/respositories/prisma/meals/prisma-meals-repository'
import { PrismaUsersRepository } from '@/respositories/prisma/users/prisma-users-repository'
import { ListMealsByUserUseCase } from '@/use-case/meal/list-meals-by-user'
import { getUserBestSequence } from '@/utils/get-user-best-sequence'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function listUserBestSequence(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string()
  })

  const { id } = paramsSchema.parse(request.params)

  try {
    const usersRepository = new PrismaUsersRepository()
    const mealsRepository = new PrismaMealsRepository()
    const listMealsByUser = new ListMealsByUserUseCase(mealsRepository, usersRepository)

    const meals = await listMealsByUser.execute({
      userId: id
    })

    const result = getUserBestSequence(meals)

    return reply.send({ result })

  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}