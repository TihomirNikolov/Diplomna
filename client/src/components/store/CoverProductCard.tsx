import { Link } from "react-router-dom"
import { CoverProduct } from "../../utilities"

import './css/CoverProductCard.css'

interface Props {
    product: CoverProduct
}

export default function CoverProductCard(props: Props) {

    return (
        <div className="text-black dark:text-white bg-white dark:bg-darkBackground-800 w-44 rounded shadow-lg p-2 border border-transparent hover:border-gray-500">
            <Link to={`/product/${props.product.productUrl}`}>
                <div>
                    <div className="">
                        <img src={props.product.coverImageUrl} alt="product" className="rounded-lg h-full" title={props.product.name} />
                    </div>
                </div>
                <div className="line-clamp mt-2">
                    <span className="h-12">{props.product.name}</span>
                </div>
                <div>
                    {Object.entries(props.product.coverTags).map(([key, value]) => {
                        return (
                            <div key={key} className="mt-2 h-6 flex overflow-hidden text-sm text-gray-400">
                                <span> {key} </span>
                                <span> : </span>
                                <span>{value}</span>
                            </div>)
                    })}
                </div>
                <div>
                    <span>{props.product.price}</span>
                </div>
            </Link>
        </div>
    )
}