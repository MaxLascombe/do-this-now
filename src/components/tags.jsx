import {
    CalendarIcon,
    ClockIcon,
    ExclamationCircleIcon,
    RefreshIcon,
} from '@heroicons/react/solid'
import { format } from 'date-fns'

import { newSafeDate } from '../helpers/dates'

const Tag = ({ color, icon, text }) => {
    const IconComponent = icon
    return (
        <span
            className={`${
                color ?? 'text-white'
            } inline-block text-xs bg-white bg-opacity-20 rounded p-1 px-1.5 ml-2`}>
            <IconComponent className='h-3.5 inline-block mr-1' />
            <span>{text}</span>
        </span>
    )
}

export const DateTag = ({ due }) => {
    try {
        const dueDate = new Date(due)
        const today = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
        )
        const tomorrow = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 1,
            0,
            0,
            0
        )
        const yesterday = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 1,
            0,
            0,
            0
        )
        return (
            <Tag
                text={
                    dueDate - today === 0
                        ? 'Today'
                        : dueDate - tomorrow === 0
                        ? 'Tomorrow'
                        : dueDate - yesterday === 0
                        ? 'Yesterday'
                        : format(newSafeDate(due), 'iii LLL d')
                }
                icon={CalendarIcon}
            />
        )
    } catch (e) {
        console.error(e)
        return <></>
    }
}

export const TimeFrame = ({ timeFrame }) => {
    if (!timeFrame) return <></>
    const text =
        timeFrame < 60
            ? `${timeFrame} mins`
            : timeFrame / 60 === 1
            ? '1 hr'
            : `${timeFrame / 60} hrs`
    return <Tag icon={ClockIcon} text={text} />
}

export const Repeat = ({ repeat, repeatInterval, repeatUnit }) => {
    if (repeat === 'No Repeat') return <></>
    if (repeat === 'Custom')
        return (
            <Tag
                icon={RefreshIcon}
                text={`${repeatInterval} ${repeatUnit}${
                    repeatInterval !== 0 && 's'
                }`}
            />
        )
    return <Tag icon={RefreshIcon} text={repeat.toLowerCase()} />
}

export const Strict = ({ dueDate, strictDeadline }) => {
    if (!strictDeadline) return <></>
    try {
        return (
            <Tag
                icon={ExclamationCircleIcon}
                text='strict'
                color={
                    newSafeDate(dueDate) <
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        0,
                        0,
                        0
                    )
                        ? 'text-red-300'
                        : newSafeDate(dueDate) <=
                          new Date(
                              new Date().getFullYear(),
                              new Date().getMonth(),
                              new Date().getDate(),
                              0,
                              0,
                              0
                          )
                        ? 'text-orange-300'
                        : 'text-white'
                }
            />
        )
    } catch (e) {
        console.error(e)
        return <></>
    }
}
