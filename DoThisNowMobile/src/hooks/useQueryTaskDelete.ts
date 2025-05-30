import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task } from '../shared-logic/task'
import { handlePost } from './api'

export const useQueryTaskDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: Task) => {
      await handlePost({
        path: '/tasks/delete',
        body: { title: task.title },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
