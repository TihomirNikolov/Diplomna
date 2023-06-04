import { useState } from "react";
import { Language } from ".";
import { LanguageContext } from "./LanguageContext";

const defaultLanguage: Language = {
    name: 'English',
    code: 'en',
    icon: 'uk'
}

export default function LanguageProvider(props: any) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    return (
        <LanguageContext.Provider value={{ language: language, setLanguage: setLanguage }}>
            {props.children}
        </LanguageContext.Provider>
    )
}