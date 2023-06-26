import { Switch } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'
import { Dispatch, SetStateAction, useState } from 'react'

import { RepeatOption, RepeatUnit, TaskInput } from '../types/task'

const TaskForm = ({
  titleState: [title, setTitle],
  dueMonthState: [dueMonth, setDueMonth],
  dueDayState: [dueDay, setDueDay],
  dueYearState: [dueYear, setDueYear],
  strictDeadlineState: [strictDeadline, setStrictDeadline],
  repeatState: [repeat, setRepeat],
  repeatIntervalState: [repeatInterval, setRepeatInterval],
  repeatUnitState: [repeatUnit, setRepeatUnit],
  repeatWeekdaysState: [repeatWeekdays, setRepeatWeekdays],
  timeFrameState: [timeFrame, setTimeFrame],
  subtasksState: [subtasks, setSubtasks],
  submitForm,
}: {
  [K in keyof TaskInput as `${K}State`]: [
    TaskInput[K],
    Dispatch<SetStateAction<TaskInput[K]>>
  ]
} & {
  submitForm: () => void
}) => {
  const [hasSubtasks, setHasSubtasks] = useState((subtasks?.length ?? 0) > 0)
  if ((subtasks?.length ?? 0) > 0 && !hasSubtasks) setHasSubtasks(true)

  if (!repeatWeekdays) {
    setRepeatWeekdays([false, false, false, false, false, false, false])
  }

  const todayAtMidnight = () => {
    let date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }

  const dayDiff = Math.round(
    (new Date(dueYear, dueMonth - 1, dueDay, 0, 0, 0, 0).getTime() -
      todayAtMidnight().getTime()) /
      (1000 * 60 * 60 * 24)
  )

  const dayDiffPhrase = () => {
    if (dayDiff < 0) {
      return `${Math.abs(dayDiff)} days ago`
    } else if (dayDiff === 0) {
      return 'today'
    } else if (dayDiff === 1) {
      return 'tomorrow'
    } else {
      return `in ${dayDiff} days`
    }
  }

  const updateDate = (newDate: Date) => {
    setDueYear(newDate.getFullYear())
    setDueMonth(newDate.getMonth() + 1)
    setDueDay(newDate.getDate())
  }

  const decrementDate = () => {
    let newDate = new Date(dueYear, dueMonth - 1, dueDay - 1, 0, 0, 0)
    updateDate(newDate)
  }

  const incrementDate = () => {
    let newDate = new Date(dueYear, dueMonth - 1, dueDay + 1, 0, 0, 0)
    updateDate(newDate)
  }

  return (
    <div className='mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Title'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Title
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg rounded-md shadow-sm'>
            <input
              type='text'
              id='title'
              placeholder='Do this thing'
              value={title}
              onChange={event => setTitle(event.target.value)}
              className='block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
          </div>
        </div>
      </div>

      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='due-date'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Due Date
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg rounded-md shadow-sm'>
            <button
              className='mr-3 inline-block rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'
              onClick={decrementDate}>
              -
            </button>
            <input
              type='number'
              max={12}
              min={1}
              step={1}
              name='due-month'
              id='due-month'
              placeholder='MM'
              value={dueMonth}
              onChange={e => setDueMonth(parseInt(e.target.value))}
              className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
            <input
              type='number'
              max={31}
              min={1}
              step={1}
              name='due-day'
              id='due-day'
              placeholder='DD'
              value={dueDay}
              onChange={e => setDueDay(parseInt(e.target.value))}
              className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
            <input
              type='number'
              step={1}
              name='due-year'
              id='due-year'
              placeholder='YYYY'
              value={dueYear}
              onChange={e => setDueYear(parseInt(e.target.value))}
              className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
            <button
              className='inline-block rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'
              onClick={incrementDate}>
              +
            </button>
          </div>
          <div className='mt-1 max-w-lg text-center text-gray-600'>
            {format(
              new Date(dueYear, dueMonth - 1, dueDay),
              'EEEE, LLLL do, u'
            )}{' '}
            ({dayDiffPhrase()})
          </div>
        </div>
      </div>

      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Strict Deadline'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Strict Deadline?
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <Switch
            checked={strictDeadline}
            onChange={setStrictDeadline}
            className={
              (strictDeadline ? 'bg-blue-600' : 'bg-gray-200') +
              ' relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }>
            <span className='sr-only'>Use setting</span>
            <span
              aria-hidden='true'
              className={
                (strictDeadline ? 'translate-x-5' : 'translate-x-0') +
                ' pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              }
            />
          </Switch>
        </div>
      </div>

      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Repeat'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Repeat?
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg rounded-md shadow-sm'>
            <select
              id='repeat'
              name='repeat'
              className='block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 pr-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
              value={repeat}
              onChange={e => setRepeat(e.target.value as RepeatOption)}>
              {repeatOptions.map(option => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          {repeat === 'Custom' && (
            <>
              <div className='mt-3 flex max-w-lg'>
                <div className='flex-1 py-2.5 text-sm'>Every:</div>
                <input
                  type='number'
                  step={1}
                  min={1}
                  value={repeatInterval}
                  onChange={e => setRepeatInterval(parseInt(e.target.value))}
                  className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                />
                <select
                  defaultValue={repeatUnit}
                  onChange={e => setRepeatUnit(e.target.value as RepeatUnit)}
                  className='block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 pr-10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'>
                  {repeatUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}s
                    </option>
                  ))}
                </select>
              </div>
              {repeatUnit === 'week' && repeatWeekdays && (
                <div className='pointer-events-auto mt-3 flex max-w-lg'>
                  {repeatWeekdays.map((_, i) => (
                    <div
                      onClick={() =>
                        setRepeatWeekdays(s => [
                          i === 0 ? !s[0] : s[0],
                          i === 1 ? !s[1] : s[1],
                          i === 2 ? !s[2] : s[2],
                          i === 3 ? !s[3] : s[3],
                          i === 4 ? !s[4] : s[4],
                          i === 5 ? !s[5] : s[5],
                          i === 6 ? !s[6] : s[6],
                        ])
                      }
                      className={
                        (i > 0 && 'ml-2') +
                        (repeatWeekdays[i]
                          ? ' border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                          : ' border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700') +
                        ' flex-1 cursor-pointer rounded border p-2 text-center text-xs font-bold'
                      }>
                      {days[i]}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Expected Time Frame'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Expected Time Frame
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg'>
            <input
              type='number'
              step={15}
              min={0}
              value={timeFrame}
              onChange={e => setTimeFrame(parseInt(e.target.value))}
              className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
            />
            <div className='py-2.5 text-sm'>mins</div>
          </div>
        </div>
      </div>
      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Subtasks'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Subtasks
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg'>
            <Switch
              checked={hasSubtasks}
              onChange={e => {
                if (
                  !e &&
                  subtasks.length > 0 &&
                  !window.confirm(
                    'Are you sure you want to remove all subtasks?'
                  )
                )
                  return
                if (!e) setSubtasks([])
                else setSubtasks([{ done: false, title: '' }])
                setHasSubtasks(e)
              }}
              className={
                (hasSubtasks ? 'bg-blue-600' : 'bg-gray-200') +
                ' relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }>
              <span className='sr-only'>Use setting</span>
              <span
                aria-hidden='true'
                className={
                  (hasSubtasks ? 'translate-x-5' : 'translate-x-0') +
                  ' pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                }
              />
            </Switch>
          </div>
          {hasSubtasks && (
            <>
              {subtasks.map((subtask, i) => (
                <div className='mt-3 flex max-w-lg'>
                  {i > 0 && (
                    <button
                      className='mr-3 inline-block rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'
                      onClick={() =>
                        setSubtasks(s => {
                          const newSubtasks = [...s]
                          newSubtasks[i - 1] = s[i]
                          newSubtasks[i] = s[i - 1]
                          return newSubtasks
                        })
                      }>
                      ↑
                    </button>
                  )}
                  <input
                    type='text'
                    value={subtask.title}
                    onChange={e => {
                      setSubtasks([
                        ...subtasks.slice(0, i),
                        {
                          ...subtask,
                          title: e.target.value,
                        },
                        ...subtasks.slice(i + 1),
                      ])
                    }}
                    placeholder={`Subtask ${i + 1}`}
                    className='block w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                  />
                  {i < subtasks.length - 1 && (
                    <button
                      className='ml-3 inline-block rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'
                      onClick={() =>
                        setSubtasks(s => {
                          const newSubtasks = [...s]
                          newSubtasks[i + 1] = s[i]
                          newSubtasks[i] = s[i + 1]
                          return newSubtasks
                        })
                      }>
                      ↓
                    </button>
                  )}
                  <button
                    className={
                      'ml-3 inline-block rounded border p-2 text-sm text-white' +
                      (subtask.done
                        ? ' border-gray-500 bg-gray-600 hover:border-gray-400 hover:bg-gray-500'
                        : ' border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700')
                    }
                    onClick={() =>
                      setSubtasks(s => [
                        ...s.slice(0, i),
                        {
                          ...s[i],
                          done: !s[i].done,
                        },
                        ...s.slice(i + 1),
                      ])
                    }>
                    <CheckCircleIcon className='block h-5 w-5' />
                  </button>
                </div>
              ))}
              <div className='mt-3 flex max-w-lg'>
                {subtasks.length > 0 && (
                  <button
                    onClick={() =>
                      setSubtasks([...subtasks.slice(0, subtasks.length - 1)])
                    }
                    className='mr-3 block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'>
                    Remove Last Subtask
                  </button>
                )}
                <button
                  onClick={() =>
                    setSubtasks([...subtasks, { done: false, title: '' }])
                  }
                  className='block w-full w-full min-w-0 flex-1 rounded border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm'>
                  Add Subtask
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        onClick={submitForm}
        className='pt-5 text-center sm:border-t sm:border-gray-700'>
        <button className='inline-block rounded-full border border-gray-700 bg-gray-800 p-2 text-sm text-white hover:border-gray-600 hover:bg-gray-700'>
          Submit
        </button>
      </div>
    </div>
  )
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const repeatOptions: RepeatOption[] = [
  'No Repeat',
  'Daily',
  'Weekdays',
  'Weekly',
  'Monthly',
  'Yearly',
  'Custom',
]
const repeatUnits: RepeatUnit[] = ['day', 'week', 'month', 'year']

export default TaskForm
