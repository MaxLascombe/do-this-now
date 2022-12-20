import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

import { dateString } from '../helpers/dates'

export const useQueryTasksTop = () => {
    const date = dateString(new Date())
    return useQuery(
        ['tasks-top', date],
        () => {
            return API.get('tasks', '/tasks/top', {
                queryStringParameters: {
                    date,
                },
            }).catch(console.error)
        },
        {
            refetchInterval: 1000 * 2,
            refetchIntervalInBackground: false,
        }
    )
}
