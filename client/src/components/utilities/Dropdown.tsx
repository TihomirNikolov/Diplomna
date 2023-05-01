import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Dropdown(props: any) {
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null)

    const location = useLocation();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [])

    useEffect(() => {
        setShowMenu(false);
    },[location])

    function handleClickOutside(event: any) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    }

    return (
        <div className="relative flex" ref={dropdownRef}>
            <div onClick={() => setShowMenu(!showMenu)}>
                {props.children[0]}
            </div>
            {showMenu && (
                <>
                    {props.children[1]}
                </>
            )}
        </div>
    )
}

function Header(props: any) {
    return (
        <>
            {props.children}
        </>
    )
}

function Item(props: any) {
    return (
        <div className="absolute z-10 mt-1 top-full right-0">
            {props.children}
        </div>
    )
}

Dropdown.Item = Item;
Dropdown.Header = Header;