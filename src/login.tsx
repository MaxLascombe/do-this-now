import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'wouter'
import { Button } from './components/button'
import { Input } from './components/input'
import { handleSignIn } from './helpers/auth'
import useKeyAction from './hooks/useKeyAction'
import { State } from './store/rootReducer'

const Login = () => {
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState<object>()
  // const [showNewPassword, setShowNewPassword] = useState(false)
  // const [newPassword, setNewPassword] = useState('')

  const authState = useSelector((state: State) => state.authState)

  const navigate = useLocation()[1]

  const login = () => {
    // if (showNewPassword) {
    //     .newPassword(user, newPassword)
    //     .then(() => {
    //       navigate('/')
    //     })
    //     .catch((e: Error) => {
    //       alert('e')
    //       console.error(e)
    //     })
    // } else {
    handleSignIn(password)
      .then((r: unknown) => {
        if (
          typeof r === 'object' &&
          r &&
          'challengeName' in r &&
          r.challengeName &&
          r.challengeName === 'NEW_PASSWORD_REQUIRED'
        ) {
          throw new Error('New password required')
          // setShowNewPassword(true)
          // setUser(r)
        } else {
          navigate('/')
        }
      })
      .catch((e: Error) => alert(e.message))
    // }
  }

  useKeyAction([
    {
      key: 'Enter',
      description: 'Submit login form',
      action: login,
    },
  ])

  if (authState === 'authenticated') return <Redirect to='/' />

  return (
    <div className='flex h-screen flex-col justify-center'>
      <div className='flex justify-center'>
        <label htmlFor='password' className='sr-only'>
          Password
        </label>
        <Input
          type='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      {/*
      {showNewPassword && (
        <div>
          <label htmlFor='newpassword'>Password</label>
          <Input
            type='password'
            id='newpassword'
            placeholder='New Password'
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
          />
        </div>
      )}
              */}
      <div className='mt-2 flex justify-center'>
        <Button icon={faArrowRight} onClick={login} text='Submit' />
      </div>
    </div>
  )
}

export default Login
