type AuthState =
  | 'idle'
  | 'setup'
  | 'signIn'
  | 'signUp'
  | 'confirmSignIn'
  | 'confirmSignUp'
  | 'setupTotp'
  | 'forceNewPassword'
  | 'forgotPassword'
  | 'confirmResetPassword'
  | 'verifyUser'
  | 'confirmVerifyUser'
  | 'signOut'
  | 'authenticated'

export type State = {
  authState: AuthState
  hasLoadedAuth: boolean
}

const initialState: State = {
  authState: 'idle',
  hasLoadedAuth: false,
}

type Action =
  | {
      type: 'logout'
    }
  | {
      type: 'changeAuthState'
      payload: AuthState
    }

const rootReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'logout':
      return { ...initialState, hasLoadedAuth: true }
    case 'changeAuthState':
    default:
      return { ...state, hasLoadedAuth: true, authState: action.payload }
  }
}

export default rootReducer
