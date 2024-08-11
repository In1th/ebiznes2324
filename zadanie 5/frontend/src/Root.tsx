import { Link } from "react-router-dom"
import { Products } from "./Products"
import { useCart } from "./useCart";

function Root() {

  const {items} = useCart();

  return (
    <>
      <nav>
          <Link to="/">EBiznes</Link>
        <Link to="cart">Cart {items.length}</Link>
      </nav>
      <Products/>
    </>
  )
}

export default Root
