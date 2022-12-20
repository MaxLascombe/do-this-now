import store from '../store/store'
import { Auth } from 'aws-amplify'
import { Hub /*, API*/ } from 'aws-amplify'
// import * as queries from '../graphql/queries'
import { AuthState } from '@aws-amplify/ui-components'

const EMAIL = 'maxlascombe@gmail.com'

class LoginManager {
    constructor() {
        this.loginState = 'signIn'

        this.signIn = (password) => Auth.signIn(EMAIL, password)

        this.newPassword = (user, password) => {
            return Auth.completeNewPassword(user, password)
        }

        this.signOut = () => {
            try {
                return Auth.signOut()
            } catch (e) {
                console.error('error signing out: ', e)
            }
        }

        const listener = (data) => {
            switch (data.payload.event) {
                case 'signIn':
                    this.loadData()
                    store.dispatch({
                        type: 'changeAuthState',
                        payload: AuthState.SignedIn,
                    })
                    break
                case 'signUp':
                    store.dispatch({
                        type: 'changeAuthState',
                        payload: AuthState.ConfirmSignUp,
                    })
                    break
                case 'signIn_failure':
                    break
                case 'tokenRefresh':
                    break
                case 'tokenRefresh_failure':
                    break
                case 'configured':
                    this.loadData(Math.random())
                    break
                case 'signOut':
                    this.loadData()
                    break
                default:
                    break
            }
        }

        Hub.listen('auth', listener)
    }

    loadData(val = null) {
        Auth.currentAuthenticatedUser()
            .then((user) => {
                store.dispatch({
                    type: 'changeUserGroups',
                    payload:
                        user?.signInUserSession?.idToken?.payload?.[
                            'cognito:groups'
                        ],
                })
                return Auth.currentUserInfo()
            })
            .then((data) => {
                if (data !== null) {
                    this.formState = 'signedIn'
                    // API.graphql({query: queries.getUser, variables: {id: data.username}}).then(userData => {
                    //   if (userData.data.getUser?.hasOwnProperty('accounts'))
                    //     store.dispatch({type: 'changeAccounts', payload: userData.data.getUser.accounts.items})
                    //   if (userData.data.getUser?.consented)
                    //     store.dispatch({type: 'changeHasConsented', payload: true})
                    store.dispatch({ type: 'changeUser', payload: data })
                    // })
                } else {
                    store.dispatch({ type: 'logout' })
                    this.formState = 'signIn'
                }
            })
            .catch((e) => {
                store.dispatch({ type: 'logout' })
                this.formState = 'signIn'
            })
    }
}

const loginManager = new LoginManager()
loginManager.loadData()

export default loginManager
