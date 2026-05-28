import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

import RemoveFromCartIcon from "../assets/remove-from-cart.png";
import ClearCartIcon from "../assets/clear-cart.png";
import ConfirmOrder from "../assets/confirm-order.png";

function Cart({ setShowCart }) {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);

  //Function to calculate Cart total
  const totalPrice = cart.reduce((accumulator, product) => {
    return accumulator + product.orderedQuantity * product.price;
  }, 0);

  //Fetch the cart to the backend
  const handleConfirmOrder = async () => {
    //console.log for debug
    console.log("user:", user);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user: user._id, products: cart }),
    });

    console.log(response);
    if (!response.ok)
      return alert("Your order can not be processed, try later");
    const orderData = await response.json();

    //API Call to Stripe
    const stripeResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({orderId: orderData._id}),
    });

    const {url} = await stripeResponse.json();
    alert("Order confirmed, please chek out your purchase");
    clearCart();
    window.location.href = url;
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setShowCart(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          
          <button className="btn-close-cart" onClick={() => setShowCart(false)}>Close</button>

          <div className="cart-list">
            <h3>Cart list:</h3>
            {cart.map((product) => (
              <div className="cart-items" key={product.product}>
                
                <div className="cart-item-details">
                  <img
                    className="cart-item-img"
                    src={`http://img.spoonacular.com/ingredients_100x100/${product.image}`}
                    alt={product.name}
                  />
                  <p className="cart-p-details"></p>
                  </div>

                    <div className="cart-item-qty">
                        <p className="cart-p-details"><strong>Quantity: </strong>{product.orderedQuantity}</p>
                    </div>

                    <div className="cart-item-name">
                        <p className="cart-p-details"><strong>Product: </strong>{product.name}</p>
                    </div>
                    
                    <div className="cart-item-producerName">
                        <p className="cart-p-details"><strong>Producer: </strong>{product.producerName}</p>
                    </div>

                

                <button
                  className="remove-from-cart-btn"
                  onClick={() => removeFromCart(product.product)}
                >
                  <img
                    className="remove-from-cart-icon"
                    src={RemoveFromCartIcon}
                    alt="Remove product from cart"
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-order-btn-container">
          <button className="clear-cart-btn" onClick={clearCart}>
            <img
              className="clear-cart-icon"
              src={ClearCartIcon}
              alt="Cleat Cart"
            />
            Clear cart
          </button>

          <button className="confirm-order-btn" onClick={handleConfirmOrder}>
            <img
              className="confirm-order-icon"
              src={ConfirmOrder}
              alt="Confirm Order"
            />
            Confirm order
          </button>
          
          </div>
          <div className="cart-total">
            {cart.length > 0 && (
              <h6 className="deposit-info">🌱 Refundable container deposit: 5,00€</h6>
            )}
          <h5>Order total: {totalPrice.toFixed(2)}€</h5>
          {cart.length > 0 && (
            <h3>Total due today: {(totalPrice + 5).toFixed(2)}€</h3>
          )}  
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
