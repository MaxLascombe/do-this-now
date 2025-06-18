import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react'
import { Button } from './components/button'
import { Input } from './components/input'
import { handleSignIn } from './helpers/auth'

const Login = () => {
  const passwordInputRef = useRef<HTMLInputElement>(null)
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (passwordInputRef.current?.value)
            handleSignIn(passwordInputRef.current.value).catch((e: Error) =>
              alert(e.message)
            )
        }}>
        <div className='max-w-lg'>
          <div className='flex justify-center'>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <Input
              type='password'
              id='password'
              placeholder='Password'
              ref={passwordInputRef}
            />
          </div>
          <div className='mt-2 flex justify-center'>
            <Button type='submit' icon={faArrowRight} text='Submit' />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
