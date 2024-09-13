import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import cors from "@fastify/cors"

import { createGoalRoute } from "./routes/create-goal"
import { CreateGoalCompletionRoute } from "./routes/create-goal-completion"
import { getWeekPendingGoalsRoute } from "./routes/get-week-pending-goals"
import { getWeeklyGoalsSummaryRoute } from "./routes/get-weekly-goals-summary"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(cors, {
  origin: "*",
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(createGoalRoute)
app.register(CreateGoalCompletionRoute)
app.register(getWeekPendingGoalsRoute)
app.register(getWeeklyGoalsSummaryRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP Server running")
    console.log("🔗 http://localhost:3333")
  })
