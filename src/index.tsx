import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import {
  Persister,
  PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client'
import { Amplify } from 'aws-amplify'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import config from './amplifyconfiguration.json'

import App from './App'
import store from './store/store'

import { currentAuthenticatedUser } from './helpers/auth'
import './index.css'

Amplify.configure(config)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No root element found')

currentAuthenticatedUser()

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistQueryClientProvider
        persistOptions={{ persister: localStoragePersister as Persister }}
        client={queryClient}>
        <App />
      </PersistQueryClientProvider>
    </Provider>
  </React.StrictMode>
)
