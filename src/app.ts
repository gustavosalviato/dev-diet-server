import 'dotenv/config'
import fastify from "fastify"
import cookies from '@fastify/cookie'
import jwt from '@fastify/jwt'

import { mealRoutes } from "./routes/mealRoutes"
import { authRoutes } from './routes/authRoutes'
export const app = fastify()

app.register(cookies)
app.register(jwt, {
  secret: 'daily-diet'
})

app.register(authRoutes)
app.register(mealRoutes)