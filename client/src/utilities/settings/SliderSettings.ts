import { ResponsiveObject, Settings } from "react-slick";

const SliderResponsiveSettings: ResponsiveObject[] = [
    {
        breakpoint: 3840,
        settings: {
            slidesToShow: 12
        }
    },
    {
        breakpoint: 3520,
        settings: {
            slidesToShow: 11
        }
    },
    {
        breakpoint: 3200,
        settings: {
            slidesToShow: 10
        }
    },
    {
        breakpoint: 2880,
        settings: {
            slidesToShow: 9
        }
    },
    {
        breakpoint: 2560,
        settings: {
            slidesToShow: 8
        }
    },
    {
        breakpoint: 2240,
        settings: {
            slidesToShow: 7
        }
    },
    {
        breakpoint: 1920,
        settings: {
            slidesToShow: 6
        }
    },
    {
        breakpoint: 1600,
        settings: {
            slidesToShow: 5
        }
    },
    {
        breakpoint: 1280,
        settings: {
            slidesToShow: 4
        }
    },
    {
        breakpoint: 960,
        settings: {
            slidesToShow: 3
        }
    },
    {
        breakpoint: 640,
        settings: {
            slidesToShow: 2
        }
    },
    {
        breakpoint: 639,
        settings: {
            slidesToShow: 1,
            dots: false,
            centerMode: true,
            arrows: false,
        }
    },
    {
        breakpoint: 0,
        settings: {
            slidesToShow: 1
        }
    },
]

export const SliderSettings: Settings = {
    dots: true,
    responsive: SliderResponsiveSettings
}