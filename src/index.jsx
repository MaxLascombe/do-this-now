import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Amplify } from '@aws-amplify/core'
import config from './aws-exports'
import reportWebVitals from './reportWebVitals'

import App from './App'
import store from './store/store'

import './index.css'

Amplify.configure({
    ...config,
})

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
