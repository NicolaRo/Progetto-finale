import { useContext } from "react";
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

  const activeOrders = orders.filter((o) => !isCompleted(o));
  const completedOrders = orders.filter(isCompleted);

  return (
    <div className="user-orders-container">
      <div className="user-openOrders-container">
      <h3>Open orders</h3>
        {activeOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            variant="active"
            onReturnContainers={handleReturnContainers}
          />
        ))}
      </div>
      <div className="user-preparingOrders-container">
      <h3>Preparing orders</h3>
      {activeOrders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          variant="active"
          onReturnContainers={handleReturnContainers}
        />
      ))}
      </div>
    
      <div className="user-completedOrders-container">
        <h3>Completed orders</h3>

        {completedOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            variant="completed"
          />
        ))}
      </div>
      

    </div>
  );
}

export default UserOrder;