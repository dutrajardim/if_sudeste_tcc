import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { selectIsLeftMenuOpen, toggleLeftMenu } from "../layoutSlice"

interface Props {
  className?: string
}

export default function Hamburger({ className }: Props): JSX.Element {

  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsLeftMenuOpen)
  const activeModifier = isOpen ? 'hamburger--active' : ''

  const strokeUnits = 5
  const linecap = "round"

  return (
    <svg viewBox='0 0 40 40'
      className={`hamburger ${activeModifier} ${className}`}
      onClick={() => dispatch(toggleLeftMenu())}>

      <path d='M 4, 8 H 36'
        stroke='currentColor'
        strokeWidth={strokeUnits}
        strokeLinecap={linecap}
        strokeDasharray='20 9'
        className='hamburger__top-line' />

      <path d='M 4,20 H 36'
        stroke='currentColor'
        strokeWidth={strokeUnits}
        strokeLinecap={linecap}
        className='hamburger__middle-line' />

      <path d='M 4,32 H 36'
        stroke='currentColor'
        strokeWidth={strokeUnits}
        strokeLinecap={linecap}
        strokeDasharray='5 9 25'
        className='hamburger__bottom-line' />

    </svg>
  )
}