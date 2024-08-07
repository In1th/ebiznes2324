import { Link } from "react-router-dom";
import { useCart } from "./useCart";
import axios from "axios";

export const Cart = () => {

    const { items, total, clearCart } = useCart();

    const onBuy = async () => {
        const res = await axios.post('http://localhost:1323/products', 
            {items}, {
            headers: {
                'Allow-Control-Allow-Origin': '*'
            }
        });

        if (res.status === 200) {
            clearCart();
            alert('Order was placed!');
        }
        else {
            alert('Something went wrong!');
        }
    }

    return (
        <>
            <nav>
                <Link to="/">EBiznes</Link>
                <Link to="cart">Cart {items.length}</Link>
            </nav>
            <div id="cart">
                <div>
                    <h1>Cart items</h1>
                    {items.length ? items.map(item => (
                        <div key={item.Id} className="item">
                            <h3>{item.Name}</h3>
                            <p style={{marginLeft: 'auto'}}>{item.Price.toPrecision(2)} PLN</p>
                            <p>x {item.Quantity}</p>
                            <p>= {(item.Price * item.Quantity).toPrecision(2)} PLN</p>
                        </div>
                    )) : <p>Cart is empty</p>}
                </div>
                <div id="checkout">
                    <b>Total: {total.toPrecision(2)} PLN</b>
                    <div style={{backgroundColor: 'var(--secondary)', height: '1px', width: '100%'}}/>
                    <div>
                        <button onClick={clearCart}>Clear cart</button>
                        <button disabled={items.length === 0} onClick={onBuy}>Pay & Order</button>
                    </div>
                </div>
            </div>
        </>
    );
}