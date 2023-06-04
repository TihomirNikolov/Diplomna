import { SetStateAction } from "react"

export interface Language {
    name: string,
    code: string,
    icon: string
}

export const Languages: Language[] = [
    {
        name: 'English',
        code: 'en',
        icon: 'gb'
    },
    {
        name: 'Български',
        code: 'bg',
        icon: 'bg'
    }
]

export type LanguageContextType = {
    language: Language,
    setLanguage: (language: SetStateAction<Language>) => void
}