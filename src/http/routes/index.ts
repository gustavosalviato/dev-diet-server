import { FastifyInstance } from "fastify";
import { register } from "../controllers/resgister-user-controller";

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
}