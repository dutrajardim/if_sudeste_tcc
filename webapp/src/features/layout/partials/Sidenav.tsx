import { useEffect } from 'react'
import { ChatBubbleLeftRightIcon, ArrowLeftOnRectangleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import LogoIcon from '../../../components/LogoIcon'
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHooks'
import { selectSignOutError, selectSignOutState } from '../../auth/authSlice'
import { selectIsDarkMode, toggleDarkMode } from '../layoutSlice'
import Hamburger from './Hamburger'
import { signOut } from '../../auth/asyncThunks'

export default function Sidenav() {

  const signOutState = useAppSelector(selectSignOutState)
  const signOutError = useAppSelector(selectSignOutError)
  const isDarkMode = useAppSelector(selectIsDarkMode)
  const dispacth = useAppDispatch()

  useEffect(() => { signOutState === 'rejected' && alert(signOutError.message) }, [signOutState])

  const logout = () => signOutState !== "pending" && dispacth(signOut())
  const toggleDarkModeHandler = () => dispacth(toggleDarkMode())

  return (
    <>
      <Hamburger className="absolute top-5 -right-12 w-6 text-secondary-500 md:hidden z-50" />
      {/* Placeholder logo */}
      <div className='w-full'>
        <Link to="/" className="sidenav__link">
          <LogoIcon className="sidenav__icon sidenav__icon--head" />
          <span className='sidenav__label truncate'>Studio L</span>
        </Link>
      </div>

      {/* menu options */}
      <ul className="grow w-full">
        <li>
          <Link to="/assistances" className='sidenav__link'>
            <ChatBubbleLeftRightIcon className="sidenav__icon" />
            <span className='sidenav__label'>Assistências</span>
          </Link>
        </li>
      </ul>

      <ul className='w-full'>
        <li>
          <button className="sidenav__link" onClick={toggleDarkModeHandler}>
            {isDarkMode ? (
              <>
                <MoonIcon className="sidenav__icon" />
                <span className='sidenav__label'>Escuro</span>
              </>
            ) : (
              <>
                <SunIcon className="sidenav__icon" />
                <span className='sidenav__label'>Claro</span>
              </>
            )}
          </button>
        </li>
        <li>
          <button className="sidenav__link" onClick={logout}>
            <ArrowLeftOnRectangleIcon className="sidenav__icon" />
            <span className='sidenav__label'>Sair</span>
          </button>
        </li>
      </ul>
    </>
  )
}