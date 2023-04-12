import React, { useState } from 'react'
import { TemplateContextType, TemplateProviderProps } from '../@types/template'

export const TemplateContext = React.createContext<TemplateContextType | null>(null)

export default function TemplateProvider({ children }: TemplateProviderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [title, setTitle] = useState("")

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return <TemplateContext.Provider value={{ isMenuOpen, toggleMenu, title, setTitle }}>{children}</TemplateContext.Provider>
}