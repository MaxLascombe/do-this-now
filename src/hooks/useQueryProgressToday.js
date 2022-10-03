import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

import { dateString } from '../helpers/dates'

export const useQueryProgressToday = () => {
    const date = dateString(new Date())
    return useQuery(
        ['progress-today', date],
        () => {
            return API.get('tasks', '/tasks/progresstoday', {
                queryStringParameters: { date },
            })
        },
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }
    )
}
