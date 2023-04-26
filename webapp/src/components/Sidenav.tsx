import { ChatBubbleLeftRightIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import LogoIcon from './LogoIcon'
import { useAppDispatch, useAppSelector } from '../hooks/storeHooks'
import { selectLoggedInUser, selectLogoutError, selectLogoutPending, signOut } from '../features/users/userSlice'
import { useEffect } from 'react'

export default function Sidenav() {

  const navigate = useNavigate()
  const loggedInUser = useAppSelector(selectLoggedInUser)
  const logoutPending = useAppSelector(selectLogoutPending)
  const logoutError = useAppSelector(selectLogoutError)
  const dispacth = useAppDispatch()

  useEffect(() => {
    if (!loggedInUser) navigate("/")
  }, [loggedInUser])

  useEffect(() => {
    if (logoutError) {
      console.log(logoutError)
      alert(logoutError.message)
    }
  }, [logoutError])

  const logout = () => {
    if (!logoutPending)
      dispacth(signOut())
  }

  return (
    <div className="w-[55px] bg-slate-300 flex flex-col py-3">
      <Link to="/" className="w-full p-2 pb-8 text-primary">

        {/* Placeholder logo */}
        <LogoIcon className="mx-auto h-10" />

      </Link>

      {/* menu options */}
      <ul className="grow">

        <li className="w-full text-primary bg-gradient-to-r from-transparent via-transparent to-slate-200 py-3">
          <Link to="/assistances">
            <ChatBubbleLeftRightIcon className="h-8 mx-auto" />
          </Link>
        </li>
      </ul>

      <ul>
        <li className="text-secondary hover:text-primary w-full text-center">
          <button className="w-full" onClick={logout}>
            <ArrowLeftOnRectangleIcon className="h-10 mx-auto" />
          </button>
        </li>
      </ul>
    </div>
  )
}