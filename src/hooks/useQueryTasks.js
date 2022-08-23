import { useQuery } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTasks = () =>
    useQuery(
        ['tasks'],
        () => {
            return API.get('tasks', '/tasks', {})
        },
        {
            refetchInterval: 1000 * 2,
            refetchIntervalInBackground: false,
        }
    )
