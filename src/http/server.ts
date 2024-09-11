import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { createGoalRoute } from "./routes/create-goal"
import { CreateGoalCompletionRoute } from "./routes/create-goal-completion"
import { getWeekPendingGoalsRoute } from "./routes/get-week-pending-goals"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(createGoalRoute)
app.register(CreateGoalCompletionRoute)
app.register(getWeekPendingGoalsRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP Server running")
    console.log("🔗 http://localhost:3333")
  })
