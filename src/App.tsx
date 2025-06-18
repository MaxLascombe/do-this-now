import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'wouter'
import { Button } from './components/button'
import { Loading } from './components/loading'
import { handleSignOut } from './helpers/auth'
import History from './history'
import Home from './home'
import Login from './login'
import NewTask from './newtask'
import { State } from './store/rootReducer'
import Tasks from './tasks'
import UpdateTask from './updatetask'

const App = () => {
  const [showCommitId, setShowCommitId] = useState(false)
  const { hasLoadedAuth, authState } = useSelector((state: State) => state)

  return (
    <div className='w-100vw h-100vh bg-black'>
      {!hasLoadedAuth ? (
        <Loading />
      ) : authState !== 'authenticated' ? (
        <Login />
      ) : (
        <>
          <Switch>
            <Route path='/'>
              <Home />
            </Route>
            <Route path='/new-task'>
              <NewTask />
            </Route>
            <Route path='/tasks'>
              <Tasks />
            </Route>
            <Route path='/update-task/:id'>
              <UpdateTask />
            </Route>
            <Route path='/history'>
              <History />
            </Route>
            <Route>
              <Redirect to='/' />
            </Route>
          </Switch>
          <button
            onClick={() => setShowCommitId(x => !x)}
            className={`fixed bottom-0 left-0 max-w-full overflow-hidden overflow-ellipsis text-xs ${
              showCommitId ? 'text-gray-700' : 'text-transparent'
            }`}>
            {import.meta.env.VITE_COMMIT_ID}
          </button>
          <div className='fixed bottom-5 right-5'>
            <Button
              icon={faRightFromBracket}
              onClick={handleSignOut}
              text='Log out'
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
