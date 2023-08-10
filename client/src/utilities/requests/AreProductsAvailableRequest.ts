import { StoreProduct } from "../models/store/Product";

export default interface AreProductsAvailableRequest {
    storeProducts: StoreProduct[]
}