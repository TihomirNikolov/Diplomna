import { useState } from "react";
import { FavouritesContext } from "./FavouritesContext";
import { FavouritesItem } from "./FavouritesTypes";
import axios from "axios";
import { authClient, baseProductsURL } from "../../utilities";


export default function FavouritesProvider(props: any) {
    const [favourites, setFavourites] = useState<string[]>([])

    function addFavourite(productUrl: string) {
        var items = [...favourites];

        var isFavourited = items.filter(item => item == productUrl).length > 0;

        if (!isFavourited) {
            try {
                var response = authClient.post(`${baseProductsURL()}api/favourites/add`, { productUrl: productUrl });
                items.push(productUrl);
                setFavourites(items);
            }
            catch (error) {
                if (axios.isAxiosError(error)) {

                }
            }
        }

    }

    function removeFavourite(productUrl: string) {
        var items = favourites.filter(item => item != productUrl);

        try {
            var response = authClient.delete(`${baseProductsURL()}api/favourites/remove/${productUrl}`);
            setFavourites(items);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
    }

    return (
        <FavouritesContext.Provider value={{
            favouritesItems: favourites, addFavourite: addFavourite,
            removeFavourite: removeFavourite, setFavourites: setFavourites
        }}>
            {props.children}
        </FavouritesContext.Provider>
    )
}