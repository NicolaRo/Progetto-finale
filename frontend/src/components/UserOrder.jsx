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

  const isCompleted = (order) => order.status === "Order shipped";

  const activeOrders = orders.filter((o) => !isCompleted(o));
  const completedOrders = orders.filter(isCompleted);

  return (
    <div className="orders-container">

      <h3>Open orders</h3>

      {activeOrders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          variant="active"
          onReturnContainers={handleReturnContainers}
        />
      ))}

      <h3>Completed orders</h3>

      {completedOrders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          variant="completed"
        />
      ))}

    </div>
  );
}

export default UserOrder;