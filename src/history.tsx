import {
  faBackward,
  faForward,
  faHome,
} from '@fortawesome/free-solid-svg-icons'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'wouter'
import { Button } from './components/button'
import Hints from './components/hints'
import { Loading } from './components/loading'
import Progress from './components/progress'
import { TaskBox } from './components/taskbox'
import { useHistory } from './hooks/useHistory'
import useKeyAction, { KeyAction } from './hooks/useKeyAction'
import { Task as TaskType, repeatWeekdaysSchema } from './types/task'

const DateNavigator = ({
  daysAgoState: [daysAgo, setDaysAgo],
}: {
  daysAgoState: [number, Dispatch<SetStateAction<number>>]
}) => (
  <div className='flex justify-center gap-2'>
    <Button icon={faBackward} onClick={() => setDaysAgo(da => da + 1)} />
    {/* display date of daysAgo days ago */}
    <div className='pt-2.5 text-xs text-white'>
      {new Date(
        new Date().setDate(new Date().getDate() - daysAgo)
      ).toLocaleDateString()}
    </div>
    <Button
      icon={faForward}
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

  const keyActions: KeyAction[] = [
    { key: 'escape', description: 'Home', action: () => navigate('/') },
  ]
  useKeyAction(keyActions)

  return (
    <>
      <div className='my-10 mx-5 flex h-screen flex-col items-center'>
        <Progress />
        <div className='mt-2 flex flex-row flex-wrap justify-center pb-2'>
          <Button onClick={() => navigate('/')} icon={faHome} text='Home' />
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
                innerRef={(e: HTMLElement) => (taskElems.current[i] = e)}
                onClick={() => {}}
                due={task.M.due === 'No Due Date' ? task.M.due : task.M.due?.S}
                repeat={task.M.repeat?.S}
                repeatInterval={task.M.repeatInterval?.N}
                repeatUnit={task.M.repeatUnit?.S}
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
    </>
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
  strictDeadline,
  timeFrame,
  title,
  onClick,
}: TaskType & {
  innerRef: (x: HTMLButtonElement) => void
  isSelected: boolean
  onClick: () => void
}) => (
  <TaskBox
    innerRef={innerRef}
    isSelected={isSelected}
    onClick={onClick}
    task={{
      due,
      repeat,
      repeatInterval,
      repeatUnit,
      repeatWeekdays,
      strictDeadline,
      timeFrame,
      title,
      subtasks: [],
    }}
  />
)

export default History
