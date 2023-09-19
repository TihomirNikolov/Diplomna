import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-5 flex flex-col bg-white px-2 text-black dark:bg-gray-800 dark:text-white sm:px-0">
      <div className="grid w-full grid-cols-2 py-5 sm:grid-cols-6">
        <div className="col-start-1 sm:col-start-2">
          <Link to="/">my site</Link>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 sm:grid-cols-6">
        <div className="col-start-1 sm:col-start-2">
          <span className="font-bold">{t("for")} my site</span>

          <div className="flex flex-col py-5">
            <Link to="">{t("aboutUs")}</Link>
            <Link to="">{t("generalTerms")}</Link>
            <Link to="">{t("privacyPolicy")}</Link>
          </div>
        </div>
        <div className="col-start-2 sm:col-start-4">
          <span className="font-bold">
            {t("contacts")} {t("and").toLowerCase()} {t("help").toLowerCase()}
          </span>
          <div className="flex flex-col py-5">
            <Link to="">{t("contacts")}</Link>
            <Link to="">{t("help")}</Link>
            <Link to="">{t("delivery")}</Link>
          </div>
        </div>
      </div>
      <div className="grid w-full pb-2 sm:grid-cols-6">
        <div className="col-start-1 flex items-center justify-center">
          <div
            className="cursor-pointer rounded-full border px-2.5 py-1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FontAwesomeIcon icon={["fas", "arrow-up"]} />
          </div>
        </div>
        <div className="col-span-4 col-start-2">
          <div className="border-t">
            <span>© 2023 - {new Date().getFullYear()} my site.</span>
            <span> {t("rightsReserved")}.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
