
import fastify from "fastify"
import cookies from '@fastify/cookie'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from '@/env'
import { AppRoutes } from "./http/routes"


export const app = fastify()

app.register(cookies)
app.register(jwt, {
  secret: 'daily-diet'
})

app.register(cors, {
  origin: true
})

app.register(AppRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() })
  }


  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({
    message: 'Internal server error.'
  })
})