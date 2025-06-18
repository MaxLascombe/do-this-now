import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from './components/button'
import { Loading } from './components/loading'
import TaskForm from './components/taskform'
import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryUpdateTask } from './hooks/useQueryUpdateTask'
import { newSafeDate } from './shared-logic/helpers'
import { SubTask, Task, TaskInput } from './types/task'

const UpdateTask = () => {
  const [location] = useLocation()

  const taskId = (() => {
    const path = location.split('/')
    let lastPathItem = path.pop()
    if (lastPathItem === '') lastPathItem = path.pop()
    if (lastPathItem === 'update-task') window.history.back()
    if (!lastPathItem) return ''
    return decodeURIComponent(lastPathItem)
  })()

  const { data, isFetching: isTaskLoading } = useQueryGetTask(taskId)
  const task = data ?? undefined

  const subtasksState = useState<SubTask[]>([])

  const updateTaskMutation = useQueryUpdateTask()

  return (
    <>
      {isTaskLoading || !task ? (
        <div className='absolute top-0 left-0 right-0 bottom-0 flex h-screen flex-col justify-center bg-gray-800 opacity-90'>
          <Loading />
        </div>
      ) : (
        <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
          <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
            <div>
              <div className='flex'>
                <Button
                  onClick={() => window.history.back()}
                  icon={faArrowLeft}
                />
                <h3 className='ml-2 pt-1 text-lg font-medium'>
                  Update Task: {taskId}
                </h3>
              </div>
              <TaskForm
                {...task}
                dueMonth={newSafeDate(task.due).getMonth() + 1}
                dueDay={newSafeDate(task.due).getDate()}
                dueYear={newSafeDate(task.due).getFullYear()}
                submitForm={(input: TaskInput) => {
                  const task: Task = {
                    ...input,
                    ...((subtasksState?.[0]?.length ?? 0) > 0
                      ? { subtasks: subtasksState[0] }
                      : {}),
                    ...(taskId !== input.title[0] ? { oldTitle: taskId } : {}),
                    due: `${input.dueYear}-${input.dueMonth}-${input.dueDay}`,
                  }
                  // @ts-expect-error - this should be fixed when i upgrade to v5
                  updateTaskMutation.mutate(task, {
                    onSuccess: () => window.history.back(),
                  })
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateTask
