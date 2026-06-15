import { useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { updateContainerStatus } from "../services/containerService";
import OrderCard from "./OrderCard";

import ShippingIcon from '../assets/shipping-order.gif';

function UserOrder({ orders, setRefresh }) {
  const { token } = useContext(AuthContext);

  const [modalDismissed, setModalDismissed] = useState (false);

  const handleReturnContainers = async (containers) => {
    try {
      for (const container of containers) {
        await updateContainerStatus(
          container._id,
          "Container ready for collection",
          token
        );
      }
      setRefresh((prev) => prev + 1);
    } catch {
      alert("Could not update container status");
    }
  };

  const isCompleted = (order) => order.status === "Order closed";
  const isShipped = (order) => order.status === "Order shipped";
  const isPreparing = (order) => order.status === "Preparing order";
  const isCreated = (order) => order.status === "Order created";
  
  const shippedOrderForModal = !modalDismissed && orders.find(o=> o.status === "Order shipped");

  const createdOrders = orders.filter(isCreated);
  const preparingOrders = orders.filter(isPreparing);
  const shippedOrders = orders.filter(isShipped);
  const completedOrders = orders.filter(isCompleted);
  
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <div className="user-orders-container">
      <div className="user-openOrders-container">
        <h3>Open orders</h3>
        {createdOrders.map((order) => (
          <OrderCard key={order._id} order={order} variant="active" onReturnContainers={handleReturnContainers} />
        ))}
      </div>

      <div className="user-preparingOrders-container">
        <h3>Preparing orders</h3>
        {preparingOrders.map((order) => (
          <OrderCard key={order._id} order={order} variant="active" onReturnContainers={handleReturnContainers} />
        ))}
      </div>

      <div className="user-shippedOrders-container">
        <h3>Shipped orders</h3>
        <img className="delivering-icon"
        src={ShippingIcon}
        alt="shipping products"
        />
        
        {shippedOrders.map((order) => (
          <OrderCard key={order._id} order={order} variant="active" onReturnContainers={handleReturnContainers}
           />
        ))}
        
      </div>

      <div className="user-completedOrders-container">
        <h3>Completed orders</h3>
        <button
          className="toggle-btn-completed-orders"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? "Reduce completed orders △" : "Expand completed orders ▼"}
        </button>
        {showCompleted && completedOrders.map((order) => (
          <OrderCard key={order._id} order={order} variant="completed" />
        ))}
      </div>
      {shippedOrderForModal && (
    <div className="modal-overlay" onClick={() => {}}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <h3>Your order is on its way!</h3>
      <p>Once you receive it, tap <strong>"Confirm receipt & return containers"</strong> so we can reuse them.</p>
      <p>This way doing the grocery won't pollute with single-use packaging.</p>
      <button className="modal-btn" onClick={() => setModalDismissed(true)}>
        Got it
      </button>
    </div>
  </div>
)}
    </div>
    
  );
}

export default UserOrder;