import { db } from "../db"
import { goals } from "../db/schema"

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export const createGoal = async ({
  desiredWeeklyFrequency,
  title,
}: CreateGoalRequest) => {
  const results = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const goal = results[0]

  return {
    goal,
  }
}
