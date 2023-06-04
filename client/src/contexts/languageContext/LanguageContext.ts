import { SetStateAction, createContext, useContext } from "react";
import { Language, LanguageContextType,  } from "./LanguageTypes";

export const LanguageContext = createContext<LanguageContextType>({
    language: { code: '', icon: '', name: ''},
    setLanguage: (language: SetStateAction<Language>) => console.log(language)
})

export const useLanguage = () => useContext(LanguageContext)