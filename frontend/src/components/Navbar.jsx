import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import GreenAssistantIcon from "../assets/assistant-icon.png";

import ShoppingCart from "../assets/shopping-cart.png";
import FullShoppingCart from "../assets/full-shopping-cart.png";
import LogoutIcon from "../assets/logout-icon.png";
import OrderIcon from "../assets/order-icon.png";

function Navbar({setShowCart, setShowOrders, showOrders, setShowGreenAssistant = () => {}}) {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <div className="account-container">
          <h4 className="account-name">
            {" "}
            {user ? `Benvenut@: ${user.name}` : "Caricamento..."}
          </h4>
          <div className="PP-container">
          <button
            className="btn-logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <img
              className="account-logout-icon"
              src={LogoutIcon}
              alt="log out"
            />
            log out
          </button>
      </div>
        </div>
        <div className="Navbar-btn-container">
        {user?.role === "User" && (
          <button className="cart-btn" onClick={() => setShowCart(true)}>
            <img
                className="cart-icon"
                src={cart.length > 0 ? FullShoppingCart : ShoppingCart}
                alt="Cart"
            />
          </button>
        )}

        {user?.role === "User" && (
            <button
                className="orders-btn "
                onClick={()=> setShowOrders(!showOrders)}>
                    <img
                        className="orders-icon"
                        src={OrderIcon}
                    />
                </button>
        )}

        {user?.role === "Producer" && (
          <>
          <button className="orders-btn" onClick={() => navigate("/orders")}>
            <img className="orders-icon" src={OrderIcon} alt="Orders" />
          </button>
          <button className="green-assistant-btn" onClick={() => setShowGreenAssistant(true)}>
            <img className="green-assistant-icon" src={GreenAssistantIcon} alt="Green Assistant" /></button>
          </>
          
        )}
        </div>

      </div>
    </>
  );
}

export default Navbar;
