import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer className="flex flex-col mt-5 bg-white dark:bg-gray-800 text-black dark:text-white px-2 sm:px-0">
            <div className="grid grid-cols-2 sm:grid-cols-6 w-full py-5">
                <div className="col-start-1 sm:col-start-2">
                    <Link to='/'>
                        my site
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 w-full">
                <div className="col-start-1 sm:col-start-2">
                    <span className="font-bold">
                        За my site
                    </span>

                    <div className="flex flex-col py-5">
                        <Link to=''>За нас</Link>
                        <Link to=''>Общи условия</Link>
                        <Link to=''>Политика за поверителност</Link>
                    </div>
                </div>
                <div className="col-start-2 sm:col-start-4">
                    <span className="font-bold">
                        Контакти и помощ
                    </span>
                    <div className="flex flex-col py-5">
                        <Link to=''>Контакти</Link>
                        <Link to=''>Помощ</Link>
                        <Link to=''>Доставка</Link>
                    </div>
                </div>
            </div>
            <div className="grid sm:grid-cols-6 w-full pb-2">
                <div className="flex items-center justify-center col-start-1">
                    <div className="border py-1 px-2.5 rounded-full cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <FontAwesomeIcon icon={['fas', 'arrow-up']} />
                    </div>
                </div>
                <div className="col-start-2 col-span-4">
                    <div className="border-t">
                        <span>© 2023 - {new Date().getFullYear()} my site.</span>
                        <span> Всички права запазени.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}