import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { metrics } from "./metrics";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { profile } from "./profile";
import { refresh } from "./refresh";


export async function userRoutes(app: FastifyInstance) {
  app.post('/register', register)
  app.post('/sessions', authenticate)
  app.get('/user/metrics', { onRequest: [verifyJWT] }, metrics)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.patch('/token/refresh', refresh)

}