import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CheckCircleIcon,
    MenuIcon,
    PlusCircleIcon,
} from '@heroicons/react/solid'

import { useQueryTaskDone } from './hooks/useQueryTaskDone'
import { useQueryTasksTop } from './hooks/useQueryTasksTop'
import useKeyAction from './hooks/useKeyAction'

import loginManager from './helpers/LoginManager'

import Hints from './components/hints'
import Loading from './components/loading'
import RequireAuth from './components/requireauth'
import TimeFrame from './components/timeframe'

const Home = () => {
    const [mainTask, setMainTask] = useState(0) // 0 - Math.min(2, tasks.length-1)
    const navigate = useNavigate()

    const { data, isLoading, refetch } = useQueryTasksTop()
    console.log({ isLoading, data })

    const tasks = data?.Items ?? []

    const mainTaskToShow = Math.min(mainTask, tasks.length - 1)
    const leftTask = mainTaskToShow === 0 ? 1 : 0
    const rightTask = mainTaskToShow === 2 ? 1 : 2

    const { mutate } = useQueryTaskDone()

    const completeTask = () => {
        mutate(tasks[mainTaskToShow])
        setMainTask(0)
        refetch()
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
            (e) => {
                e.preventDefault()
                navigate('/new-task')
            },
        ],
        ['t', 'Tasks', () => navigate('/tasks')],
        ['1', 'Do left task', () => setMainTask(leftTask)],
        ['2', 'Do right task', () => setMainTask(rightTask)],
    ]
    useKeyAction(keyActions)

    return (
        <RequireAuth>
            <div className='h-screen flex flex-col justify-center'>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <div className='md:max-w-sm mx-5 md:mx-auto border border-gray-700 py-auto p-6 rounded bg-gray-800 drop-shadow-sm font-bold text-lg text-center text-white'>
                            {tasks.length > 0 ? (
                                <>
                                    <div>
                                        <span>
                                            {tasks[mainTaskToShow].title}
                                        </span>
                                        <TimeFrame
                                            timeFrame={
                                                tasks[mainTaskToShow].timeFrame
                                            }
                                        />
                                    </div>
                                    {/* <div className='mt-2'>
                                <button
                                    type='button'
                                    title='(Shortcut: d)'
                                    className='inline-flex items-center p-1 border border-transparent rounded shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'>
                                    <CheckCircleIcon
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                    />
                                </button>
                            </div> */}
                                </>
                            ) : (
                                'No tasks'
                            )}
                        </div>
                        <div className='pt-2 flex flex-row justify-center mx-5'>
                            <button
                                onClick={completeTask}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600'>
                                <span>Complete</span>
                                <CheckCircleIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                            <button
                                onClick={() => navigate('/tasks')}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                                <span>All tasks</span>
                                <MenuIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                            <button
                                onClick={() => navigate('/new-task')}
                                className='block p-2 bg-gray-800 border border-gray-700 rounded text-sm text-white hover:bg-gray-700 hover:border-gray-600 ml-2'>
                                <span>New task</span>
                                <PlusCircleIcon className='h-5 w-5 ml-1 inline-block' />
                            </button>
                        </div>
                        {tasks.length > 1 && (
                            <>
                                <div className='py-2 text-center text-gray-600'>
                                    or
                                </div>
                                <div className='flex flex-col md:flex-row justify-center mx-5'>
                                    <div
                                        onClick={() => setMainTask(leftTask)}
                                        title='(Shortcut: 1)'
                                        className='border mb-2 cursor-pointer border-gray-700 py-auto p-4 rounded bg-gray-800 drop-shadow-sm font-bold text-sm text-center md:mr-4 md:mb-0 opacity-20 text-white'>
                                        <span>{tasks[leftTask].title}</span>
                                        <TimeFrame
                                            timeFrame={
                                                tasks[leftTask].timeFrame
                                            }
                                        />
                                    </div>
                                    {tasks.length > 2 && (
                                        <div
                                            onClick={() =>
                                                setMainTask(rightTask)
                                            }
                                            title='(Shortcut: 2)'
                                            className='border cursor-pointer border-gray-700 py-auto p-4 rounded bg-gray-800 drop-shadow-sm font-bold text-sm text-center opacity-20 text-white'>
                                            <span>
                                                {tasks[rightTask].title}
                                            </span>
                                            <TimeFrame
                                                timeFrame={
                                                    tasks[rightTask].timeFrame
                                                }
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
