import {
  faArrowDown,
  faFire,
  faHeart,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { minutesToHours } from '../helpers/time'
import { useDate } from '../hooks/useDate'
import { useQueryProgressToday } from '../hooks/useQueryProgressToday'
import { Tag } from './tags'

const START_OF_DAY = 8 * 60 + 30 // 8:30
const MINUTES_IN_DAY = 24 * 60

const Progress = () => {
  const progress = useQueryProgressToday()
  const now = useDate()

  if (progress.data === undefined) return <></>

  const {
    done,
    lives,
    streak,
    streakIsActive,
    todo,
    daysUntilAllDone,
    minutesToReduceTomorrowDays,
  } = progress.data

  const maxTodo = Math.max(todo, minutesToReduceTomorrowDays)

  const timeOfDay = now.getHours() * 60 + now.getMinutes()
  const percentageOfDay =
    (timeOfDay - START_OF_DAY) / (MINUTES_IN_DAY - START_OF_DAY)
  const shouldBeDone = maxTodo * percentageOfDay
  const diff = done - shouldBeDone

  const livesUsed = Math.min(lives, todo - done)
  const livesLeft = lives - livesUsed

  const doneUsingAllLives = Math.min(done, todo - lives)
  const doneUsingLives = Math.min(done, todo)
  const points =
    doneUsingAllLives +
    (doneUsingLives - doneUsingAllLives) * 2 +
    (done - doneUsingLives) * 3

  return (
    <div className='mx-5 flex justify-center'>
      <div className='max-w-screen flex flex-col items-center gap-1 text-xs font-light'>
        <div className='flex w-full justify-center gap-5 text-white'>
          {diff > 0 ? (
            <>{minutesToHours(Math.floor(diff))} ahead of schedule</>
          ) : diff < 0 ? (
            <>{minutesToHours(Math.ceil(-diff))} behind schedule</>
          ) : (
            <>On schedule</>
          )}
        </div>

        <div className='mx-5 flex flex-wrap justify-center gap-5 gap-y-1 text-white'>
          <Tag icon={faStar} text={'' + points} />

          <Tag
            icon={faFire}
            text={'' + streak}
            color={streakIsActive ? 'text-amber-500' : 'text-white/50'}
          />

          {livesLeft > 0 ? (
            <Tag
              icon={faHeart}
              text={'' + minutesToHours(lives - livesUsed)}
              color={done >= todo ? 'text-red-400' : 'text-white/50'}
            />
          ) : (
            todo - done - livesUsed > 0 && (
              <Tag
                icon={faFire}
                iconRight={true}
                text={minutesToHours(todo - done - livesUsed) + ' to'}
              />
            )
          )}

          {todo - done > 0 && (
            <Tag
              icon={faHeart}
              text={minutesToHours(todo - done) + ' to'}
              iconRight={true}
            />
          )}

          {minutesToReduceTomorrowDays - done > 0 && (
            <Tag
              icon={faArrowDown}
              text={minutesToHours(minutesToReduceTomorrowDays - done) + ' to'}
              iconRight={true}
            />
          )}

          <Tag text={`${daysUntilAllDone} days`} />
        </div>

        <div
          style={{
            width: Math.round((144 * todo) / 600),
          }}
          className='relative mt-0.5 h-2 overflow-hidden rounded-full border border-gray-700'>
          <div
            className='h-full rounded-full bg-gray-500'
            style={{
              width: Math.min(((done + livesUsed) / todo) * 100, 100) + '%',
            }}
          />
          <div
            className='-mt-1.5 h-full rounded-full bg-white'
            style={{
              width: Math.min((done / todo) * 100, 100) + '%',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Progress
