import fastify from "fastify"
import { createGoal } from "../functions/create-goal"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import z from "zod"
import { getWeekPendingGoals } from "../functions/get-week-pending-goals"
import { createGoalCompletion } from "../functions/create-goal-completion"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (request) => {
    const { desiredWeeklyFrequency, title } = request.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app.post(
  "/completion",
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body

    const results = await createGoalCompletion({
      goalId,
    })

    return results
  }
)

app.get("/pending-goals", async () => {
  const { pendingGoals } = await getWeekPendingGoals()
  return { pendingGoals }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP Server running")
    console.log("🔗 http://localhost:3333")
  })
