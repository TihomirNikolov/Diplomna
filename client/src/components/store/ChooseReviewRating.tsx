import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Props{

}

export type ChooseReviewRatingHandle = {
    rating: number,
}

const ChooseReviewRating = forwardRef<ChooseReviewRatingHandle, Props>((props: Props, ref) => {

    useImperativeHandle(ref, () => ({
        rating: selectedStars
    }))

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [hoverStars, setHoverStars] = useState<number>(0);
    const [selectedStars, setSelctedStars] = useState<number>(0);

    return (
        <>
            {isHovered == true ?
                <div>
                    {new Array(hoverStars).fill(null).map((_, index) => {
                        return (
                            <FontAwesomeIcon key={index} icon={['fas', 'star']} className="text-yellow-500"
                                onMouseEnter={() => {
                                    setHoverStars(index + 1);
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    setHoverStars(0);
                                    setIsHovered(false);
                                }}
                                onClick={() => {
                                    setSelctedStars(index + 1);
                                }} />
                        )
                    })}
                    {new Array(5 - hoverStars).fill(null).map((_, index) => {
                        return (
                            <FontAwesomeIcon key={hoverStars + index} icon={['fas', 'star']} className="text-gray-500"
                                onMouseEnter={() => {
                                    setHoverStars(hoverStars + index + 1);
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    setHoverStars(0);
                                    setIsHovered(false);
                                }}
                                onClick={() => {
                                    setSelctedStars(index + 1);
                                }} />
                        )
                    })}
                </div>
                :
                <div>
                    {new Array(selectedStars).fill(null).map((_, index) => {
                        return (
                            <FontAwesomeIcon key={index} icon={['fas', 'star']} className="text-yellow-500"
                                onMouseEnter={() => {
                                    setHoverStars(hoverStars + index + 1);
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    setHoverStars(0);
                                    setIsHovered(false);
                                }}
                                onClick={() => {
                                    setSelctedStars(index + 1);
                                }} />
                        )
                    })}
                    {new Array(5 - selectedStars).fill(null).map((_, index) => {
                        return (
                            <FontAwesomeIcon key={selectedStars + index} icon={['fas', 'star']} className="text-gray-500"
                                onMouseEnter={() => {
                                    setHoverStars(selectedStars + index + 1);
                                    setIsHovered(true);
                                }}
                                onMouseLeave={() => {
                                    setHoverStars(0);
                                    setIsHovered(false);
                                }}
                                onClick={() => {
                                    setSelctedStars(index + 1);
                                }} />
                        )
                    })}
                </div>
            }
        </>
    )
})

export default ChooseReviewRating