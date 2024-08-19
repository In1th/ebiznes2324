import { useEffect, useState, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import { Product } from "./types";
import { CartContext } from "./useCart";
import { Cart } from "./Cart";
import { getProducts, ProductsContext } from "./useProduct";

export const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root />
        },
        {
            path: 'cart',
            element: <Cart />
        }
    ])

    const [items, setItems] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getProducts();
            setProducts(data.products);
        }

        fetchData();
    }, []);

    const cartCtx = useMemo(() => ({ cartItems: items, setCartItems: setItems }), [items]);
    const productsCtx = useMemo(() => ({products}), [products]);

    return (
        <CartContext.Provider value={cartCtx}>
            <ProductsContext.Provider value={productsCtx}>
                <main>
                    <RouterProvider router={router} />
                </main>
            </ProductsContext.Provider>
        </CartContext.Provider>
    )
}