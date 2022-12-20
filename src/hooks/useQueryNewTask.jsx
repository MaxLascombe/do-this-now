import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import API from '@aws-amplify/api'

export const useQueryNewTask = () => {
    const navigate = useNavigate()
    return useMutation(
        task => {
            return API.post('tasks', '/tasks/new', { body: task }).catch(
                console.error
            )
        },
        { onSuccess: () => navigate('/tasks') }
    )
}
