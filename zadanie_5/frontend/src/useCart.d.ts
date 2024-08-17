import { Product } from "./types";
export declare const CartContext: import("react").Context<{
    cartItems: Product[];
    setCartItems: (_arr: Product[]) => void;
}>;
export declare const useCart: () => {
    items: Product[];
    total: number;
    addCartItem: (item: Product) => void;
    deleteItem: (id: string) => void;
    clearCart: () => void;
};
