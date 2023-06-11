import { FastifyInstance } from "fastify";
import { register } from "../controllers/resgister-user-controller";
import { createMeal } from "../controllers/create-meal.controller";
import { updateMeal } from "../controllers/update-meal.controller";

export async function AppRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/meals', createMeal)
  app.put('/meals/:id', updateMeal)
}