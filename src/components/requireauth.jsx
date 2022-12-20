import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { AuthState } from '@aws-amplify/ui-components'

import Loading from './loading'

const RequireAuth = ({ children }) => {
    const hasLoadedUser = useSelector(({ hasLoadedUser }) => hasLoadedUser)
    const authState = useSelector(({ authState }) => authState)

    if (!hasLoadedUser)
        return (
            <div className='h-screen flex flex-col justify-center'>
                <Loading />
            </div>
        )
    if (authState === AuthState.SignedIn) return <>{children}</>
    return <Navigate to='/login' />
}

export default RequireAuth
