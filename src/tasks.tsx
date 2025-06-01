import {
  faArrowDown,
  faCheckCircle,
  faHome,
  faPen,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Fragment, MutableRefObject, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from './components/button'
import Hints from './components/hints'
import { Loading } from './components/loading'
import Progress from './components/progress'
import { TaskBox } from './components/taskbox'
import useDing from './hooks/useDing'
import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasks } from './hooks/useQueryTasks'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import { newSafeDate } from './shared-logic/helpers'

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState(0)
  const [sort, setSort] = useState<'CHRON' | 'TOP'>('CHRON')
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const ding = useDing()
  const navigate = useLocation()[1]
  const queryClient = useQueryClient()

  const { data, isFetching } = useQueryTasks()
  const { data: dataTop, isFetching: isFetchingTop } = useQueryTasksTop()

  const tasks = (sort === 'CHRON' ? data?.Items : dataTop) ?? []

  const doneMutation = useQueryTaskDone()
  const deleteMutation = useQueryTaskDelete()

  const completeTask = () => {
    ding()
    doneMutation.mutate(tasks[selectedTask])
  }

  const scrollIntoView = (elem: HTMLElement) => {
    window.scrollTo({
      behavior: 'smooth',
      top:
        elem.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        200,
    })
  }

  const keyActions: KeyAction[] = [
    {
      key: 'd',
      description: 'Mark task as done',
      action: completeTask,
    },
    {
      key: 'n',
      description: 'New task',
      action: () => navigate('/new-task'),
    },
    {
      key: 'o',
      description: 'Toggle order between date and top',
      action: () => setSort(s => (s === 'CHRON' ? 'TOP' : 'CHRON')),
    },
    {
      key: 'u',
      description: 'Update task',
      action: () => {
        if (!tasks[selectedTask]) return
        queryClient.setQueryData(
          ['tasks', 'get', tasks[selectedTask].title],
          tasks[selectedTask]
        )
        navigate(
          `/update-task/${encodeURIComponent(tasks[selectedTask].title)}`
        )
      },
    },
    {
      key: 'up',
      description: 'Select previous task',
      action: () => {
        setSelectedTask(Math.max(selectedTask - 1, 0))
        scrollIntoView(taskElems.current[selectedTask - 1])
      },
    },
    {
      key: 'down',
      description: 'Select next task',
      action: () => {
        setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1))
        scrollIntoView(taskElems.current[selectedTask + 1])
      },
    },
    {
      key: 'Escape',
      description: 'Home',
      action: () => navigate('/'),
    },
    {
      key: 'Backspace',
      description: 'Delete current task',
      action: () =>
        window.confirm(
          `Are you sure you want to delete '${tasks[selectedTask].title}'?`
        ) && deleteMutation.mutate(tasks[selectedTask]),
    },
  ]
  useKeyAction(keyActions)

  const formatDate = (date: Date) => {
    try {
      return format(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          0,
          0,
          0
        ),
        'EEEE, LLLL do, u'
      )
    } catch (e) {
      console.error(e)
      return date.toDateString()
    }
  }

  if (sort === 'CHRON')
    tasks.sort((a: (typeof tasks)[number], b: (typeof tasks)[number]) =>
      a.due === 'No Due Date'
        ? -1
        : b.due === 'No Due Date'
        ? 1
        : newSafeDate(a.due).getTime() - newSafeDate(b.due).getTime()
    )

  const firstTaskDueAfterToday = tasks.findIndex(
    (task: (typeof tasks)[number]) => newSafeDate(task.due) > new Date()
  )
  const firstSnoozedTask = tasks.findIndex(
    (task: (typeof tasks)[number]) =>
      task.snooze && new Date(task.snooze) > new Date()
  )

  return (
    <div className='flex h-screen flex-col'>
      <div className='flex flex-col gap-4 py-4'>
        <Progress />
        <div className='flex flex-row flex-wrap justify-center'>
          <Button onClick={() => navigate('/')} icon={faHome} text='Home' />
          <Button
            onClick={() => navigate('/new-task')}
            icon={faPlusCircle}
            text='New Task'
          />
          <Button
            onClick={() => setSort(s => (s === 'CHRON' ? 'TOP' : 'CHRON'))}
            icon={faArrowDown}
            text='Toggle Order'
          />
        </div>
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='mx-5 flex flex-col items-center gap-1'>
          {sort === 'CHRON' ? (
            Object.entries(
              tasks.reduce((groups, task) => {
                const date = formatDate(newSafeDate(task.due))
                if (!groups[date]) {
                  groups[date] = []
                }
                groups[date].push(task)
                return groups
              }, {} as Record<string, typeof tasks>)
            ).map(([date, dateTasks]) => (
              <div key={date} className='flex w-full flex-col items-center'>
                <div
                  className={
                    (newSafeDate(dateTasks[0].due) <
                    new Date(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate(),
                      0,
                      0,
                      0
                    )
                      ? 'text-orange-300'
                      : 'text-white') +
                    ' sticky top-0 w-full bg-black py-2 text-center text-sm md:max-w-sm'
                  }>
                  {newSafeDate(dateTasks[0].due).toDateString()}
                </div>
                <div className='flex w-full flex-col items-center gap-1'>
                  {dateTasks.map(task => (
                    <Fragment key={task.title}>
                      <TaskBox
                        innerRef={(e: HTMLButtonElement) =>
                          (taskElems.current[tasks.indexOf(task)] = e)
                        }
                        isSelected={tasks.indexOf(task) === selectedTask}
                        onClick={() => setSelectedTask(tasks.indexOf(task))}
                        task={task}
                      />
                      {tasks.indexOf(task) === selectedTask && (
                        <div className='flex flex-row flex-wrap justify-center py-2'>
                          {[
                            {
                              text: 'Complete',
                              icon: faCheckCircle,
                              onClick: completeTask,
                              loading:
                                doneMutation.isPending &&
                                doneMutation.variables === task,
                            },
                            {
                              text: 'Update',
                              icon: faPen,
                              onClick: () =>
                                navigate(
                                  `/update-task/${encodeURIComponent(
                                    task.title
                                  )}`
                                ),
                            },
                            {
                              text: 'Delete',
                              icon: faTrash,
                              onClick: () =>
                                window.confirm(
                                  `Are you sure you want to delete '${task.title}'?`
                                ) && deleteMutation.mutate(task),
                              loading:
                                deleteMutation.isPending &&
                                deleteMutation.variables === task,
                            },
                          ].map(props => (
                            <Button key={props.text} {...props} />
                          ))}
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              {tasks.map((task: (typeof tasks)[number], i: number) => (
                <Fragment key={task.title}>
                  {i === firstTaskDueAfterToday && (
                    <div className='sticky top-0 w-full bg-black py-2 text-center text-sm text-white md:max-w-sm'>
                      Due after today
                    </div>
                  )}
                  {i === firstSnoozedTask && (
                    <div className='sticky top-0 w-full bg-black py-2 text-center text-sm text-white md:max-w-sm'>
                      Snoozed
                    </div>
                  )}
                  <TaskBox
                    innerRef={(e: HTMLButtonElement) =>
                      (taskElems.current[i] = e)
                    }
                    isSelected={i === selectedTask}
                    onClick={() => setSelectedTask(i)}
                    task={task}
                  />
                  {i === selectedTask && (
                    <div className='flex flex-row flex-wrap justify-center py-2'>
                      {[
                        {
                          text: 'Complete',
                          icon: faCheckCircle,
                          onClick: completeTask,
                          loading:
                            doneMutation.isPending &&
                            doneMutation.variables === task,
                        },
                        {
                          text: 'Update',
                          icon: faPen,
                          onClick: () =>
                            navigate(
                              `/update-task/${encodeURIComponent(task.title)}`
                            ),
                        },
                        {
                          text: 'Delete',
                          icon: faTrash,
                          onClick: () =>
                            window.confirm(
                              `Are you sure you want to delete '${task.title}'?`
                            ) && deleteMutation.mutate(task),
                          loading:
                            deleteMutation.isPending &&
                            deleteMutation.variables === task,
                        },
                      ].map(props => (
                        <Button key={props.text} {...props} />
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}
            </>
          )}
          {((sort === 'CHRON' && isFetching) ||
            (sort === 'TOP' && isFetchingTop)) && <Loading />}
        </div>
        <Hints keyActions={keyActions} />
      </div>
    </div>
  )
}

export default Tasks
