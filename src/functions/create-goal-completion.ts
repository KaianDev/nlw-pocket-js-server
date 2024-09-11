import dayjs from "dayjs"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import { and, gte, lte, count, eq, sql } from "drizzle-orm"

interface CreateGoalCompletion {
  goalId: string
}

export const createGoalCompletion = async ({
  goalId,
}: CreateGoalCompletion) => {
  const firstDayOfWeek = dayjs().startOf("week").toDate()
  const lastDayOfWeek = dayjs().endOf("week").toDate()

  const goalCompletionCounts = db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.goalId).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const results = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql/*sql*/ `
        COALESCE(${goalCompletionCounts.completionCount},0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = results[0]

  if (completionCount > desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!")
  }

  const insertResults = await db.insert(goalCompletions).values({
    goalId,
  })

  const goalCompletion = insertResults[0]

  return {
    goalCompletion,
  }
}
