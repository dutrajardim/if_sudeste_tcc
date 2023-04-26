import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify, Auth } from 'aws-amplify'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import router from './router'
import store from './store'
import './assets/styles/index.css'

// check if we are in development mode
// const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

// setting backend resources
Amplify.configure({
  Auth: {
    region: "sa-east-1",
    userPoolId: "sa-east-1_tKWj9R65x",
    userPoolWebClientId: "382jlpf4dogmnc95e2r897fbbr"
  },
  API: {
    endpoints: [
      {
        name: "AssistancesApi",
        // endpoint: development ? "http://localhost:3001" : "https://lded0lvxak.execute-api.sa-east-1.amazonaws.com/beta",
        endpoint: "https://lded0lvxak.execute-api.sa-east-1.amazonaws.com/beta",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      }
    ]
  }
})

// rendering the app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
