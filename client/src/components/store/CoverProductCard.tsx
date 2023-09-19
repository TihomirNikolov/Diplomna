import { Link } from "react-router-dom";
import { CoverProduct, baseProductsURL } from "../../utilities";
import {
  useFavourites,
  useLanguage,
  useShoppingCart,
  useUser,
} from "../../contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ReviewRating from "./ReviewRating";
import { Image } from "../utilities";
import { t } from "i18next";

interface Props {
  product: CoverProduct;
}

export default function CoverProductCard(props: Props) {
  const [isFavourited, setIsFavourited] = useState<boolean>(false);

  const { addShoppingCartItem } = useShoppingCart();
  const { favouritesItems, addFavourite, removeFavourite } = useFavourites();

  const { language } = useLanguage();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    var isFavourite =
      favouritesItems.filter((item) => item == props.product.productUrl)
        .length > 0;
    setIsFavourited(isFavourite);
  }, [favouritesItems]);

  function changeFavourite(isFavourited: boolean) {
    if (isFavourited) {
      removeFavourite(props.product.productUrl);
      setIsFavourited(false);
    } else {
      addFavourite(props.product.productUrl);
      setIsFavourited(true);
    }
  }

  function onProductAdded(product: CoverProduct) {
    addShoppingCartItem({
      name: product.name,
      coverTags: product.coverTags,
      price: product.price,
      number: 1,
      imageUrl: product.coverImageUrl,
      productUrl: product.productUrl,
      productId: product.id,
      discount: product.discount,
      storeId: product.storeId,
      discountedPrice: product.discountedPrice,
    });
  }

  return (
    <div
      className="w-48 rounded border border-transparent 
                        bg-white p-2 text-black shadow-lg
                        hover:border-gray-500 dark:bg-darkBackground-800 dark:text-white"
    >
      <Link to={`/product/${props.product.productUrl}`}>
        <div>
          <div className="relative">
            <Image
              src={`${baseProductsURL()}${props.product.coverImageUrl}`}
              alt="product"
              className="h-full rounded-lg"
              title={
                props.product.name.find((name) => name.key == language.code)
                  ?.value
              }
            />
            {!props.product.isAvailable && (
              <div className="absolute -right-2 bottom-7 w-24 -rotate-45 rounded-lg bg-red-600 text-center">
                <span>{t("outOfStock")}</span>
              </div>
            )}
            {props.product.discount > 0 && (
              <div className="absolute -left-2 top-7 w-24 -rotate-45 rounded-lg bg-orange-600 text-center">
                <span>-{props.product.discount}%</span>
              </div>
            )}
            {props.product.isNew && (
              <div className="absolute right-1 top-1 w-12 rounded-lg bg-orange-600 text-center">
                <span>{t("newProduct")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between pt-2">
          <div className="flex gap-1">
            {props.product.rating.toFixed(1)}
            <ReviewRating rating={props.product.rating} />
          </div>
          <div className="flex gap-1">
            {isAuthenticated && (
              <FontAwesomeIcon
                icon={["fas", "heart"]}
                size="lg"
                className={`${
                  isFavourited == true ? "text-pink-500" : ""
                } hover:text-pink-600`}
                onClick={(event) => {
                  event.preventDefault();
                  changeFavourite(isFavourited);
                }}
              />
            )}
            {props.product.isAvailable && (
              <FontAwesomeIcon
                icon={["fas", "cart-shopping"]}
                size="lg"
                className="hover:text-orange-500"
                onClick={(event) => {
                  event.preventDefault();
                  onProductAdded(props.product);
                }}
              />
            )}
          </div>
        </div>
        <div className="mt-2 line-clamp-2">
          <span className="h-12">
            {
              props.product.name.find((name) => name.key == language.code)
                ?.value
            }
          </span>
        </div>
        <div>
          {props.product.coverTags
            .find((tag) => tag.key == language.code)
            ?.value.map((item, index) => {
              return (
                <div
                  key={index}
                  className="mt-2 flex h-6 overflow-hidden text-sm text-gray-400"
                >
                  <span>
                    {item.key} : {item.value}
                  </span>
                </div>
              );
            })}
        </div>
        <div>
          {props.product.discount > 0 ? (
            <div className="flex space-x-1">
              <span className="line-through decoration-red-600 decoration-2">
                {props.product.price.toFixed(2)} {t("lv")}
              </span>
              <span>
                {props.product.discountedPrice.toFixed(2)} {t("lv")}
              </span>
            </div>
          ) : (
            <>
              <span>
                {props.product.price.toFixed(2)} {t("lv")}
              </span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
