import {
  faArrowRight,
  faMinus,
  faPlus,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { ComponentProps, RefObject, useRef, useState } from 'react'
import { ZodError } from 'zod'
import useKeyAction, { KeyAction } from '../hooks/useKeyAction'
import { dateString, newSafeDate } from '../shared-logic/helpers'
import {
  RepeatOption,
  RepeatUnit,
  RepeatWeekdays,
  SubTask,
  TaskInput,
  taskInputSchema,
} from '../types/task'
import { Button } from './button'
import { Input } from './input'
import { Switch } from './switch'

const TaskForm = ({
  title: initialTitle,
  dueMonth: initialDueMonth,
  dueDay: initialDueDay,
  dueYear: initialDueYear,
  errorMessage,
  strictDeadline: initialStrictDeadline,
  repeat: initialRepeat,
  repeatInterval: initialRepeatInterval,
  repeatUnit: initialRepeatUnit,
  repeatWeekdays: initialRepeatWeekdays,
  timeFrame: initialTimeFrame,
  subtasks: initialSubtasks,
  submitForm,
  isSaving = false,
}: Partial<TaskInput> & {
  errorMessage?: string | null
  submitForm: (input: TaskInput) => void
  isSaving?: boolean
}) => {
  const [formError, setFormError] = useState<ZodError>()

  const [title, setTitle] = useState(initialTitle ?? '')

  const dueDayRef = useRef<HTMLInputElement>(null)
  const dueMonthRef = useRef<HTMLInputElement>(null)
  const dueYearRef = useRef<HTMLInputElement>(null)
  const [dueDate, setDueDate] = useState(
    initialDueYear && initialDueMonth && initialDueDay
      ? new Date(initialDueYear, initialDueMonth - 1, initialDueDay)
      : newSafeDate(dateString(new Date()))
  )
  const [strictDeadline, setStrictDeadline] = useState(
    initialStrictDeadline ?? false
  )
  const [repeat, setRepeat] = useState<RepeatOption>(
    initialRepeat ?? 'No Repeat'
  )
  const [repeatInterval, setRepeatInterval] = useState(
    initialRepeatInterval ?? 1
  )
  const [repeatUnit, setRepeatUnit] = useState<RepeatUnit>(
    initialRepeatUnit ?? 'day'
  )
  const [repeatWeekdays, setRepeatWeekdays] = useState<RepeatWeekdays>(
    initialRepeatWeekdays ?? [false, false, false, false, false, false, false]
  )

  const [timeFrame, setTimeFrame] = useState(initialTimeFrame ?? 0)
  const timeFrameMinutesRef = useRef<HTMLInputElement>(null)
  const timeFrameHoursRef = useRef<HTMLInputElement>(null)
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialSubtasks ?? [])

  const [hasSubtasks, setHasSubtasks] = useState((subtasks?.length ?? 0) > 0)
  if ((subtasks?.length ?? 0) > 0 && !hasSubtasks) setHasSubtasks(true)

  if (!repeatWeekdays) {
    setRepeatWeekdays([false, false, false, false, false, false, false])
  }

  const dayDiff = Math.round(
    (dueDate.getTime() - newSafeDate(dateString(new Date())).getTime()) /
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

  const decrementDate = () =>
    setDueDate(new Date(dueDate.setDate(dueDate.getDate() - 1)))
  const incrementDate = () =>
    setDueDate(new Date(dueDate.setDate(dueDate.getDate() + 1)))

  const errors =
    Object.fromEntries(
      formError?.errors.map(error => [error.path[0], error.message]) ?? []
    ) ?? {}

  const [draggedSubtask, setDraggedSubtask] =
    useState<(typeof subtasks)[number]>()
  const handleDragStart = (e: DragEvent, item: (typeof subtasks)[number]) => {
    setDraggedSubtask(item)
    e.dataTransfer?.setData('text/plain', '')
  }
  const handleDragEnd = () => {
    setDraggedSubtask(undefined)
  }
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }
  const handleDrop = (e: DragEvent, targetItem: (typeof subtasks)[number]) => {
    if (!draggedSubtask) return

    const currentIndex = subtasks.indexOf(draggedSubtask)
    const targetIndex = subtasks.indexOf(targetItem)

    const newSubtasks = [...subtasks]
    if (currentIndex !== -1 && targetIndex !== -1) {
      newSubtasks.splice(currentIndex, 1)
      newSubtasks.splice(targetIndex, 0, draggedSubtask)
      setSubtasks(newSubtasks)
    }
  }

  const submit = () => {
    const input = taskInputSchema.safeParse({
      title,
      dueMonth: dueDate.getMonth() + 1,
      dueDay: dueDate.getDate(),
      dueYear: dueDate.getFullYear(),
      strictDeadline,
      repeat,
      repeatInterval,
      repeatUnit,
      repeatWeekdays,
      timeFrame,
      subtasks,
    })
    if (!input.success) return setFormError(input.error)
    submitForm(input.data)
  }

  const keyActions: KeyAction[] = [
    {
      key: 'escape',
      description: 'Home',
      action: () => window.history.back(),
    },
  ]
  useKeyAction(keyActions)

  return (
    <form
      onSubmit={e => {
        console.log('submitting')
        e.preventDefault()
        submit()
      }}
      className='mt-6 block space-y-6 sm:mt-5 sm:space-y-5'>
      {errorMessage && <div className='mt-4 text-red-500'>{errorMessage}</div>}

      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='Title'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Title
        </label>
        <div className='mt-1 flex flex-col gap-2 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg rounded-md shadow-sm'>
            <Input
              id='titleInput'
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Do this thing'
            />
          </div>
          {errors.title && (
            <div className='text-sm text-red-500'>{errors.title}</div>
          )}
        </div>
      </div>

      <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
        <label
          htmlFor='due-date'
          className='block text-sm font-medium sm:mt-px sm:pt-2'>
          Due Date
        </label>
        <div className='mt-1 sm:col-span-2 sm:mt-0'>
          <div className='flex max-w-lg items-center gap-2 rounded-md shadow-sm'>
            <FormButton icon={faMinus} onClick={decrementDate} />
            <Input
              ref={dueMonthRef}
              type='number'
              step={1}
              name='due-month'
              id='due-month'
              placeholder='MM'
              value={dueDate.getMonth() + 1}
              onChange={e =>
                setDueDate(
                  new Date(
                    parseInt(dueYearRef.current?.value ?? '1'),
                    parseInt(e.target.value === '' ? '1' : e.target.value) - 1,
                    parseInt(dueDayRef.current?.value ?? '1')
                  )
                )
              }
            />
            <Input
              ref={dueDayRef}
              type='number'
              step={1}
              name='due-day'
              id='due-day'
              placeholder='DD'
              value={dueDate.getDate()}
              onChange={e =>
                setDueDate(
                  new Date(
                    parseInt(dueYearRef.current?.value ?? '1'),
                    parseInt(dueMonthRef.current?.value ?? '1') - 1,
                    parseInt(e.target.value === '' ? '1' : e.target.value)
                  )
                )
              }
            />
            <Input
              ref={dueYearRef}
              type='number'
              step={1}
              name='due-year'
              id='due-year'
              placeholder='YYYY'
              value={dueDate.getFullYear()}
              onChange={e =>
                setDueDate(
                  new Date(
                    parseInt(e.target.value === '' ? '1' : e.target.value),
                    parseInt(dueMonthRef.current?.value ?? '1') - 1,
                    parseInt(dueDayRef.current?.value ?? '1')
                  )
                )
              }
            />
            <FormButton onClick={incrementDate} icon={faPlus} />
          </div>
          <div className='mt-1 max-w-lg text-center text-gray-600'>
            {format(dueDate, 'EEEE, LLLL do, u')} ({dayDiffPhrase()})
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
          <Switch checked={strictDeadline} onChange={setStrictDeadline} />
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
            <FormSelect
              id='repeat'
              name='repeat'
              value={repeat}
              onChange={e => setRepeat(e.target.value as RepeatOption)}>
              {repeatOptions.map(option => (
                <option key={option}>{option}</option>
              ))}
            </FormSelect>
          </div>
          {repeat === 'Custom' && (
            <>
              <div className='mt-3 flex max-w-lg'>
                <div className='flex-1 py-2.5 text-sm'>Every:</div>
                <Input
                  type='number'
                  step={1}
                  min={1}
                  className='mr-3'
                  value={repeatInterval}
                  onChange={e => setRepeatInterval(parseInt(e.target.value))}
                />
                <FormSelect
                  defaultValue={repeatUnit}
                  onChange={e => setRepeatUnit(e.target.value as RepeatUnit)}>
                  {repeatUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}s
                    </option>
                  ))}
                </FormSelect>
              </div>
              {repeatUnit === 'week' && repeatWeekdays && (
                <div className='pointer-events-auto mt-3 flex max-w-lg justify-evenly'>
                  {repeatWeekdays.map((_, i) => (
                    <SwitchWithLabel
                      key={days[i]}
                      label={days[i]}
                      onChange={v =>
                        setRepeatWeekdays(s => [
                          i === 0 ? v : s[0],
                          i === 1 ? v : s[1],
                          i === 2 ? v : s[2],
                          i === 3 ? v : s[3],
                          i === 4 ? v : s[4],
                          i === 5 ? v : s[5],
                          i === 6 ? v : s[6],
                        ])
                      }
                      checked={repeatWeekdays[i]}
                    />
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
          <div className='flex max-w-lg flex-col items-center justify-evenly gap-2 md:flex-row'>
            {timeFrame >= 60 && (
              <NumberInput
                innerRef={timeFrameHoursRef}
                label='hrs'
                minusDisabled={false}
                minusFn={() => setTimeFrame(Math.max(0, timeFrame - 60))}
                onChange={e =>
                  setTimeFrame(
                    parseInt(e.target.value) * 60 +
                      parseInt(timeFrameMinutesRef.current?.value ?? '0')
                  )
                }
                plusFn={() => setTimeFrame(timeFrame + 60)}
                value={Math.floor(timeFrame / 60)}
                step={1}
                min={0}
              />
            )}
            <NumberInput
              innerRef={timeFrameMinutesRef}
              label='mins'
              minusDisabled={timeFrame === 0}
              minusFn={() => setTimeFrame(Math.max(0, timeFrame - 15))}
              onChange={e => {
                console.log(e)
                setTimeFrame(
                  Math.max(
                    0,
                    parseInt(timeFrameHoursRef.current?.value ?? '0') * 60 +
                      parseInt(e.target.value)
                  )
                )
              }}
              plusFn={() => setTimeFrame(timeFrame + 15)}
              value={timeFrame % 60}
              step={15}
              min={-15}
            />
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
            />
          </div>
          {hasSubtasks && (
            <>
              {subtasks.map((subtask, i) => (
                <div
                  draggable='true'
                  // @ts-expect-error - drag events
                  onDragStart={e => handleDragStart(e, subtask)}
                  onDragEnd={handleDragEnd}
                  // @ts-expect-error - drag events
                  onDragOver={handleDragOver}
                  // @ts-expect-error - drag events
                  onDrop={e => handleDrop(e, subtask)}
                  className='mt-3 flex max-w-lg items-center gap-2'>
                  <button>⠿</button>
                  <Input
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
                  />
                  <FormButton
                    icon={faTrash}
                    onClick={() =>
                      setSubtasks(s => [...s.slice(0, i), ...s.slice(i + 1)])
                    }
                  />
                  <SwitchWithLabel
                    label='Done?'
                    checked={subtask.done}
                    onChange={v =>
                      setSubtasks(s => [
                        ...s.slice(0, i),
                        {
                          ...s[i],
                          done: v,
                        },
                        ...s.slice(i + 1),
                      ])
                    }
                  />
                </div>
              ))}
              <div className='mt-3 flex max-w-lg justify-center'>
                <Button
                  icon={faPlusCircle}
                  text='New Subtask'
                  onClick={() =>
                    setSubtasks([...subtasks, { done: false, title: '' }])
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex justify-center pt-5 sm:border-t sm:border-gray-700'>
        <Button
          loading={isSaving}
          icon={faArrowRight}
          text='Submit'
          type='submit'
        />
      </div>
    </form>
  )
}

const NumberInput = (
  props: ComponentProps<'input'> & {
    innerRef: RefObject<HTMLInputElement>
    label: string
    minusDisabled: boolean
    minusFn: () => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    plusFn: () => void
    step: number
    min: number
  }
) => (
  <div className='flex w-full items-center gap-2'>
    {!props.minusDisabled && (
      <FormButton icon={faMinus} onClick={props.minusFn} />
    )}
    <div className='flex-1 flex-grow'>
      <Input
        id={props.id}
        ref={props.innerRef}
        type='number'
        step={props.step}
        min={props.min}
        value={props.value}
        onChange={props.onChange}
        className='w-full'
      />
    </div>
    <FormButton icon={faPlus} onClick={props.plusFn} />
    <label htmlFor={props.id} className='text-sm'>
      {props.label}
    </label>
  </div>
)

const FormButton = (
  props: Omit<ComponentProps<typeof Button>, 'className'>
) => <Button {...props} type='button' className='border-gray-800' />

const FormSelect = (props: ComponentProps<'select'>) => (
  <select
    {...props}
    className={
      'mw-11/12 mx-auto block w-96 min-w-0 flex-1 rounded border border-gray-800 bg-black p-2.5 text-white placeholder-gray-400 outline-none ring-white ring-offset-0 ring-offset-black focus:border-blue-500 focus:border-gray-700 focus:bg-gray-900 focus:ring sm:text-sm ' +
      props.className
    }>
    {props.children}
  </select>
)

const SwitchWithLabel = ({
  label,
  ...props
}: {
  label: string
} & ComponentProps<typeof Switch>) => (
  <div className='flex flex-col items-center text-xs'>
    <label htmlFor={props.id}>{label}</label>
    <Switch {...props} />
  </div>
)

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
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
