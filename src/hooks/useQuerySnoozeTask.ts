import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { dateString, newSafeDate } from '../shared-logic/helpers'
import { sortTasks } from '../shared-logic/task-sorting'
import { Task } from '../types/task'
import { handlePost } from './api'

export const useQuerySnoozeTask = () => {
  const date = dateString(new Date())
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      task: { title },
      allSubtasks = false,
      subtask,
    }: {
      task: Task
      allSubtasks?: boolean
      subtask?: string
    }) => {
      return z.object({}).parse(
        await handlePost({
          path: '/tasks/snooze',
          body: {
            title,
            allSubtasks,
            subtask,
          },
        })
      )
    },

    /*
     * This was based on this article: https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
     * I love react query
     */
    onMutate: async ({
      task: { title },
      allSubtasks = false,
    }: {
      task: Task
      allSubtasks?: boolean
    }) => {
      console.log({ title, allSubtasks })

      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['tasks', 'top', date] })

      // Snapshot the previous value
      const previousTopTasks = queryClient.getQueryData(['tasks', 'top', date])

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['tasks', 'top', date],
        (old: Task[] | undefined) => {
          console.log(old)
          if (!old) return old

          const index = old.findIndex(t => t.title === title)

          if (index === -1) return old

          const task = old[index]

          // has subtasks that can be snoozed
          if (
            !allSubtasks &&
            'subtasks' in task &&
            task.subtasks.some(
              st =>
                !st.done &&
                (!('snooze' in st) ||
                  st.snooze === undefined ||
                  new Date(st.snooze) <= new Date())
            )
          ) {
            const subtask = task.subtasks.find(
              st =>
                !st.done &&
                (!('snooze' in st) ||
                  st.snooze === undefined ||
                  new Date(st.snooze) <= new Date())
            )
            if (!subtask) return old
            subtask.snooze = new Date(
              new Date().getTime() + 60 * 60 * 1000
            ).toISOString()
            // resort tasks
            sortTasks(old, newSafeDate(date))
            return old
          }

          // need to snooze whole task
          task.snooze = new Date(
            new Date().getTime() + 60 * 60 * 1000
          ).toISOString()
          // resort tasks
          sortTasks(old, newSafeDate(date))
          console.log(old.map(t => t.title))
          return old
        }
      )

      // Return a context object with the snapshotted value
      return { previousTopTasks }
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_, __, context) =>
      queryClient.setQueryData(
        ['tasks', 'top', date],
        context?.previousTopTasks
      ),

    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['tasks', 'top', date] }),
  })
}
