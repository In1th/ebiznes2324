import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "./types";

export const CartContext = createContext({
    cartItems: [] as Product[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCartItems: (_arr: Product[]) => {}
});

export const useCart = () => {
    const {cartItems, setCartItems} = useContext(CartContext);
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        setTotalCost(cartItems.reduce((acc, pr) => acc + pr.Price * pr.Quantity, 0));
    }, [cartItems]);

    return {
        items: cartItems,
        total: totalCost,
        addCartItem: (item: Product) => {
            const itemInList = cartItems.find(it => it.Id === item.Id);
            if (itemInList){
                item.Quantity += itemInList.Quantity;
            }
            setCartItems([
                ...cartItems.filter(it => it.Id !== item.Id),
                {
                    ...item,
                    Quantity: 1
                } as Product
            ])
        },
        deleteItem: (id: string) => {
            setCartItems([...cartItems.filter(it => it.Id !== id)])
        },
        clearCart: () => setCartItems([])
    }
}