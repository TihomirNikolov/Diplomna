import { Link } from "react-router-dom"
import { CoverProduct, baseProductsURL } from "../../utilities"
import { useFavourites, useLanguage, useShoppingCart } from "../../contexts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import ReviewRating from "./ReviewRating"

interface Props {
    product: CoverProduct
}

export default function CoverProductCard(props: Props) {
    const [isFavourited, setIsFavourited] = useState<boolean>(false);

    const { addShoppingCartItem } = useShoppingCart();
    const { favouritesItems, addFavourite, removeFavourite } = useFavourites();

    const { language } = useLanguage();

    useEffect(() => {
        var isFavourite = favouritesItems.filter(item => item == props.product.productUrl).length > 0;
        setIsFavourited(isFavourite);
    }, [favouritesItems])


    function changeFavourite(isFavourited: boolean) {
        if (isFavourited) {
            removeFavourite(props.product.productUrl);
            setIsFavourited(false);
        }
        else {
            addFavourite(props.product.productUrl);
            setIsFavourited(true);
        }
    }

    function onProductAdded(product: CoverProduct) {
        addShoppingCartItem({
            name: product.name, coverTags: product.coverTags, price: product.price,
            number: 1, imageUrl: product.coverImageUrl, productUrl: product.productUrl, productId: product.id
        })
    }

    return (
        <div className="text-black dark:text-white bg-white dark:bg-darkBackground-800 
                        w-48 rounded shadow-lg p-2
                        border border-transparent hover:border-gray-500">
            <Link to={`/product/${props.product.productUrl}`}>
                <div>
                    <div className="">
                        <img src={`${baseProductsURL()}${props.product.coverImageUrl}`} alt="product" className="rounded-lg h-full"
                            title={props.product.name.find(name => name.key == language.code)?.value} />
                    </div>
                </div>
                <div className="flex justify-between pt-2">
                    <div className="flex gap-1">
                        {props.product.rating.toFixed(1)}
                        <ReviewRating rating={props.product.rating} />
                    </div>
                    <div className="flex gap-1">
                        <FontAwesomeIcon icon={['fas', 'heart']} size="lg"
                            className={`${isFavourited == true ? 'text-pink-500' : ''} hover:text-pink-600`}
                            onClick={((event) => {
                                event.preventDefault();
                                changeFavourite(isFavourited);
                            })} />
                        <FontAwesomeIcon icon={['fas', 'cart-shopping']} size="lg" className="hover:text-orange-500"
                            onClick={(event) => {
                                event.preventDefault();
                                onProductAdded(props.product);
                            }
                            } />
                    </div>
                </div>
                <div className="line-clamp-2 mt-2">
                    <span className="h-12">{props.product.name.find(name => name.key == language.code)?.value}</span>
                </div>
                <div>
                    {props.product.coverTags.find(tag => tag.key == language.code)?.value.map((item, index) => {
                        return (
                            <div key={index} className="mt-2 h-6 flex overflow-hidden text-sm text-gray-400">
                                <span>{item.key} : {item.value}</span>
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