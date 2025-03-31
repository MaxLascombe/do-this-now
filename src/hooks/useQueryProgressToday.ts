import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { dateString } from '../shared-logic/helpers'
import { handleGet } from './api'

const progressTodaySchema = z.object({
  done: z.number(),
  lives: z.number(),
  todo: z.number(),
  streak: z.number(),
  streakIsActive: z.boolean(),
})

const useQueryProgress = (date: ReturnType<typeof dateString>) =>
  useQuery(['tasks', 'progresstoday', date], async () =>
    progressTodaySchema.parse(
      await handleGet({ path: '/tasks/progresstoday', queryParams: { date } })
    )
  )

export const useQueryProgressToday = () => {
  const date = dateString(new Date())
  return useQueryProgress(date)
}

export const useQueryProgressTomorrow = () => {
  const date = dateString(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  return useQueryProgress(date)
}
