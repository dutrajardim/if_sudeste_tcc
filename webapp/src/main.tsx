import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Amplify, Cache } from 'aws-amplify'
import { AmazonAIPredictionsProvider, Predictions } from '@aws-amplify/predictions'

import router from './router'
import store from './store'
import awsExports from './aws-exports'
import './assets/styles/index.css'

// Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure(awsExports)
Predictions.addPluggable(new AmazonAIPredictionsProvider())
Cache.clear()

// rendering the app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>,
)
