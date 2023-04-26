import { createBrowserRouter } from "react-router-dom"

import LoginPage from "./features/users/LoginPage"
import Assistances from "./features/assistances/Assistances"
import Messages from "./features/assistances/Messages"

// defining routes
export default createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    path: "/assistances",
    element: <Assistances />,
    children: [
      {
        path: ":PartitionKey",
        element: <Messages />
      }
    ]
  }
])