import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "./types";
import { useCart } from "./useCart";

export const Products = () => {

    const [products, setProducts] = useState<Product[]>([]);

    const {addCartItem} = useCart();

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:1323/products', {
                headers: {
                    'Allow-Control-Allow-Origin': '*'
                }
            });
            const data = res.data as Product[];
            setProducts(data.toSorted((a, b) => a.Id.localeCompare(b.Id)));
        }

        fetchData();
    }, []);

    const onAddToCart = (product: Product) => {
        addCartItem(product);
        setProducts([
            ...products.filter(p => p.Id !== product.Id),
            {
                ...product,
                Quantity: product.Quantity - 1
            } as Product
        ].sort((a, b) => a.Id.localeCompare(b.Id)));
        alert('Product was added to the cart!');
    }

    return (
        <div id="products">
            {products.length ?
                products.map(product => (
                <div className="product" key={product.Id}>
                    <h3>{product.Name}</h3>
                    <p>{product.Description}</p>
                    <p className="last">{
                        product.Quantity === 0
                        ? 'Out of stock'
                        : `In stock: ${product.Quantity}`
                        }
                    </p>
                    <div>
                        <span>{product.Price.toFixed(2)} PLN</span>
                        <button
                            disabled={product.Quantity === 0}
                            onClick={() => onAddToCart(product)}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            ))
            : <div>Loading...</div>}
        </div>
    )
}