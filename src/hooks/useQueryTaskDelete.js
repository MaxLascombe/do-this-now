import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTaskDelete = () => {
    return useMutation(
        (task) => {
            return API.post('tasks', '/tasks/delete', { body: task })
        }
        // { onSuccess: () => navigate('/tasks') }
    )
}
