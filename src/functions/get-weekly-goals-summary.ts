import dayjs from "dayjs"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import { and, eq, gte, lte, sql } from "drizzle-orm"

export const getWeeklyGoalsSummary = async () => {
  const firstDayOfWeek = dayjs().startOf("week").toDate()
  const lastDayOfWeek = dayjs().endOf("week").toDate()

  const goalsCreatedAtUpWeek = db.$with("goals_created_at_up_week").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletedThisWeek = db.$with("goals_completed_this_week").as(
    db
      .select({
        id: goalCompletions.id,
        title: goals.title,
        completedAt: goalCompletions.createdAt,
        completedAtDate: sql/*sql*/ `
          DATE(${goalCompletions.createdAt})
        `.as("completedAtDate"),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  )

  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db
      .select({
        completedAtDate: goalsCompletedThisWeek.completedAtDate,
        completions: sql/*sql*/ `
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedThisWeek.id},
              'title', ${goalsCompletedThisWeek.title},
              'completedAt', ${goalsCompletedThisWeek.completedAt}
            )
          )
        `.as("completions"),
      })
      .from(goalsCompletedThisWeek)
      .groupBy(goalsCompletedThisWeek.completedAtDate)
  )

  const results = await db
    .with(goalsCreatedAtUpWeek, goalsCompletedThisWeek, goalsCompletedByWeekDay)
    .select({
      totalCompletions:
        sql/*sql*/ `(SELECT COUNT(*) FROM ${goalsCompletedThisWeek})`
          .mapWith(Number)
          .as("totalCompletions"),
      totalDesiredFrequency: sql/*sql*/ `
        (SELECT SUM(${goalsCreatedAtUpWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedAtUpWeek})
      `
        .mapWith(Number)
        .as("totalDesiredFrequency"),
      completionsByDate: sql/*sql*/ `
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `.as("completionsByDate"),
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: results,
  }
}
