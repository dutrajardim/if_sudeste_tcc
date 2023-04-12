import { useContext } from 'react'
import { HamburgerProps, TemplateContextType } from '../@types/template'
import { TemplateContext } from '../context/TemplateContext'

export default function Hamburger({ className, animate = true }: HamburgerProps) {

    const { isMenuOpen, toggleMenu } = useContext(TemplateContext) as TemplateContextType
    const classOpen = isMenuOpen && animate ? "open" : ""

    return (
        <button className={`hamburger ${classOpen} ${className}`} type="button" onClick={() => toggleMenu()}>
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
        </button>
    )
}