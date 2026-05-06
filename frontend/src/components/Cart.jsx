import { useContext} from "react";
import { CartContext } from "../context/CartContext";

function Cart() { 

    const {cart} = useContext(CartContext);

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
                    </div>
                ))}
            </div>
            <div className="cart-total">
                <h4>Total:{totalPrice}</h4>
            </div>
        </>
    );
}

export default Cart;