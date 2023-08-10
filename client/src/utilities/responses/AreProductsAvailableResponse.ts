
export default interface AreProductsAvailableResponse {
    isSuccessful: boolean,
    unavailableProducts: UnavailableProduct[]
}

export interface UnavailableProduct {
    productId: string,
    storeCount: number
}