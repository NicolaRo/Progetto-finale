import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProducerOrderCard from "./ProducerOrderCard";

function ProducerOrder({ orders, setRefresh }) {
  const [containerSelections, setContainerSelections] = useState({});
  const { token, user } = useContext(AuthContext);

  if (!orders || !Array.isArray(orders)) return null;

  const handleContainerChange = (productId, orderId, field, value) => {
    setContainerSelections((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: {
          ...prev[orderId]?.[productId],
          [field]: value,
        },
      },
    }));
  };

  const handlePackedProduct = async (productId, orderId) => {
    if (
      !containerSelections[orderId]?.[productId]?.type ||
      !containerSelections[orderId]?.[productId]?.quantity
    ) {
      alert("Please select container type and quantity");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          containers: [
            {
              productId,
              type: containerSelections[orderId][productId].type,
              quantity: containerSelections[orderId][productId].quantity,
            },
          ],
        }),
      }
    );

    if (!response.ok) return alert("Could not update order state, please try later.");

    setRefresh((prev) => prev + 1);
  };

  const handleContainerCheckin = async (orderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Order closed" }),
        }
      );

      if (!response.ok) throw new Error();

      setRefresh((prev) => prev + 1);
    } catch {
      alert("Could not complete order, try later");
    }
  };

  return (
    <div className="orders-container">
      <h3 className="component-title">Orders list</h3>
      {orders.map((order) => (
        <ProducerOrderCard
          key={order._id}
          user={user}
          order={order}
          containerSelections={containerSelections}
          handleContainerChange={handleContainerChange}
          handlePackedProduct={handlePackedProduct}
          handleContainerCheckin={handleContainerCheckin}
        />
      ))}
    </div>
  );
}

export default ProducerOrder;