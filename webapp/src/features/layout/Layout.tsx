import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../hooks/storeHooks"
import { selectAuthenticatedUser } from "../auth/authSlice"
import Sidenav from "./partials/Sidenav"
import { selectIsDarkMode, selectIsLeftMenuOpen } from "./layoutSlice"
import { setDarkMode } from "../../helpers"

interface Props { }

export default function DashboardLayout({ children }: PropsWithChildren<Props>): JSX.Element {

  const navigate = useNavigate()

  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const isDarkMode = useAppSelector(selectIsDarkMode)
  const isMenuOpen = useAppSelector(selectIsLeftMenuOpen)

  useEffect(() => { (authenticatedUser === null) && navigate("/") }, [authenticatedUser])
  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  return (
    <div className="dashboard">

      {/* sidenav */}
      <div className={`sidenav ${isMenuOpen && 'sidenav--open'}`}>
        <Sidenav />
      </div>

      {/* content */}
      <div className="content">
        {children}
      </div>

    </div>
  )
}