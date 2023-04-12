//@types.template.ts

import { ReactNode } from "react"

export type TemplateContextType = {
    isMenuOpen: boolean,
    toggleMenu: () => void
    title: string,
    setTitle: (title: string) => void
}

export type TemplateProviderProps = {
    children?: ReactNode
}

export type TemplateProps = {
    children?: ReactNode
}

interface HamburgerProps {
    className?: string,
    animate?: boolean
}