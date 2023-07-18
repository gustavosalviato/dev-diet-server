import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { create } from "./create";
import { update } from "./update";
import { deleteMeal } from "./delete";
import { list } from "./list";
import { getMeal } from "./get-meal";


export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/meals', list)
  app.get('/meals/user/:mealId', getMeal)

  app.post('/meals', create)
  app.put('/meals/:mealId', update)
  app.delete('/meals/:id', deleteMeal)
}