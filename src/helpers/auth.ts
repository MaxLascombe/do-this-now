import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth'
import store from '../store/store'

const EMAIL = 'maxlascombe@gmail.com'

export const handleSignIn = async (password: string) => {
  try {
    const { isSignedIn } = await signIn({ username: EMAIL, password })
    if (!isSignedIn) throw new Error('user is not signed in')
    console.log('user is signed in')
    store.dispatch({ type: 'changeAuthState', payload: 'authenticated' })
  } catch (error) {
    console.error('error signing in', error)
  }
}

export const handleSignOut = async () => {
  try {
    await signOut()
    store.dispatch({ type: 'logout' })
  } catch (e) {
    console.error('error signing out: ', e)
  }
}

export const currentAuthenticatedUser = async () => {
  try {
    await getCurrentUser()
    store.dispatch({ type: 'changeAuthState', payload: 'authenticated' })
  } catch (e: unknown) {
    console.error(e)
    store.dispatch({ type: 'logout' })
  }
}
