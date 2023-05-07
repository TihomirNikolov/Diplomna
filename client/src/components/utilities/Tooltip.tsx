import { ReactNode, useState } from "react"
import { notification } from "../../utilities";
import { useTranslation } from "react-i18next";

interface Props {
    text: string,
    children: ReactNode,
    position?: "top" | "left" | "bottom" | "right";
}

export default function Tooltip(props: Props) {
    const [showTooltip, setShowTooltip] = useState(false);

    const {t} = useTranslation();

    function getPositionClass() {
        switch (props.position) {
            case "top":
                return "bottom-full left-1/2 transform -translate-x-1/2 mb-1";
            case "left":
                return "right-full top-1/2 transform -translate-y-1/2 mr-1";
            case "right":
                return "left-full top-1/2 transform -translate-y-1/2 ml-1";
            default:
                return "top-full left-1/2 transform -translate-x-1/2 mt-1";
        }
    };

    function getWideClass() {
        if (props.text.length < 32) {
            return "w-12"
        }
        else if (props.text.length < 64) {
            return "w-24"
        }
        else if (props.text.length < 128) {
            return "w-48"
        }
        else {
            return "w-64"
        }
    }

    function copyTooltipText() {
        navigator.clipboard.writeText(props.text).then(() => {
            notification.success(t("tooltipCopied"), 'top-center')
        })
    }

    return (
        <div className="relative flex" onClick={() => copyTooltipText()}>
            <div
                className="inline-block cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}>
                {props.children}
            </div>
            {showTooltip && (
                <div className={`absolute ${getWideClass()} z-10 px-2 py-1 text-white bg-gray-800 dark:bg-gray-500 rounded-md text-sm ${getPositionClass()}`}>
                    {props.text}
                </div>
            )}
        </div>
    );
}