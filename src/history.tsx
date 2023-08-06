import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'wouter'

import { BackwardIcon, ForwardIcon, HomeIcon } from '@heroicons/react/20/solid'

import Button from './components/button'
import Hints from './components/hints'
import Progress from './components/progress'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

import { useHistory } from './hooks/useHistory'
import useKeyAction, { KeyAction } from './hooks/useKeyAction'

import Loading from './components/loading'
import { repeatWeekdaysSchema, Task as TaskType } from './types/task'

const DateNavigator = ({
  daysAgoState: [daysAgo, setDaysAgo],
}: {
  daysAgoState: [number, Dispatch<SetStateAction<number>>]
}) => (
  <div className='flex flex-row justify-center'>
    <Button icon={BackwardIcon} onClick={() => setDaysAgo(da => da + 1)} />
    {/* display date of daysAgo days ago */}
    <div className='ml-2 mr-1 pt-2.5 text-xs text-white'>
      {new Date(
        new Date().setDate(new Date().getDate() - daysAgo)
      ).toLocaleDateString()}
    </div>
    <Button
      icon={ForwardIcon}
      onClick={() => setDaysAgo(da => Math.max(0, da - 1))}
    />
  </div>
)

const History = () => {
  const taskElems: MutableRefObject<HTMLElement[]> = useRef([])
  const navigate = useLocation()[1]

  const daysAgoState = useState(0)

  const { data, isLoading } = useHistory(daysAgoState[0])

  const tasks = data?.tasks?.L || []

  console.log({ tasks })

  const keyActions: KeyAction[] = [
    { key: 'escape', description: 'Home', action: () => navigate('/') },
  ]
  useKeyAction(keyActions)

  return (
    <RequireAuth>
      <div className='my-10 mx-5 h-screen'>
        <Progress />
        <div className='flex flex-row flex-wrap justify-center pb-2'>
          <Button onClick={() => navigate('/')} icon={HomeIcon} text='Home' />
        </div>
        <DateNavigator {...{ daysAgoState }} />
        {isLoading ? (
          <Loading />
        ) : (
          <div className='mt-2 flex flex-col gap-1'>
            {tasks.map((task: (typeof tasks)[number], i: number) => (
              <Task
                key={i}
                isSelected={false}
                innerRef={(e: any) => (taskElems.current[i] = e)}
                onClick={() => {}}
                due={task.M.due === 'No Due Date' ? task.M.due : task.M.due?.S}
                repeat={task.M.repeat?.S}
                repeatInterval={task.M.repeatInterval?.N}
                repeatUnit={task.M.repeatUnit?.S}
                showDate={true}
                strictDeadline={task.M.strictDeadline?.BOOL}
                timeFrame={task.M.timeFrame?.N}
                title={task.M.title?.S}
                repeatWeekdays={repeatWeekdaysSchema
                  .catch([false, false, false, false, false, false, false])
                  .parse(task.M.repeatWeekdays?.L?.map(x => x.BOOL))}
                subtasks={[]}
              />
            ))}
          </div>
        )}
      </div>
      <Hints keyActions={keyActions} />
    </RequireAuth>
  )
}

const Task = ({
  due,
  innerRef,
  isSelected,
  repeat,
  repeatInterval,
  repeatUnit,
  repeatWeekdays,
  showDate,
  strictDeadline,
  timeFrame,
  title,
  onClick,
}: TaskType & {
  innerRef: (x: any) => void
  isSelected: boolean
  showDate: boolean
  onClick: () => void
}) => (
  <div
    ref={innerRef}
    className={
      (isSelected
        ? 'border-gray-600 bg-gray-700'
        : 'border-gray-700 bg-gray-800') +
      ' max-w-96 text-md mx-auto block rounded border p-4 text-center font-bold text-white drop-shadow-sm md:max-w-sm'
    }
    onClick={onClick}>
    <span>{title}</span>
    {showDate && due !== undefined && due !== 'No Due Date' && (
      <DateTag due={due} />
    )}
    <TimeFrame timeFrame={timeFrame} />
    <Repeat {...{ repeat, repeatInterval, repeatUnit, repeatWeekdays }} />
    {due !== undefined && due !== 'No Due Date' && (
      <Strict strictDeadline={strictDeadline} dueDate={due} highlight={false} />
    )}
  </div>
)

export default History
