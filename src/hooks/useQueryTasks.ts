import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { handleGet } from './api'

// types
import { taskSchema } from '../types/task'

const tasksSchema = z.object({
  Items: z.array(taskSchema),
  Count: z.number(),
  ScannedCount: z.number(),
})

export const useQueryTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: async () => tasksSchema.parse(await handleGet({ path: '/tasks' })),
  })
