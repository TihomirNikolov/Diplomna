import { useEffect, useState } from "react";
import { FavouritesContext } from "./FavouritesContext";
import { FavouritesItem } from "./FavouritesTypes";
import axios from "axios";
import { authClient, baseProductsURL, getTokenObject } from "../../utilities";
import { useUser } from "../userContext";


export default function FavouritesProvider(props: any) {
    const [favourites, setFavourites] = useState<string[]>([])

    const { isAuthenticated, isUserLoaded } = useUser();

    async function fetchFavourites() {
        if (getTokenObject() != null) {
            if (getTokenObject() != null) {
                try {
                    var response = await authClient.get(`${baseProductsURL()}api/favourites`);
                    var data = response.data as string[];
                    setFavourites(data);
                }
                catch (error) {
                    setFavourites([]);
                }
            } else {
                setFavourites([]);
            }
        }
    }

    useEffect(() => {
        if(isAuthenticated && isUserLoaded){
            fetchFavourites();
        }
    }, [isAuthenticated])

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