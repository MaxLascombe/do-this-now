import { DateTag, Repeat, Strict, TimeFrame } from './tags'

// types
import { LegacyRef } from 'react'
import { Task } from '../types/task'

export const TaskBox = ({
  innerRef,
  isSelected,
  onClick,
  task,
  title,
}: {
  innerRef?: LegacyRef<HTMLButtonElement>
  isSelected: boolean
  onClick?: () => void
  task: Task
  title?: string
}) => {
  const showSubtask = isSelected && task?.subtasks?.length > 0
  const subtasksDone =
    'subtasks' in task && Array.isArray(task.subtasks)
      ? task.subtasks.reduce(
          (acc: number, cur: (typeof task.subtasks)[number]) =>
            acc + (cur.done ? 1 : 0),
          0
        )
      : 0
  return (
    <button
      onClick={onClick}
      className={
        (isSelected
          ? 'border-gray-700 bg-gray-900 text-white '
          : 'border-gray-800 text-gray-300 text-white hover:border-gray-700 hover:bg-gray-900 ') +
        'relative flex w-full max-w-sm flex-col gap-2 rounded-lg border p-4 text-left outline-none ring-white ring-offset-0 ring-offset-black focus:z-10 focus:ring'
      }
      title={title}
      {...(innerRef !== null ? { ref: innerRef } : {})}>
      {/* <div
        className='absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-300'
        title='This task is far in the future and not counted towards the number of days to completion'></div> */}
      <div>
        <span>
          {showSubtask
            ? // show the first unsnoozed subtask
              task?.subtasks?.find(
                (s: (typeof task.subtasks)[number]) =>
                  !s.done && (!s.snooze || new Date(s.snooze) < new Date())
              )?.title ??
              // if there are none, show the first subtask that isn't done
              task?.subtasks?.find(
                (s: (typeof task.subtasks)[number]) => !s.done
              )?.title ??
              // otherwise, just show the task title
              task.title
            : task.title}
        </span>
      </div>
      {showSubtask && (
        <div className='text-xs font-normal'>
          {task.title} ({subtasksDone}/{task.subtasks.length})
        </div>
      )}
      <div
        className={
          (isSelected ? 'text-gray-300 ' : 'text-gray-600 ') +
          'flex flex-wrap gap-x-4'
        }>
        <DateTag due={task.due} />
        <TimeFrame timeFrame={task.timeFrame} />
        <Repeat
          repeat={task.repeat}
          repeatInterval={task.repeatInterval}
          repeatUnit={task.repeatUnit}
          repeatWeekdays={task.repeatWeekdays}
        />
        <Strict strictDeadline={task.strictDeadline} dueDate={task.due} />
      </div>
    </button>
  )
}
