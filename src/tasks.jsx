import { Fragment, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { format } from 'date-fns'
import {
    ArrowDownIcon,
    CheckCircleIcon,
    HomeIcon,
    PencilIcon,
    PlusCircleIcon,
} from '@heroicons/react/solid'

import { newSafeDate } from './helpers/dates'
import useDing from './helpers/useDing'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import { DateTag, Repeat, Strict, TimeFrame } from './components/tags'

import { useQueryTasks } from './hooks/useQueryTasks'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import { useQueryTaskDelete } from './hooks/useQueryTaskDelete'
import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import useKeyAction from './hooks/useKeyAction'

const Tasks = () => {
    const [selectedTask, setSelectedTask] = useState(0)
    const [sort, setSort] = useState(0)
    const taskElems = useRef([])
    const ding = useDing()
    const navigate = useNavigate()

    const { data, isFetching } = useQueryTasks()
    const { data: dataTop, isFetching: isFetchingTop } = useQueryTasksTop()

    const tasks = ((sort === 0 ? data : dataTop)?.Items ?? []).map(task => ({
        due: 'No Due Date',
        ...task,
    }))

    const { mutate, isLoading: doneIsLoading } = useQueryTaskDone()
    const { mutate: mutateDelete, isLoading: deleteIsLoading } =
        useQueryTaskDelete()

    const completeTask = () => {
        ding()
        mutate(tasks[selectedTask])
    }

    const scrollIntoView = elem => {
        window.scrollTo({
            behavior: 'smooth',
            top:
                elem.getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                200,
        })
    }

    const keyActions = [
        ['d', 'Task done', completeTask],
        ['n', 'New task', () => navigate('/new-task')],
        [
            'o',
            'Toggle order between date and top',
            () => setSort(s => (s + 1) % 2),
        ],
        [
            'u',
            'Update task',
            () =>
                navigate(
                    `/update-task/${encodeURIComponent(
                        tasks[selectedTask].title
                    )}`
                ),
        ],
        [
            'ArrowUp',
            'Select previous task',
            e => {
                e.preventDefault()
                setSelectedTask(Math.max(selectedTask - 1, 0))
                scrollIntoView(taskElems.current[selectedTask - 1])
            },
        ],
        [
            'ArrowDown',
            'Select next task',
            e => {
                e.preventDefault()
                setSelectedTask(Math.min(selectedTask + 1, tasks.length - 1))
                scrollIntoView(taskElems.current[selectedTask + 1])
            },
        ],
        ['Escape', 'Home', () => navigate('/')],
        [
            'Backspace',
            'Delete current task',
            () =>
                window.confirm(
                    `Are you sure you want to delete '${tasks[selectedTask].title}'?`
                ) && mutateDelete(tasks[selectedTask]),
        ],
    ]
    useKeyAction(keyActions)

    const formatDate = date => {
        try {
            return format(
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 1,
                    0,
                    0,
                    0
                ),
                'EEEE, LLLL do, u'
            )
        } catch (e) {
            console.error(e)
            return date.toDateString()
        }
    }

    if (sort === 0)
        tasks.sort((a, b) =>
            a.due === 'No Due Date'
                ? -1
                : b.due === 'No Due Date'
                ? 1
                : newSafeDate(a.due) - newSafeDate(b.due)
        )

    return (
        <RequireAuth>
            {doneIsLoading || deleteIsLoading ? (
                <div className="h-screen flex flex-col justify-center">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="h-screen my-10 mx-5">
                        <div className="pb-2 flex flex-row justify-center md:hidden flex-wrap">
                            <button
                                onClick={() => navigate('/')}
                                className="block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2">
                                <span>Home</span>
                                <HomeIcon className="h-5 w-5 ml-1 inline-block" />
                            </button>
                            <button
                                onClick={() => navigate('/new-task')}
                                className="block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2">
                                <span>New task</span>
                                <PlusCircleIcon className="h-5 w-5 ml-1 inline-block" />
                            </button>
                            <button
                                onClick={() => setSort(s => (s + 1) % 2)}
                                className="block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2">
                                <span>Toggle order</span>
                                <ArrowDownIcon className="h-5 w-5 ml-1 inline-block" />
                            </button>
                        </div>
                        {tasks.map((task, i) => (
                            <Fragment key={task.title}>
                                {sort === 0 && (
                                    <>
                                        {(i === 0 ||
                                            formatDate(
                                                newSafeDate(tasks[i - 1].due)
                                            ) !==
                                                formatDate(
                                                    newSafeDate(task.due)
                                                )) && (
                                            <div
                                                className={
                                                    (newSafeDate(task.due) <
                                                    new Date(
                                                        new Date().getFullYear(),
                                                        new Date().getMonth(),
                                                        new Date().getDate(),
                                                        0,
                                                        0,
                                                        0
                                                    )
                                                        ? 'text-orange-300'
                                                        : 'text-white') +
                                                    ' mx-auto text-center text-sm md:max-w-sm max-w-96'
                                                }>
                                                {newSafeDate(
                                                    task.due
                                                ).toDateString()}
                                            </div>
                                        )}
                                    </>
                                )}
                                {sort === 1 &&
                                    i > 0 &&
                                    newSafeDate(task.due) > new Date() &&
                                    newSafeDate(tasks[i - 1].due) <=
                                        new Date() && (
                                        <div
                                            className={
                                                'text-white mx-auto text-center text-sm md:max-w-sm max-w-96'
                                            }>
                                            Due after today
                                        </div>
                                    )}
                                <Task
                                    isSelected={i === selectedTask}
                                    innerRef={e => (taskElems.current[i] = e)}
                                    {...task}
                                    onClick={() => setSelectedTask(i)}
                                    showDate={sort === 1}
                                />
                                {i === selectedTask && (
                                    <div className="flex flex-row flex-wrap justify-center py-2 md:hidden">
                                        <button
                                            onClick={completeTask}
                                            className="block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2">
                                            <span>Complete</span>
                                            <CheckCircleIcon className="h-5 w-5 ml-1 inline-block" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/update-task/${encodeURIComponent(
                                                        tasks[selectedTask]
                                                            .title
                                                    )}`
                                                )
                                            }
                                            className="block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2">
                                            <span>Update</span>
                                            <PencilIcon className="h-5 w-5 ml-1 inline-block" />
                                        </button>
                                    </div>
                                )}
                            </Fragment>
                        ))}
                        {(sort === 0 && isFetching) ||
                            (sort === 1 && isFetchingTop && <Loading />)}
                    </div>
                    <Hints keyActions={keyActions} />
                </>
            )}
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
    showDate,
    strictDeadline,
    timeFrame,
    title,
    onClick,
}) => (
    <div
        ref={innerRef}
        className={
            (isSelected
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-800 border-gray-700') +
            ' block md:max-w-sm max-w-96 mx-auto border p-4 my-1 rounded drop-shadow-sm font-bold text-md text-center text-white'
        }
        onClick={onClick}>
        <span>{title}</span>
        {showDate && <DateTag due={due} />}
        <TimeFrame timeFrame={timeFrame} />
        <Repeat {...{ repeat, repeatInterval, repeatUnit }} />
        <Strict strictDeadline={strictDeadline} dueDate={due} />
    </div>
)

export default Tasks
