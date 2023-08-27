import { useEffect, useState } from "react";

interface Props {
    text: string,
    className: string,
    onTextWritten?: (message: string) => void
}

export default function TypeWriter({ text, className, onTextWritten }: Props) {
    const [currentText, setCurrentText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, 50);

            return () => clearTimeout(timeout);
        }
        else{
            onTextWritten?.(text);
        }
    }, [currentIndex, text]);

    return <span className={className}>{currentText}</span>;
}