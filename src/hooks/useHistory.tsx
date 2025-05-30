import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { dateString } from '../shared-logic/helpers'
import { dynamoDBTaskSchema as taskSchema } from '../shared-logic/task'
import { handleGet } from './api'

const historySchema = z.object({
  date: z.object({ S: z.string() }),
  tasks: z.object({
    L: z.array(
      z.object({
        M: taskSchema,
      })
    ),
  }),
})

export const useHistory = (daysAgo: number = 0) => {
  // daysAgo is 0 for today, 1 for yesterday, etc.
  const date = dateString(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - daysAgo
    )
  )
  return useQuery({
    queryKey: ['tasks', 'history', date],
    queryFn: async () =>
      historySchema.parse(await handleGet({ path: `/tasks/history/${date}` })),
  })
}
