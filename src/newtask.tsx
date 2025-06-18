import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button } from './components/button'
import { Loading } from './components/loading'
import TaskForm from './components/taskform'
import { useQueryNewTask } from './hooks/useQueryNewTask'
import { Task, TaskInput } from './types/task'

const NewTask = () => {
  const { error, isPending, mutate } = useQueryNewTask()

  return (
    <div className='space-y-8 divide-y divide-gray-700 p-10 text-white'>
      {isPending && (
        <div className='fixed bottom-0 left-0 right-0 top-0 flex h-screen flex-col justify-center bg-gray-800 opacity-90'>
          <Loading />
        </div>
      )}
      <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
        <div>
          <div className='flex'>
            <Button onClick={() => window.history.back()} icon={faArrowLeft} />
            <h3 className='ml-2 pt-1 text-lg font-medium'>New Task</h3>
          </div>
          {!!error && <div className='mt-4 text-red-500'></div>}
          <TaskForm
            errorMessage={
              error !== null
                ? typeof error === 'object' &&
                  'response' in error &&
                  typeof error.response === 'object' &&
                  !!error.response &&
                  'data' in error.response &&
                  typeof error.response.data === 'string'
                  ? error.response.data
                  : 'Something went wrong, please try again later.'
                : undefined
            }
            submitForm={(input: TaskInput) => {
              if (input.title === '') alert('Add a title dumbass.')
              const task: Task = {
                ...input,
                due: `${input.dueYear}-${input.dueMonth}-${input.dueDay}`,
              }
              mutate(task, {
                onSuccess: () => window.history.back(),
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default NewTask
