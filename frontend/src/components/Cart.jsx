import { useContext} from "react";
import { CartContext } from "../context/CartContext";

import RemoveFromCartIcon from '../assets/remove-from-cart.png';
import ClearCartIcon from '../assets/clear-cart.png';

function Cart() { 

    const {cart, removeFromCart, clearCart} = useContext(CartContext);

    const totalPrice = cart.reduce((accumulator, product) => {
        return accumulator + (product.orderedQuantity * product.price);
    }, 0);


    return (
        <> 
            <div>
                {cart.map((product) => (
                    <div key={product.product}>
                        <p className="cart-p-details">{product.image}</p>
                        <p className="cart-p-details">{product.name}</p>
                        <p className="cart-p-details">{product.orderedQuantity}</p>
                        <p className="cart-p-details">{product.producerName}</p>
                        <button className="remove-from-cart-btn"
                    onClick={() => 
                        removeFromCart(product.product)
                    }>
                        <img className="remove-from-cart-icon"
                        src={RemoveFromCartIcon}
                        alt="Remove product from cart"/>
                    </button>
                    </div>
                ))}
            </div>
            <button className="clear-cart-btn"
                    onClick={clearCart}>
                        <img className="clear-cart-icon"
                        src={ClearCartIcon}
                        alt="Cleat Cart"/>
                    </button>
            <div className="cart-total">
                <h4>Total:{totalPrice}</h4>
            </div>
            
        </>
    );
}

export default Cart;