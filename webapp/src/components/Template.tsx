import { useContext, useEffect } from 'react'
import { ChartBarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline'

import Hamburger from "../components/Hamburger"
import { TemplateContextType, TemplateProps } from "../@types/template"
import { TemplateContext } from '../context/TemplateContext'

export default function Template({ children }: TemplateProps) {

  const { isMenuOpen, title, setTitle } = useContext(TemplateContext) as TemplateContextType

  useEffect(() => setTitle("Home"))

  return (
    <div className='grid grid-cols-1 md:grid-cols-[280px_1fr] grid-rows-[75px_1fr] min-h-screen'>

      {/* topbar */}
      <div className="flex px-5 justify-between items-center">
        <div className="flex items-center gap-5">
          <img src="./src/assets/images/logo-sm.png" alt="" className="h-8" />
          <img src="./src/assets/images/logo-dark.png" alt="" className="h-5" />
        </div>
        <Hamburger className="block md:hidden text-slate-700 hover:text-slate-500" />
      </div>

      <div className="hidden md:flex items-center px-5">
        <Hamburger animate={false} className="mt-2 text-slate-700 hover:text-slate-500" />
        <span className='px-6 text-2xl font-semibold'>{title}</span>
      </div>

      {/* left menu */}
      <LeftMenu />

      {/* content */}
      <div className={`min-h-full p-5 ${!isMenuOpen ? "col-span-2" : ""}`}>{children}</div>
    </div>
  )
}

function LeftMenu() {

  const { isMenuOpen } = useContext(TemplateContext) as TemplateContextType

  return (
    <div className={`bg-white ${isMenuOpen ? "absolute w-[280px] h-full md:flex md:relative" : "hidden"}`}>
      <ul className='flex flex-col gap-1 w-full px-8 pt-16 md:pt-3'>
        <li className="flex items-center gap-3 bg-slate-100 rounded-md px-5 py-2 text-blue-400">
          <ChartBarIcon className='h-4 w-4' />
          <span className='text-sm'>Dashboard</span>
        </li>
        <li className="flex items-center gap-3  rounded-md px-5 py-2 ">
          <BuildingStorefrontIcon className='h-4 w-4' />
          <span className='text-sm'>Store</span>
        </li>
      </ul>
    </div>
  )
}