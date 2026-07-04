import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux';

import { LogoutIcon, AssistantIcon } from "./icons/Icons";
import ShoppingCart from "../assets/shopping-cart.png";
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
  const newOrdersCount = orders.filter(o => o.status === "Order created").length;
  const shippedOrdersCount = orders.filter((o) => o.status === "Order shipped" && o.containers.some((c)=> c.status === "Container busy")).length;

  return (
    <>
      <div className="navbar">
        <div className="account-container">
          <h4 className="account-name text-h1">
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
              <LogoutIcon className="account-logout-icon" size={16} />
              log out
            </button>
          </div>
        </div>
        <div className="Navbar-btn-container">
          {user?.role === "User" && (
            <div className="cart-btn-wrapper">
            <button className="cart-btn btn btn--rounded" onClick={() => setShowCart(true)}>
            <img
            className= "cart-icon"
            src = {ShoppingCart}
            alt = "shopping cart icon"
            />
            </button>
            {cart.length > 0 && <span className="cart-badge text-utility">{cart.length}</span>}
            </div>
          )}

          {user?.role === "User" && (
            <div className="order-btn-wrapper">
              <button
              className="orders-btn btn btn--rounded"
              onClick={() => setShowOrders(!showOrders)}
            >
              <img
              className = "order-icon"
              src = {OrderIconEmpty}
              alt = "order icon"
              />
            </button>
            {shippedOrdersCount > 0 && <span className="orders-badge text-utility">{shippedOrdersCount}</span>}
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
              className = "order-icon"
              src = {OrderIconEmpty}
              alt = "order icon"
            />
              </button>
              {newOrdersCount > 0 && <div className="orders-badge text-utility">{newOrdersCount}</div>}
            </div>
              
              <button
                className="green-assistant-btn btn btn--rounded"
                onClick={() => setShowGreenAssistant(true)}
              >
                <AssistantIcon className="green-assistant-icon" size={26} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
