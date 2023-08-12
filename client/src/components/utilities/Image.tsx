import { SyntheticEvent, useState } from "react"
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
    src: string
    title?: string,
    alt: string,
    className?: string,
    width?: string | number
}

export default function Image({ src: imgUrl, title, alt, className, width }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    return (
        <div className="relative">
            <Skeleton className={cn(`absolute w-full h-full ${!isLoading ? 'hidden' : ''}`)} />

            <img src={imgUrl} title={title}
                className={cn(`${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity ease-in-out duration-300'}`, className)}
                onLoad={() => setIsLoading(false)} alt={alt} />

        </div>
    )
}