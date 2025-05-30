import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { dateString } from '../shared-logic/helpers'
import { taskSchema } from '../shared-logic/task'
import { handleGet } from './api'

const tasksSchema = z.object({
  Items: z.array(taskSchema),
})

export const useQueryTasksTop = () => {
  const date = dateString(new Date())
  return useQuery({
    queryKey: ['tasks', 'top', date],
    queryFn: async () =>
      tasksSchema.parse(
        await handleGet({
          path: '/tasks/top',
          queryParams: { date },
        })
      ).Items,
  })
}
