import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { getWeeklyGoalsSummary } from "../../functions/get-weekly-goals-summary"

export const getWeeklyGoalsSummaryRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get("/summary", async () => {
    const { summary } = await getWeeklyGoalsSummary()
    return { summary }
  })
}
