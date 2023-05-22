import fastify from "fastify"
import { userRoutes } from "./routes/userRoutes"

const app = fastify()

app.register(userRoutes)

app.listen({
  port: 3333,
}).then(() => console.log('http server running 🤖'))