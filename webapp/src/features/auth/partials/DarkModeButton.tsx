import { SunIcon } from "@heroicons/react/24/outline"
import { MoonIcon } from "@heroicons/react/24/outline"
import { useAppDispatch } from "../../../hooks/storeHooks"
import { toggleDarkMode } from "../../layout/layoutSlice"

export default function DarkModeButton() {

  const dispatch = useAppDispatch()

  const toggleDark = () => dispatch(toggleDarkMode())

  return (
    <div className="fixed top-1/4 -right-1 z-3">
      <span className="relative inline-block rotate-90">
        <input type="checkbox" className="checkbox opacity-0 absolute" id="darkModeButtonOnAuth" onChange={toggleDark} />
        <label className="label bg-primary-400 dark:bg-white shadow cursor-pointer rounded-full flex justify-between items-center p-1 w-14 h-8" htmlFor="darkModeButtonOnAuth">
          <SunIcon className=" text-primary-300 w-5" />
          <MoonIcon className="text-white w-5" />
          <span className="ball bg-white dark:bg-primary-500 transition-all duration-500 rounded-full absolute top-[2px] left-[2px] dark:left-[22px] w-7 h-7"></span>
        </label>
      </span>
    </div>
  )
}