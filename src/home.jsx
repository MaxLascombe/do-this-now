import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BellIcon,
    CheckCircleIcon,
    MenuIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/solid'

import { useQueryProgressToday } from './hooks/useQueryProgressToday'
import { useQuerySnoozeTask } from './hooks/useQuerySnoozeTask'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'
import useDing from './helpers/useDing'

import Button from './components/button'
import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'
import { newSafeDate } from './helpers/dates'

const Home = () => {
    const [mainTask, setMainTask] = useState('') // 0 - Math.min(2, tasks.length-1)
    const navigate = useNavigate()
    const ding = useDing()

    const { data, isLoading } = useQueryTasksTop()
    const { data: progress, isLoading: isLoadingProgress } =
        useQueryProgressToday()

    let tasks = (data?.Items ?? []).filter(
        x => !x.snooze || new Date(x.snooze) < new Date()
    )

    // if top task is strict and due, only show strict tasks that are due
    const isDue = i =>
        newSafeDate(tasks?.[i]?.due ?? '2050-01-01') <= new Date()
    const isStrictAndDue = i => tasks?.[i]?.strictDeadline && isDue(i)
    if (isStrictAndDue(0)) {
        for (let i = 1; i < tasks.length; i++) {
            if (!isStrictAndDue(i)) tasks = tasks.slice(0, i)
        }
    }

    // if top task is due, only show tasks that are due
    if (isDue(0)) {
        for (let i = 1; i < tasks.length; i++) {
            if (!isDue(i)) tasks = tasks.slice(0, i)
        }
    }

    const topTask =
        mainTask !== ''
            ? tasks.find(({ title }) => title === mainTask)
            : tasks[0]
    const leftTask = tasks.find(({ title }) => title !== topTask.title)
    const rightTask = tasks.find(
        ({ title }) => title !== topTask.title && title !== leftTask.title
    )

    const { mutate, isLoading: doneIsLoading } = useQueryTaskDone()
    const { mutate: mutateDelete, isLoading: deleteIsLoading } =
        useQueryTaskDelete()
    const { mutate: mutateSnooze, isLoading: snoozeIsLoading } =
        useQuerySnoozeTask()

    const subtasksDone =
        topTask &&
        topTask.hasOwnProperty('subtasks') &&
        Array.isArray(topTask.subtasks)
            ? topTask.subtasks.reduce((acc, cur) => acc + (cur.done ? 1 : 0), 0)
            : 0

    const completeTask = () => {
        ding()
        mutate(topTask)
        if (
            !topTask.hasOwnProperty('subtasks') ||
            subtasksDone + 1 >= topTask.subtasks.length
        )
            setMainTask('')
    }

    const snoozeTask = () => {
        mutateSnooze(topTask)
        setMainTask('')
    }

    const deleteTask = () => {
        if (
            !window.confirm(
                `Are you sure you want to delete '${topTask.title}'?`
            )
        )
            return
        mutateDelete(topTask)
        setMainTask('')
    }

    const keyActions = [
        ['d', 'Task done', completeTask],
        [
            'l',
            'Logout',
            () => window.confirm('You sure?') && loginManager.signOut(),
        ],
        [
            'n',
            'New task',
            e => {
                e.preventDefault()
                navigate('/new-task')
            },
        ],
        ['s', 'Snooze task', () => snoozeTask()],
        ['t', 'Tasks', () => navigate('/tasks')],
        [
            'u',
            'Update task',
            () => navigate(`/update-task/${encodeURIComponent(topTask.title)}`),
        ],
        ['1', 'Do left task', () => setMainTask(leftTask.title)],
        ['2', 'Do right task', () => setMainTask(rightTask.title)],
        ['Backspace', 'Delete current task', () => deleteTask()],
        ['Escape', 'Reset selected task', () => setMainTask('')],
    ]
    useKeyAction(keyActions)

    const Buttons = () => {
        const info = [
            [completeTask, 'Complete', CheckCircleIcon],
            [() => navigate('/tasks'), 'All tasks', MenuIcon],
            [() => navigate('/new-task'), 'New task', PlusCircleIcon],
            [snoozeTask, 'Snooze', BellIcon],
            [
                () =>
                    navigate(
                        `/update-task/${encodeURIComponent(topTask.title)}`
                    ),
                'Update',
                PencilIcon,
            ],
            [deleteTask, 'Delete', TrashIcon],
        ]
        return (
            <>
                {info.map(([func, text, icon]) => (
                    <Button key={text} onClick={func} text={text} icon={icon} />
                ))}
            </>
        )
    }

    const tasksDoneToday =
        (progress?.done ?? 0) + (progress?.doneBeforeToday ?? 0)

    return (
        <RequireAuth>
            <div className="h-screen flex flex-col justify-center">
                {isLoading ||
                doneIsLoading ||
                deleteIsLoading ||
                snoozeIsLoading ? (
                    <Loading />
                ) : (
                    <>
                        {!isLoadingProgress && (
                            <div className="flex flex-row justify-center mb-2">
                                <div className="w-36 border border-gray-700 bg-gray-800 h-2 rounded-full mt-0.5">
                                    <div
                                        className="bg-white h-full rounded-full"
                                        style={{
                                            width:
                                                Math.min(
                                                    (tasksDoneToday /
                                                        (progress?.todo ??
                                                            10)) *
                                                        100,
                                                    100
                                                ) + '%',
                                        }}
                                    />
                                </div>
                                <div className="text-gray-700 text-xs leading-3 ml-2 font-bold">
                                    {tasksDoneToday - (progress?.todo ?? 10) > 0
                                        ? `+ ${
                                              tasksDoneToday -
                                              (progress?.todo ?? 10)
                                          }`
                                        : `${tasksDoneToday} / ${
                                              progress?.todo ?? 10
                                          }`}
                                </div>
                            </div>
                        )}
                        <div className="md:max-w-sm mx-5 md:mx-auto border border-gray-700 py-auto p-6 rounded bg-gray-800 drop-shadow-sm font-bold text-lg text-center text-white">
                            {tasks.length > 0 ? (
                                <>
                                    <div>
                                        <span>
                                            {topTask.hasOwnProperty(
                                                'subtasks'
                                            ) &&
                                            topTask.subtasks.length > 0 &&
                                            topTask.subtasks.some(x => !x.done)
                                                ? topTask.subtasks.find(
                                                      s => !s.done
                                                  ).title
                                                : topTask.title}
                                        </span>
                                    </div>
                                    {topTask.hasOwnProperty('subtasks') &&
                                        topTask.subtasks.length > 0 && (
                                            <div className="text-xs py-1 font-normal">
                                                {topTask.title} ({subtasksDone}/
                                                {topTask.subtasks.length})
                                            </div>
                                        )}
                                    <div>
                                        <DateTag due={topTask.due} />
                                        <TimeFrame
                                            timeFrame={topTask.timeFrame}
                                        />
                                        <Repeat
                                            repeat={topTask.repeat}
                                            repeatInterval={
                                                topTask.repeatInterval
                                            }
                                            repeatUnit={topTask.repeatUnit}
                                        />
                                        <Strict
                                            strictDeadline={
                                                topTask.strictDeadline
                                            }
                                            dueDate={topTask.due}
                                        />
                                    </div>
                                </>
                            ) : (
                                'No tasks'
                            )}
                        </div>
                        <div className="pt-2 pr-2 flex flex-row flex-wrap justify-center mx-5 md:hidden">
                            <Buttons />
                        </div>
                        {tasks.length > 1 && (
                            <>
                                <div className="md:pt-1 pb-2 text-center text-gray-600">
                                    or
                                </div>
                                <div className="flex flex-col md:flex-row justify-center mx-5">
                                    <div
                                        onClick={() =>
                                            setMainTask(leftTask.title)
                                        }
                                        title="(Shortcut: 1)"
                                        className="border mb-2 cursor-pointer border-gray-700 hover:border-gray-600 py-auto p-4 rounded bg-gray-800 hover:bg-gray-700 drop-shadow-sm font-bold text-sm text-center md:mb-0 opacity-20 text-white">
                                        <span>{leftTask.title}</span>
                                        <DateTag due={leftTask.due} />
                                        <TimeFrame
                                            timeFrame={leftTask.timeFrame}
                                        />
                                        <Repeat
                                            repeat={leftTask.repeat}
                                            repeatInterval={
                                                leftTask.repeatInterval
                                            }
                                            repeatUnit={leftTask.repeatUnit}
                                        />
                                        <Strict
                                            strictDeadline={
                                                leftTask.strictDeadline
                                            }
                                            dueDate={leftTask.due}
                                        />
                                    </div>
                                    {tasks.length > 2 && (
                                        <div
                                            onClick={() =>
                                                setMainTask(rightTask.title)
                                            }
                                            title="(Shortcut: 2)"
                                            className="border cursor-pointer border-gray-700 hover:border-gray-600 py-auto p-4 rounded bg-gray-800 hover:bg-gray-700 drop-shadow-sm font-bold text-sm text-center md:ml-4 opacity-20 text-white">
                                            <span>{rightTask.title}</span>
                                            <DateTag due={rightTask.due} />
                                            <TimeFrame
                                                timeFrame={rightTask.timeFrame}
                                            />
                                            <Repeat
                                                repeat={rightTask.repeat}
                                                repeatInterval={
                                                    rightTask.repeatInterval
                                                }
                                                repeatUnit={
                                                    rightTask.repeatUnit
                                                }
                                            />
                                            <Strict
                                                strictDeadline={
                                                    rightTask.strictDeadline
                                                }
                                                dueDate={rightTask.due}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
                <Hints keyActions={keyActions} />
            </div>
        </RequireAuth>
    )
}

export default Home
