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
  hasLoadedUser: boolean
}

const initialState: State = {
  authState: 'idle',
  hasLoadedUser: false,
}

type Action =
  | {
      type: 'logout'
    }
  | {
      type: 'changeAuthState'
      payload: AuthState
    }
  | {
      type: 'changeState'
      payload: Partial<State>
    }

const rootReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'logout':
      return { ...initialState, hasLoadedUser: true }
    case 'changeAuthState':
      return { ...state, hasLoadedUser: true, authState: action.payload }
    default:
      return { ...state, ...action.payload }
  }
}

export default rootReducer
