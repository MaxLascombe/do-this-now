import { DateString, Task } from './task'

export const newSafeDate = (str: DateString) => {
  const [year, month, day] = str.split('-').map(s => parseInt(s))
  return new Date(year, month - 1, day)
}

export const dateString = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

export const nextDueDate = (task: Task) => {
  if (task.repeat === 'No Repeat') return undefined
  const date = newSafeDate(task.due)
  if (task.repeat === 'Daily') date.setDate(date.getDate() + 1)
  if (task.repeat === 'Custom' && task.repeatUnit === 'day')
    date.setDate(date.getDate() + task.repeatInterval)
  else if (task.repeat === 'Weekly') date.setDate(date.getDate() + 7)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'week') {
    if (!('repeatWeekdays' in task) || !task.repeatWeekdays.some(x => x))
      date.setDate(date.getDate() + 7 * task.repeatInterval)
    else {
      let i = (date.getDay() + 1) % 7
      while (!task.repeatWeekdays[i]) i = (i + 1) % 7
      if (i > date.getDay()) date.setDate(date.getDate() + i - date.getDay())
      else {
        date.setDate(date.getDate() + 7 * task.repeatInterval)
        date.setDate(date.getDate() + i - date.getDay())
      }
    }
  } else if (task.repeat === 'Weekdays') {
    const daysToAdd = date.getDay() === 5 ? 3 : 1
    date.setDate(date.getDate() + daysToAdd)
  } else if (task.repeat === 'Monthly') date.setMonth(date.getMonth() + 1)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'month')
    date.setMonth(date.getMonth() + task.repeatInterval)
  else if (task.repeat === 'Yearly') date.setFullYear(date.getFullYear() + 1)
  else if (task.repeat === 'Custom' && task.repeatUnit === 'year')
    date.setFullYear(date.getFullYear() + task.repeatInterval)
  date.setHours(date.getHours() + 2)
  return newSafeDate(dateString(date))
}
