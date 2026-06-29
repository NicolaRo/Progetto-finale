import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux';
import GreenAssistantIcon from "../assets/assistant-icon.png";

import ShoppingCart from "../assets/shopping-cart.png";
import LogoutIcon from "../assets/logout-icon.png";
import OrderIconEmpty from "../assets/empty-order-icon.png";

function Navbar({
  setShowCart,
  setShowOrders,
  showOrders,
  orders = [],
  setShowGreenAssistant = () => {},
}) {
  const cart = useSelector((state) => state.cart.items);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <div className="account-container">
          <h4 className="account-name">
            {" "}
            {user ? `Welcome, ${user.name}` : "Loading name..."}
          </h4>
          <div className="PP-container">
            <button
              className="btn-logout btn btn--ghost"
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
            <div className="cart-btn-wrapper">
            <button className="cart-btn btn btn--rounded" onClick={() => setShowCart(true)}>
              <img
                className="cart-icon"
                src={ShoppingCart}
                alt="Cart"
              />
            </button>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </div>
          )}

          {user?.role === "User" && (
            <div className="order-btn-wrapper">
              <button
              className="orders-btn btn btn--rounded"
              onClick={() => setShowOrders(!showOrders)}
            >
              <img
                className="orders-icon"
                src={OrderIconEmpty}
              />
            </button>
            <span className="orders-badge">{orders.filter(o => o.status === "Order shipped").length}</span>
            </div>
            
          )}

          {user?.role === "Producer" && (
            <>
            <div className="order-btn-wrapper">
            <button
                className="orders-btn btn btn--rounded"
                onClick={() => navigate("/orders")}
              >
                <img
                  className="orders-icon"
                  src={OrderIconEmpty
                  }
                />
              </button>
              <div className="orders-badge">{orders.filter(o => o.status === "Order created").length}</div>
            </div>
              
              <button
                className="green-assistant-btn btn btn--rounded"
                onClick={() => setShowGreenAssistant(true)}
              >
                <img
                  className="green-assistant-icon"
                  src={GreenAssistantIcon}
                  alt="Green Assistant"
                />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
