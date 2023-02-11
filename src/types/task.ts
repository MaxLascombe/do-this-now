export type DateString = `${number}-${number}-${number}`

export type RepeatOption =
  | 'No Repeat'
  | 'Daily'
  | 'Weekdays'
  | 'Weekly'
  | 'Monthly'
  | 'Yearly'
  | 'Custom'

export type RepeatUnit = 'day' | 'week' | 'month' | 'year'

export type RepeatWeekdays = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
]

export type SubTask = {
  title: string
  done: boolean
  snoozed?: boolean
}

export type TaskInput = {
  title: string
  dueMonth: number
  dueDay: number
  dueYear: number
  strictDeadline: boolean
  repeat: RepeatOption
  repeatInterval: number
  repeatWeekdays: RepeatWeekdays
  repeatUnit: RepeatUnit
  timeFrame: number
  subtasks: SubTask[]
}

export type Task = {
  title: string
  due?: DateString | 'No Due Date'
  strictDeadline: boolean
  repeat: RepeatOption
  repeatInterval: number
  repeatUnit: RepeatUnit
  repeatWeekdays: RepeatWeekdays
  timeFrame: number
  snooze?: number
  subtasks: SubTask[]
}
