import {
  faBackward,
  faBars,
  faBell,
  faCheckCircle,
  faPen,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { useLocation } from 'wouter'
import { Button } from './components/button'
import Hints from './components/hints'
import { LastUpdated } from './components/lastupdated'
import { Loading } from './components/loading'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'
import { TaskBox } from './components/taskbox'
import { handleSignOut } from './helpers/auth'
import useDing from './hooks/useDing'
import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { useQuerySnoozeTask } from './hooks/useQuerySnoozeTask'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import { Task } from './shared-logic/task'
import { isSnoozed } from './shared-logic/task-sorting'

const Home = () => {
  const navigate = useLocation()[1]
  const ding = useDing()
  const queryClient = useQueryClient()

  const topTasksQuery = useQueryTasksTop()

  const tasks = (topTasksQuery.data ?? []).filter(t => !isSnoozed(t))

  const [selectedTaskIndex, setSelectedTaskIndex] = useState<0 | 1 | 2>(0)
  const selectedTask = !tasks
    ? null
    : tasks.length > selectedTaskIndex
    ? tasks[selectedTaskIndex]
    : tasks[-1]

  if (tasks && tasks.length > 0 && tasks.length <= selectedTaskIndex)
    setSelectedTaskIndex(tasks.length === 2 ? 1 : 0)

  const doneMutation = useQueryTaskDone()
  const deleteMutation = useQueryTaskDelete()
  const snoozeMutation = useQuerySnoozeTask()

  const completeTask = () => {
    if (!selectedTask) return
    ding()
    doneMutation.mutate(selectedTask)
  }

  const snoozeTask = () => {
    if (!selectedTask) return
    snoozeMutation.mutate({ task: selectedTask })
  }

  const snoozeAllSubtasks = () => {
    if (!selectedTask) return
    snoozeMutation.mutate({ task: selectedTask, allSubtasks: true })
  }

  const deleteTask = () => {
    if (!selectedTask) return
    if (
      !window.confirm(
        `Are you sure you want to delete '${selectedTask.title}'?`
      )
    )
      return
    deleteMutation.mutate(selectedTask)
  }

  const keyActions: KeyAction[] = [
    {
      key: 'd',
      description: 'Task done',
      action: completeTask,
    },
    {
      key: 'h',
      description: 'History',
      action: () => navigate('/history'),
    },
    {
      key: 'l',
      description: 'Logout',
      action: handleSignOut,
    },
    {
      key: 'n',
      description: 'New task',
      action: () => navigate('/new-task'),
    },
    {
      key: 's',
      description: 'Snooze task',
      action: snoozeTask,
      shift: false,
    },
    {
      key: 'S',
      description: 'Snooze all subtasks',
      action: snoozeAllSubtasks,
      shift: true,
    },
    {
      key: 't',
      description: 'Tasks',
      action: () => navigate('/tasks'),
    },
    {
      key: 'u',
      description: 'Update task',
      action: () => {
        if (!selectedTask) return
        queryClient.setQueryData(
          ['tasks', 'get', selectedTask.title],
          selectedTask
        )
        navigate(`/update-task/${encodeURIComponent(selectedTask.title)}`)
      },
    },
    {
      key: '1',
      description: 'Select first task',
      action: () => setSelectedTaskIndex(0),
    },
    {
      key: '2',
      description: 'Select second task',
      action: () => setSelectedTaskIndex(1),
    },
    {
      key: '3',
      description: 'Select third task',
      action: () => setSelectedTaskIndex(2),
    },
    {
      key: 'up',
      description: 'Select previous task',
      action: () => {
        setSelectedTaskIndex(selectedTaskIndex === 2 ? 1 : 0)
      },
    },
    {
      key: 'down',
      description: 'Select next task',
      action: () => {
        setSelectedTaskIndex(selectedTaskIndex === 0 ? 1 : 2)
      },
    },
    {
      key: 'backspace',
      description: 'Delete current task',
      action: deleteTask,
    },
  ]
  useKeyAction(keyActions)

  type ButtonTuple = [
    () => void,
    string | undefined,
    typeof faBackward,
    boolean?
  ]
  const Buttons = () => {
    const info: ButtonTuple[] = [
      [
        completeTask,
        'Complete',
        faCheckCircle,
        doneMutation.isPending && doneMutation.variables === selectedTask,
      ],
      [snoozeTask, 'Snooze', faBell],
      [
        () =>
          selectedTask &&
          navigate(`/update-task/${encodeURIComponent(selectedTask.title)}`),
        undefined,
        faPen,
      ],
      [
        deleteTask,
        undefined,
        faTrash,
        deleteMutation.isPending && deleteMutation.variables === selectedTask,
      ],
    ]

    if (selectedTask && selectedTask.subtasks.length > 0)
      info.splice(2, 0, [snoozeAllSubtasks, 'Snooze all subtasks', faBell])

    return (
      <>
        {info.map(([func, text, icon, loading]) => (
          <Button
            key={func.name}
            onClick={func}
            text={text}
            icon={icon}
            loading={loading}
          />
        ))}
      </>
    )
  }

  return (
    <RequireAuth>
      <div className='flex h-screen flex-col items-center justify-center gap-2'>
        {topTasksQuery.isPending || deleteMutation.isPending ? (
          <Loading />
        ) : (
          <>
            <Progress />
            <div className='mx-5 mt-1 flex flex-row flex-wrap justify-center'>
              <Button
                onClick={() => navigate('/tasks')}
                text={'All tasks'}
                icon={faBars}
              />
              <Button
                onClick={() => navigate('/new-task')}
                text={'New task'}
                icon={faPlusCircle}
              />
              <Button
                onClick={() => navigate('/history')}
                text={'History'}
                icon={faBackward}
              />
            </div>
            {tasks.length > 0 ? (
              <>
                {tasks.slice(0, 3).map((task: Task, i: number) => (
                  <Fragment key={task.title}>
                    <TaskBox
                      isSelected={selectedTaskIndex === i}
                      onClick={() =>
                        (i === 0 || i === 1 || i === 2) &&
                        setSelectedTaskIndex(i)
                      }
                      task={task}
                      title={`(Shortcut: ${i + 1})`}
                    />
                    {selectedTaskIndex === i && (
                      <div className='mx-5 flex flex-row flex-wrap justify-center'>
                        <Buttons />
                      </div>
                    )}
                  </Fragment>
                ))}
              </>
            ) : (
              'No tasks'
            )}
            <LastUpdated query={topTasksQuery} />
          </>
        )}
        <Hints keyActions={keyActions} />
      </div>
    </RequireAuth>
  )
}

export default Home
