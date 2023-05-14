import { useTranslation } from "react-i18next";
import { useTitle } from "../components";

export default function HomePage(){
    const { t } = useTranslation();
    useTitle(t('title.home'));

    return(
        <>
        </>
    )
}