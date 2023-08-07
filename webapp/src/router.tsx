import { createBrowserRouter } from "react-router-dom"

import Auth from "./features/auth/Auth"
import Assistances from "./features/assistances/Assistances"
import CustomerAssistance from "./features/assistances/partials/CustomerAssistance"
import CustomerAssistanceEmpty from "./features/assistances/partials/CustomerAssistanceEmpty"
import ChallegeForm from "./features/auth/partials/ChallengeForm"
import LoginForm from "./features/auth/partials/LoginForm"

// defining routes
export default createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    children: [
      {
        path: "",
        element: <LoginForm />
      },
      {
        path: "new-password-challenge",
        element: <ChallegeForm />
      }
    ]
  },
  {
    path: "/assistances",
    element: <Assistances />,
    children: [
      {
        path: "",
        element: <CustomerAssistanceEmpty />
      },
      {
        path: ":PartitionKey",
        element: <CustomerAssistance />
      }
    ]
  }
])