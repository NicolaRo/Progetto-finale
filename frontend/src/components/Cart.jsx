import {useContext} from "react";
import {useSelector, useDispatch} from 'react-redux';
import{removeFromCart, clearCart} from '../store/cartSlice';
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";

import { CloseIcon, TrashIcon, CheckIcon } from "../components/icons/Icons";

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
                        Quantity:{product.orderedQuantity}</p>
                    </div>
  
                    <div className="cart-item-name">
                      <p className="cart-p-details">
                        Product:{product.name}</p>
                    </div>
  
                    <div className="cart-item-producerName">
                      <p className="cart-p-details">
                        Producer:{product.producerName}</p>
                    </div>
                  </div>
  
                  <button
                    className="remove-from-cart-btn btn btn--destructive"
                    onClick={() => dispatch(removeFromCart(product.product))}
                  >
                    <CloseIcon className="remove-from-cart-icon" size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="cart-order-btn-container">
            <button className="clear-cart-btn btn btn--ghost" onClick= {()=> dispatch(clearCart())}>
            <TrashIcon className="clear-cart-icon" size={16} />
              Clear cart
            </button>

            <button 
              className="confirm-order-btn btn btn--primary" 
              onClick={handleConfirmOrder}
              disabled={isLoading}>

              <CheckIcon className="confirm-order-icon" size={16} />
              {isLoading ? "Processing..." : "Confirm order"}
            </button>
          </div>
          <div className="cart-total">
            {cart.length > 0 && (
              <p className="deposit-info">
                Refundable container deposit: 5,00€
              </p>
            )}
            <p className="order-total-text text-body">Order total: {totalPrice.toFixed(2)}€</p>
            {cart.length > 0 && (
              <p className="total-due-text">Total due today: {(totalPrice + 5).toFixed(2)}€</p>
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
