import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function EmployeeLayout(props: any) {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();

    const paths: { path: string, translate: string }[] = [
        { path: '/employee-panel/new-orders', translate: 'newOnes' },
        { path: '/employee-panel/nonfinished-orders', translate: 'nonFinished' },
        { path: '/employee-panel/finished-orders', translate: 'finished' },
        { path: '/employee-panel/cancelled-orders', translate: 'cancelledOnes' }
    ];


    function getDefaultPath(path: string) {
        var defPath: string = '';
        var slashCount = 0;
        for (var c of path) {
            if (slashCount == 3)
                break;
            if (c == '/')
                slashCount++;
            if (slashCount < 3)
                defPath += c;
        }

        var matchPath = paths.find(p => p.path.includes(defPath))
        
        return matchPath?.path;
    }

    return (
        <div className="md:grid md:grid-cols-12 text-black dark:text-white rounded-lg">
            <div className="col-start-3 col-span-8">
                <nav className="md:flex flex-col mt-5">
                    <Tabs defaultValue={getDefaultPath(location.pathname)}>
                        <TabsList className="w-full flex h-full flex-wrap">
                            {paths.map((path, index) => {
                                return <TabsTrigger key={index} value={path.path}
                                    className="p-2" onClick={() => navigate(path.path)}>
                                    {t(path.translate)}
                                </TabsTrigger>
                            })}
                        </TabsList>
                    </Tabs>
                </nav>
                <div className="md:col-span-8 rounded-lg">
                    {props.children}
                </div>
            </div>
        </div>
    )
}