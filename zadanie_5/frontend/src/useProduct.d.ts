import { Product } from "./types";
export declare const ProductsContext: import("react").Context<{
    products: Product[];
}>;
export declare const useProduct: () => {
    products: Product[];
};
export declare const getProducts: () => Promise<any>;
