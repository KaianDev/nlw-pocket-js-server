import z from "zod"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

import { createGoalCompletion } from "../../functions/create-goal-completion"

export const CreateGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
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
}
