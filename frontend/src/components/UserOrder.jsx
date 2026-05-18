import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateContainerStatus } from "../services/containerService";
import OrderCard from "./OrderCard";

function UserOrder({ orders, setRefresh }) {
  const { token } = useContext(AuthContext);

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
        {shippedOrders.map((order) => (
          <OrderCard key={order._id} order={order} variant="active" onReturnContainers={handleReturnContainers} />
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
    </div>
  );
}

export default UserOrder;