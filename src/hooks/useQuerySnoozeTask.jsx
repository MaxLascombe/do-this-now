import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQuerySnoozeTask = () => {
    return useMutation(
        ({ title }) => {
            return API.post('tasks', '/tasks/snooze', {
                body: {
                    title,
                },
            }).catch(console.error)
        }
        // { onSuccess: () => navigate('/tasks') }
    )
}
