import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { FastifyInstance } from "fastify"
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      bestSequence: 0,
      sequenceCount: 0,
    }
  })

  await request(app.server)
    .post('/register')
    .send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'johndoe@example.com',
      password: '123456'
    })

  const { token } = authResponse.body

  return {
    token
  }
}