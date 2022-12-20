import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryTaskDone = () => {
    return useMutation(
        task => {
            return API.post('tasks', '/tasks/done', {
                body: {
                    task,
                    date: `${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                    }-${new Date().getDate()}`,
                },
            }).catch(console.error)
        }
        // { onSuccess: () => navigate('/tasks') }
    )
}
