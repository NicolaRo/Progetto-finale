import {useContext} from "react";
import {useSelector, useDispatch} from 'react-redux';
import{removeFromCart, clearCart} from '../store/cartSlice';
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";

import RemoveFromCartIcon from "../assets/remove-from-cart.png";
import ClearCartIcon from "../assets/clear-cart.png";
import ConfirmOrder from "../assets/confirm-order.png";

function Cart({ setShowCart }) {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState (false);
  const[checkoutErrors, setCheckoutErrors] = useState(null);

  const { user, token } = useContext(AuthContext);

  //Function to calculate Cart total
  const totalPrice = cart.reduce((accumulator, product) => {
    return accumulator + product.orderedQuantity * product.price;
  }, 0);

  //Fetch the cart to the backend
  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true); //the button is disabled to avoid double click on it

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user: user._id, products: cart }),
    });
    
    console.log(response);

    if (!response.ok) {
      setIsLoading(false); //in case of error the button is enabled to allow retry
      return setCheckoutErrors({error: "Your order can not be processed, try later"});
    }
      
    const orderData = await response.json();
    
    //API Call to Stripe
    const stripeResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: orderData._id }),
      }
    );

    const { url } = await stripeResponse.json();
    dispatch(clearCart());
    window.location.href = url;

    } catch {
      setIsLoading(false);
      setCheckoutErrors({ error: "Your order can not be processed, try later" });
      setTimeout(() => setCheckoutErrors(null), 4500);
      return;
    }
  }
  return (
    <>
    
      <div className="cart-overlay" onClick={() => setShowCart(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <button className="btn-close-cart btn btn--destructive" onClick={() => setShowCart(false)}>
            Close
          </button>

          <div className="cart-list">
            <h3>Cart list:</h3>
            {cart.length === 0 ? (
              <div className = "empty-cart">
                <br></br>
                <p>Your cart is empty</p>
                <br></br>
                <p>Buy local for a greater sustainability</p>
              </div>
            ) : (
              cart.map((product) => (
                <div className="cart-items" key={product.product}>
                  <div className="cart-item-details">
                    <img
                      className="cart-item-img"
                      src={`https://img.spoonacular.com/ingredients_100x100/${product.image}`}
                      alt={product.name}
                    />
                    <p className="cart-p-details"></p>
                  </div>
                  <div className="cart-cards">
                    <div className="cart-item-qty">
                      <p className="cart-p-details">
                        <strong>Quantity: </strong>
                        {product.orderedQuantity}
                      </p>
                    </div>
  
                    <div className="cart-item-name">
                      <p className="cart-p-details">
                        <strong>Product: </strong>
                        {product.name}
                      </p>
                    </div>
  
                    <div className="cart-item-producerName">
                      <p className="cart-p-details">
                        <strong>Producer: </strong>
                        {product.producerName}
                      </p>
                    </div>
                  </div>
  
                  <button
                    className="remove-from-cart-btn btn btn--destructive"
                    onClick={() => dispatch(removeFromCart(product.product))}
                  >
                    <img
                      className="remove-from-cart-icon"
                      src={RemoveFromCartIcon}
                      alt="Remove product from cart"
                    />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="cart-order-btn-container">
            <button className="clear-cart-btn btn btn--ghost" onClick= {()=> dispatch(clearCart())}>
              <img
                className="clear-cart-icon"
                src={ClearCartIcon}
                alt="Cleat Cart"
              />
              Clear cart
            </button>

            <button 
              className="confirm-order-btn btn btn--primary" 
              onClick={handleConfirmOrder}
              disabled={isLoading}>
              <img
                className="confirm-order-icon"
                src={ConfirmOrder}
                alt="Confirm Order"
              />
              {isLoading ? "Processing..." : "Confirm order"}
            </button>
          </div>
          <div className="cart-total">
            {cart.length > 0 && (
              <h6 className="deposit-info">
                Refundable container deposit: 5,00€
              </h6>
            )}
            <h5>Order total: {totalPrice.toFixed(2)}€</h5>
            {cart.length > 0 && (
              <h3>Total due today: {(totalPrice + 5).toFixed(2)}€</h3>
            )}
          </div>
        </div>
      </div>

      {checkoutErrors && (
      <div className="checkout-error-banner">
        {checkoutErrors?.error && <span className="error-text">{checkoutErrors.error}</span>}
      </div>
    )}
    </>
  );
}

export default Cart;
