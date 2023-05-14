import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useTitle(title: string) {
    const { t } = useTranslation();

    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    }, [t])
}