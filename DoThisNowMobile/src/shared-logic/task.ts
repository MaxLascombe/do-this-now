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
  snooze: z.string().optional(),
})
export type SubTask = z.infer<typeof subTaskSchema>

export const taskInputSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, {
      message: 'Title is required',
    }),
  dueMonth: z.number(),
  dueDay: z.number(),
  dueYear: z.number(),
  strictDeadline: z.boolean(),
  repeat: repeatOptionSchema,
  repeatInterval: z.number(),
  repeatWeekdays: repeatWeekdaysSchema,
  repeatUnit: repeatUnitSchema,
  timeFrame: z.union([z.number(), z.string().transform(x => parseInt(x))]),
  subtasks: z.array(subTaskSchema),
})
export type TaskInput = z.infer<typeof taskInputSchema>

export const taskSchema = z.object({
  title: z.string(),
  due: z.union([dateStringSchema, z.literal('No Due Date')]),
  strictDeadline: z.boolean(),
  repeat: repeatOptionSchema,
  repeatInterval: z.number(),
  repeatUnit: repeatUnitSchema,
  repeatWeekdays: repeatWeekdaysSchema.catch([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]),
  timeFrame: z.union([z.number(), z.string().transform(x => parseInt(x))]),
  snooze: z.string().optional(),
  subtasks: z.array(subTaskSchema).catch([]),
})
export type Task = z.infer<typeof taskSchema>
