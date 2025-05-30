import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task } from '../shared-logic/task'
import { handlePost } from './api'

type SnoozeTaskInput = {
  task: Task
  allSubtasks?: boolean
}

export const useQuerySnoozeTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ task, allSubtasks }: SnoozeTaskInput) => {
      await handlePost({
        path: '/tasks/snooze',
        body: { title: task.title, allSubtasks },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
