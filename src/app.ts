import fastify from "fastify"
import { userRoutes } from "./routes/userRoutes"

export const app = fastify()

app.register(userRoutes)