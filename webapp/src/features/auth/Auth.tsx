import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import LoadingBar from "../../components/LoadingBar"
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks"
import { selectAuthenticatedUser, selectChallengeName, selectSignInError, selectSignInState } from "./authSlice"
import DarkModeButton from "./partials/DarkModeButton"
import { selectIsDarkMode } from "../layout/layoutSlice"
import { getAuthenticatedUser } from "./asyncThunks/getAuthenticatedUser"
import { setDarkMode } from "../../helpers"


export default function Auth() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signInState = useAppSelector(selectSignInState)
  const signInError = useAppSelector(selectSignInError)
  const authenticatedUser = useAppSelector(selectAuthenticatedUser)
  const challengeName = useAppSelector(selectChallengeName)
  const isDarkMode = useAppSelector(selectIsDarkMode)


  // trying to get logged in user first time page load
  useEffect(() => { !authenticatedUser && dispatch(getAuthenticatedUser()) }, [])
  // if user is logged in, redirect to home page
  useEffect(() => { authenticatedUser && navigate("/assistances") }, [authenticatedUser])
  // if login error arises, alert it
  useEffect(() => { signInState === 'rejected' && alert(signInError.message) }, [signInState])
  // if new password required, redirect to challenge form
  useEffect(() => { challengeName == "NEW_PASSWORD_REQUIRED" && navigate("/new-password-challenge") }, [challengeName])
  // toggle darkMode as is set in state
  useEffect(() => { setDarkMode(isDarkMode) }, [isDarkMode])

  return (
    <section className="h-screen dark:bg-neutral-800">
      <DarkModeButton />
      <LoadingBar loading={signInState === 'pending'} />

      <div className="container h-full px-6 py-24 mx-auto">
        <div className="flex h-full flex-wrap items-center gap-6 justify-center lg:justify-between">

          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            {/* <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="w-full max-w-md-[400px] max-w-[600px]" alt="Phone image" /> */}
          </div>


          <div className="w-full md:w-8/12 lg:ml-6 lg:w-5/12">

            <Outlet />

          </div>
        </div>
      </div>
    </section>
  )
}