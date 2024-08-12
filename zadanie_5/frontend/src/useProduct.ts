import axios from "axios";
import { createContext, useContext } from "react";
import { Product } from "./types";

export const ProductsContext = createContext({
    products: [] as Product[],
});

export const useProduct = () => {
    const {products} = useContext(ProductsContext);
    return {
        products,
    }
}

export const getProducts = async () => {
    const res = await axios.get('http://localhost:1323/products', {
        headers: {
            'Allow-Control-Allow-Origin': '*'
        }
    });
    return res.data;
}