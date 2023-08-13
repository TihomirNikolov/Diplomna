import { SliderSettings } from "@/utilities/settings"
import React, { useEffect, useRef, useState } from "react"
import Slider, { Settings } from "react-slick"
import { CoverProductCard } from "../store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CoverProduct } from "@/utilities"
import { IconName } from "@fortawesome/fontawesome-svg-core"
import { cn } from "@/lib/utils"

interface Props {
    products: CoverProduct[]
}

export default function ProductsCarousel({ products }: Props) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const sliderRef = useRef<Slider>(null)

    function beforeChange(prev: number, next: number) {
        setCurrentSlide(next);
    }

    return (
        <div className="relative">
            <Arrow icon="arrow-left" onClick={() => sliderRef.current?.slickPrev()}
                isDisabled={currentSlide == 0}
                className={`${currentSlide == 0 ? 'text-gray-600 dark:text-gray-600 border-gray-600 dark:border-gray-600' : ''}
                hidden md:block absolute -left-7 bottom-1/2`} />
            <Slider {...SliderSettings}
                ref={sliderRef}
                infinite={false}
                arrows={false}
                onEdge={() => console.log('edge')}
                beforeChange={beforeChange}
                customPaging={(i) =>
                    <FontAwesomeIcon icon={['fas', 'circle']}
                        className={`${i == currentSlide ? 'text-gray-400 dark:text-gray-700' : 'text-gray-200 dark:text-gray-500'}`}
                        size="sm" />}>
                {products.map((product, index) => {
                    return (
                        <React.Fragment key={index}>
                            <CoverProductCard product={product} />
                        </React.Fragment>
                    )
                })}
            </Slider>
            <Arrow icon="arrow-right" onClick={() => sliderRef.current?.slickNext()} isDisabled={currentSlide == products.length - Math.ceil(window.innerWidth / 320)}
                className={`${currentSlide == products.length - Math.ceil(window.innerWidth / 320)
                    ? 'text-gray-600 dark:text-gray-600 border-gray-600 dark:border-gray-600' : ''}
                hidden md:block absolute -right-7 bottom-1/2`} />
        </div>
    )
}

interface ArrowProps {
    icon: IconName,
    onClick: () => void,
    className?: string,
    isDisabled?: boolean
}

function Arrow({ icon, onClick, className, isDisabled }: ArrowProps) {

    return (
        <button onClick={onClick} disabled={isDisabled}
            className={cn('text-black border-black dark:text-white dark:border-white border rounded-lg px-1', className)}>
            <FontAwesomeIcon icon={['fas', icon]} />
        </button >
    )
}