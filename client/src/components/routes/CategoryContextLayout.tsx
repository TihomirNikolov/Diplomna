import { Outlet } from "react-router-dom";
import { CategoryProvider } from "../../contexts";

export default function CategoryContextLayout() {

    return (
        <CategoryProvider>
            <Outlet />
        </CategoryProvider>
    )
}