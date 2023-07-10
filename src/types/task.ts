import { z } from 'zod'

const dateStringSchema = z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/)
export type DateString = z.infer<typeof dateStringSchema>

const repeatOptionSchema = z.union([
  z.literal('No Repeat'),
  z.literal('Daily'),
  z.literal('Weekdays'),
  z.literal('Weekly'),
  z.literal('Monthly'),
  z.literal('Yearly'),
  z.literal('Custom'),
])
export type RepeatOption = z.infer<typeof repeatOptionSchema>

const repeatUnitSchema = z.union([
  z.literal('day'),
  z.literal('week'),
  z.literal('month'),
  z.literal('year'),
])
export type RepeatUnit = z.infer<typeof repeatUnitSchema>

export const repeatWeekdaysSchema = z.tuple([
  z.boolean(),
  z.boolean(),
  z.boolean(),
  z.boolean(),
  z.boolean(),
  z.boolean(),
  z.boolean(),
])
export type RepeatWeekdays = z.infer<typeof repeatWeekdaysSchema>

const subTaskSchema = z.object({
  title: z.string(),
  done: z.boolean(),
  snoozed: z.boolean().optional(),
})
export type SubTask = z.infer<typeof subTaskSchema>

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

export const dynamoDBTaskSchema = z.object({
  title: z.object({ S: z.string() }),
  due: z
    .union([z.object({ S: dateStringSchema }), z.literal('No Due Date')])
    .optional(),
  strictDeadline: z.object({ BOOL: z.boolean() }),
  repeat: z.object({ S: repeatOptionSchema }),
  repeatInterval: z.object({ N: z.string().transform(x => parseInt(x)) }),
  repeatUnit: z.object({ S: repeatUnitSchema }),
  repeatWeekdays: z
    .object({
      L: z.tuple([
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
        z.object({ BOOL: z.boolean() }),
      ]),
    })
    .optional(),
  timeFrame: z.union([
    z.object({ N: z.string().transform(x => parseInt(x)) }),
    z.object({ S: z.string() }).transform(x => ({ N: parseInt(x.S) })),
  ]),
  snooze: z.object({ S: z.string() }).optional(),
  subtasks: z
    .object({
      L: z.array(
        z.object({
          M: z.object({
            title: z.object({ S: z.string() }),
            done: z.object({ BOOL: z.boolean() }),
            snoozed: z.object({ BOOL: z.boolean() }).optional(),
          }),
        })
      ),
    })
    .optional(),
})
export type DynamoDBTask = z.infer<typeof dynamoDBTaskSchema>
