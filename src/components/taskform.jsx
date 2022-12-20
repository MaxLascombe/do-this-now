import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Switch } from '@headlessui/react'

const TaskForm = ({
    setIsTyping,
    titleState: [title, setTitle],
    dueMonthState: [dueMonth, setDueMonth],
    dueDayState: [dueDay, setDueDay],
    dueYearState: [dueYear, setDueYear],
    strictDeadlineState: [strictDeadline, setStrictDeadline],
    repeatState: [repeat, setRepeat],
    repeatIntervalState: [repeatInterval, setRepeatInterval],
    repeatUnitState: [repeatUnit, setRepeatUnit],
    selectedWeekDaysState: [selectedWeekDays, setSelectedWeekDays],
    timeFrameState: [timeFrame, setTimeFrame],
    subtasksState: [subtasks, setSubtasks],
    submitForm,
}) => {
    const [hasSubtasks, setHasSubtasks] = useState((subtasks?.length ?? 0) > 0)

    useEffect(() => {
        if (!selectedWeekDays) {
            setSelectedWeekDays(new Array(7).fill(false))
        }
    }, [selectedWeekDays, setSelectedWeekDays])

    const todayAtMidnight = () => {
        let date = new Date()
        date.setHours(0, 0, 0, 0)
        return date
    }

    const dayDiff = Math.round(
        (new Date(dueYear, dueMonth - 1, dueDay, 0, 0, 0, 0) -
            todayAtMidnight()) /
            (1000 * 60 * 60 * 24)
    )

    const dayDiffPhrase = () => {
        if (dayDiff < 0) {
            return `${Math.abs(dayDiff)} days ago`
        } else if (dayDiff === 0) {
            return 'today'
        } else if (dayDiff === 1) {
            return 'tomorrow'
        } else {
            return `in ${dayDiff} days`
        }
    }

    const updateDate = newDate => {
        setDueYear(newDate.getFullYear())
        setDueMonth(newDate.getMonth() + 1)
        setDueDay(newDate.getDate())
    }

    const decrementDate = () => {
        let newDate = new Date(dueYear, dueMonth - 1, dueDay - 1, 0, 0, 0)
        updateDate(newDate)
    }

    const incrementDate = () => {
        let newDate = new Date(dueYear, dueMonth - 1, dueDay + 1, 0, 0, 0)
        updateDate(newDate)
    }

    return (
        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="Title"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Title
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                        <input
                            type="text"
                            id="title"
                            placeholder="Do this thing"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            onFocus={() => setIsTyping(true)}
                            onBlur={() => setIsTyping(false)}
                            className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="due-date"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Due Date
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                        <button
                            className="border border-gray-700 bg-gray-800 text-white text-sm rounded p-2 inline-block hover:border-gray-600 hover:bg-gray-700 mr-3"
                            onClick={decrementDate}>
                            -
                        </button>
                        <input
                            type="number"
                            max={12}
                            min={1}
                            step={1}
                            name="due-month"
                            id="due-month"
                            placeholder="MM"
                            value={dueMonth}
                            onChange={e => setDueMonth(e.target.value)}
                            className="flex-1 mr-3 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded"
                        />
                        <input
                            type="number"
                            max={31}
                            min={1}
                            step={1}
                            name="due-day"
                            id="due-day"
                            placeholder="DD"
                            value={dueDay}
                            onChange={e => setDueDay(e.target.value)}
                            className="flex-1 mr-3 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded"
                        />
                        <input
                            type="number"
                            step={1}
                            name="due-year"
                            id="due-year"
                            placeholder="YYYY"
                            value={dueYear}
                            onChange={e => setDueYear(e.target.value)}
                            className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded mr-3"
                        />
                        <button
                            className="border border-gray-700 bg-gray-800 text-white text-sm rounded p-2 inline-block hover:border-gray-600 hover:bg-gray-700"
                            onClick={incrementDate}>
                            +
                        </button>
                    </div>
                    <div className="max-w-lg text-center text-gray-600 mt-1">
                        {format(
                            new Date(dueYear, dueMonth - 1, dueDay),
                            'EEEE, LLLL do, u'
                        )}{' '}
                        ({dayDiffPhrase()})
                    </div>
                </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="Strict Deadline"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Strict Deadline?
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Switch
                        checked={strictDeadline}
                        onChange={setStrictDeadline}
                        className={
                            (strictDeadline ? 'bg-blue-600' : 'bg-gray-200') +
                            ' relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }>
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={
                                (strictDeadline
                                    ? 'translate-x-5'
                                    : 'translate-x-0') +
                                ' pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            }
                        />
                    </Switch>
                </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="Repeat"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Repeat?
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                        <select
                            id="repeat"
                            name="repeat"
                            className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded pr-10"
                            value={repeat}
                            onChange={e => setRepeat(e.target.value)}>
                            {repeatOptions.map(option => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    {repeat === 'Custom' && (
                        <>
                            <div className="max-w-lg flex mt-3">
                                <div className="flex-1 text-sm py-2.5">
                                    Every:
                                </div>
                                <input
                                    type="number"
                                    step={1}
                                    min={1}
                                    value={repeatInterval}
                                    onChange={e =>
                                        setRepeatInterval(e.target.value)
                                    }
                                    className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded mr-3"
                                />
                                <select
                                    defaultValue={repeatUnit}
                                    onChange={e =>
                                        setRepeatUnit(e.target.value)
                                    }
                                    className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded pr-10">
                                    <option value="day">Days</option>
                                    <option value="week">Weeks</option>
                                    <option value="month">Months</option>
                                    <option value="year">Years</option>
                                </select>
                            </div>
                            {repeatUnit === 'week' && selectedWeekDays && (
                                <div className="pointer-events-auto max-w-lg flex mt-3">
                                    {selectedWeekDays.map((_, i) => (
                                        <div
                                            onClick={() =>
                                                setSelectedWeekDays([
                                                    ...selectedWeekDays.slice(
                                                        0,
                                                        i
                                                    ),
                                                    !selectedWeekDays[i],
                                                    ...selectedWeekDays.slice(
                                                        i + 1
                                                    ),
                                                ])
                                            }
                                            className={
                                                (i > 0 && 'ml-2') +
                                                (selectedWeekDays[i]
                                                    ? ' border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                                                    : ' border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700') +
                                                ' cursor-pointer flex-1 text-center text-xs font-bold border rounded p-2'
                                            }>
                                            {days[i]}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="Expected Time Frame"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Expected Time Frame
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex">
                        <input
                            type="number"
                            step={15}
                            min={15}
                            value={timeFrame}
                            onChange={e => setTimeFrame(e.target.value)}
                            className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded mr-3"
                        />
                        <div className="py-2.5 text-sm">mins</div>
                    </div>
                </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-700 sm:pt-5">
                <label
                    htmlFor="Subtasks"
                    className="block text-sm font-medium sm:mt-px sm:pt-2">
                    Subtasks
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex">
                        <Switch
                            checked={hasSubtasks}
                            onChange={e => {
                                if (
                                    !e &&
                                    subtasks.length > 0 &&
                                    !window.confirm(
                                        'Are you sure you want to remove all subtasks?'
                                    )
                                )
                                    return
                                if (!e) setSubtasks([])
                                else setSubtasks([{ done: false, title: '' }])
                                setHasSubtasks(e)
                            }}
                            className={
                                (hasSubtasks ? 'bg-blue-600' : 'bg-gray-200') +
                                ' relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }>
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={
                                    (hasSubtasks
                                        ? 'translate-x-5'
                                        : 'translate-x-0') +
                                    ' pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                }
                            />
                        </Switch>
                    </div>
                    {hasSubtasks && (
                        <>
                            {subtasks.map((subtask, i) => (
                                <div className="max-w-lg flex mt-3">
                                    <input
                                        type="text"
                                        value={subtask.title}
                                        onChange={e => {
                                            setSubtasks([
                                                ...subtasks.slice(0, i),
                                                {
                                                    ...subtask,
                                                    title: e.target.value,
                                                },
                                                ...subtasks.slice(i + 1),
                                            ])
                                        }}
                                        placeholder={`Subtask ${i + 1}`}
                                        className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded"
                                    />
                                </div>
                            ))}
                            <div className="max-w-lg flex mt-3">
                                <button
                                    onClick={() =>
                                        setSubtasks([
                                            ...subtasks,
                                            { done: false, title: '' },
                                        ])
                                    }
                                    className="flex-1 block w-full focus:ring-blue-500 focus:border-blue-500 min-w-0 sm:text-sm border border-gray-700 placeholder-gray-400 text-white bg-gray-800 w-full p-2.5 rounded">
                                    Add Subtask
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div
                onClick={submitForm}
                className="text-center sm:border-t sm:border-gray-700 pt-5 md:hidden">
                <button className="border border-gray-700 bg-gray-800 text-white text-sm rounded p-2 inline-block hover:border-gray-600 hover:bg-gray-700">
                    Submit
                </button>
            </div>
        </div>
    )
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const repeatOptions = [
    'No Repeat',
    'Daily',
    'Weekdays',
    'Weekly',
    'Monthly',
    'Yearly',
    'Custom',
]

export default TaskForm
