import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/solid'

import { useQueryGetTask } from './hooks/useQueryGetTask'
import { useQueryUpdateTask } from './hooks/useQueryUpdateTask'
import useKeyAction from './hooks/useKeyAction'

import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TaskForm from './components/taskform'
import { newSafeDate } from './helpers/dates'

const UpdateTask = () => {
    const { pathname } = useLocation()

    const navigate = useNavigate()

    const taskId = (() => {
        const path = pathname.split('/')
        let lastPathItem = path.pop()
        if (lastPathItem === '') lastPathItem = path.pop()
        if (lastPathItem === 'update-task') navigate(-1)
        return decodeURIComponent(lastPathItem)
    })()

    const titleState = useState(taskId)

    const [oldTask, setOldTask] = useState(null)
    const { data, isLoading: isTaskLoading } = useQueryGetTask(taskId)
    const task = data?.Item ?? undefined

    const [loading, setLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(true)

    const dueMonthState = useState(1)
    const dueDayState = useState(1)
    const dueYearState = useState(1998)
    const strictDeadlineState = useState(false)
    const repeatState = useState('No Repeat')
    const repeatIntervalState = useState(1)
    const repeatUnitState = useState('day')
    const selectedWeekDaysState = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ])
    const timeFrameState = useState(15)
    const subtasksState = useState([])

    useEffect(() => {
        if (task && task !== oldTask) {
            dueMonthState[1](newSafeDate(task.due).getMonth() + 1)
            dueDayState[1](newSafeDate(task.due).getDate())
            dueYearState[1](newSafeDate(task.due).getFullYear())
            strictDeadlineState[1](task.strictDeadline)
            repeatState[1](task.repeat)
            repeatIntervalState[1](task.repeatInterval)
            repeatUnitState[1](task.repeatUnit)
            selectedWeekDaysState[1](task.repeatWeekdays)
            timeFrameState[1](task.timeFrame)
            subtasksState[1](task.subtasks)
            setOldTask(task)
        }
    }, [
        dueDayState,
        dueMonthState,
        dueYearState,
        oldTask,
        repeatState,
        repeatIntervalState,
        repeatUnitState,
        selectedWeekDaysState,
        strictDeadlineState,
        subtasksState,
        timeFrameState,
        task,
    ])

    const toggleWeekday = index =>
        selectedWeekDaysState[1]([
            ...selectedWeekDaysState[0].slice(0, index),
            !selectedWeekDaysState[0][index],
            ...selectedWeekDaysState[0].slice(index + 1),
        ])

    const { mutate } = useQueryUpdateTask()

    const submitForm = () => {
        setLoading(true)
        const task = {
            title: titleState[0],
            due: `${dueYearState[0]}-${dueMonthState[0]}-${dueDayState[0]}`,
            strictDeadline: strictDeadlineState[0],
            repeat: repeatState[0],
            repeatInterval: parseInt(repeatIntervalState[0]),
            repeatUnit: repeatUnitState[0],
            repeatWeekdays: selectedWeekDaysState[0],
            timeFrame: timeFrameState[0],
            ...((subtasksState?.[0]?.length ?? 0) > 0
                ? { subtasks: subtasksState[0] }
                : {}),
            ...(taskId !== titleState[0] ? { oldTitle: taskId } : {}),
        }
        mutate(task)
    }

    const keyActions = [
        [
            'Enter',
            'Submit form',
            e => {
                e.preventDefault()
                e.stopPropagation()
                submitForm()
            },
        ],
        ['Escape', 'Back', () => navigate(-1)],
        ['u', 'Toggle Sunday', () => !isTyping && toggleWeekday(0)],
        ['m', 'Toggle Monday', () => !isTyping && toggleWeekday(1)],
        ['t', 'Toggle Tuesday', () => !isTyping && toggleWeekday(2)],
        ['w', 'Toggle Wednesday', () => !isTyping && toggleWeekday(3)],
        ['r', 'Toggle Thursday', () => !isTyping && toggleWeekday(4)],
        ['f', 'Toggle Friday', () => !isTyping && toggleWeekday(5)],
        ['s', 'Toggle Saturday', () => !isTyping && toggleWeekday(6)],
    ]
    useKeyAction(keyActions)

    return (
        <RequireAuth>
            {(loading && isTaskLoading) || !task ? (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-90 h-screen flex flex-col justify-center">
                    <Loading light={false} />
                </div>
            ) : (
                <div className="space-y-8 divide-y divide-gray-700 p-10 text-white">
                    <div className="space-y-8 divide-y divide-gray-700 sm:space-y-5">
                        <div>
                            <div>
                                <h3 className="text-lg leading-6 font-medium ">
                                    <ChevronLeftIcon
                                        className="w-5 h-5 inline-block cursor-pointer md:hidden"
                                        onClick={() => navigate(-1)}
                                    />
                                    <span>Update Task: {taskId}</span>
                                </h3>
                            </div>
                            <TaskForm
                                {...{
                                    setIsTyping,
                                    titleState,
                                    dueMonthState,
                                    dueDayState,
                                    dueYearState,
                                    strictDeadlineState,
                                    repeatState,
                                    repeatIntervalState,
                                    repeatUnitState,
                                    selectedWeekDaysState,
                                    timeFrameState,
                                    subtasksState,
                                    submitForm,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* <Hints keyActions={keyActions} /> */}
        </RequireAuth>
    )
}

export default UpdateTask
