import { newSafeDate, nextDueDate } from './helpers'
import { SubTask, Task } from './task'

const subtaskIsSnoozed = (s: SubTask) =>
  s.snooze && new Date(s.snooze) >= new Date()

export const isSnoozed = (t: Task) =>
  (t.snooze && new Date(t.snooze) >= new Date()) ||
  (t.subtasks &&
    t.subtasks.length > 0 &&
    !t.subtasks.some(s => !s.done && !subtaskIsSnoozed(s)))

const dueOrPastDue = (t: Task, today: Date) =>
  'due' in t && newSafeDate(t.due) <= today

export const sortTasks = (tasks: Task[], today: Date) => {
  const tmrw = new Date(today)
  tmrw.setDate(tmrw.getDate() + 1)
  const in2Days = new Date(today)
  in2Days.setDate(in2Days.getDate() + 2)

  const sortFlags = [
    // snoozed
    (t: Task) => !isSnoozed(t),

    // due today or past due
    (t: Task) => dueOrPastDue(t, today),

    // strict deadline and due today or past due
    (t: Task) =>
      dueOrPastDue(t, today) && 'strictDeadline' in t && t.strictDeadline,

    // if I do this task, I won't have to do again it tomorrow
    (t: Task) =>
      dueOrPastDue(t, today) && (nextDueDate(t) ?? Infinity) >= in2Days,

    // if I do this task, I won't have to do again today
    (t: Task) => dueOrPastDue(t, today) && (nextDueDate(t) ?? Infinity) >= tmrw,
  ]

  tasks.sort((a, b) => {
    for (const flag of sortFlags) {
      if (flag(a) && !flag(b)) return -1
      if (flag(b) && !flag(a)) return 1
    }
    // sort by due date
    if (
      'due' in a &&
      'due' in b &&
      newSafeDate(a.due).getTime() !== newSafeDate(b.due).getTime()
    )
      return newSafeDate(a.due).getTime() - newSafeDate(b.due).getTime()
    // sort by timeframe
    if ('timeFrame' in a && 'timeFrame' in b && a.timeFrame !== b.timeFrame) {
      // tasks that take no time should go last
      if (a.timeFrame === 0) return 1
      if (b.timeFrame === 0) return -1
      return a.timeFrame - b.timeFrame
    }
    return 0
  })
}
