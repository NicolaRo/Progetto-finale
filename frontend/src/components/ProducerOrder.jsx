import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProducerOrderCard from "./ProducerOrderCard";

function ProducerOrder({ orders, setRefresh }) {
  const [containerSelections, setContainerSelections] = useState({});
  const { token, user } = useContext(AuthContext);
  const [showClosed, setShowClosed] = useState(false);

  if (!orders || !Array.isArray(orders)) return null;

  //divide orders per status new orders goes on top, closed orders into a collapsable

  const newOrders = orders.filter((o) => o.status === "Order created");
  const preparingOrders = orders.filter((o) => o.status === "Preparing order");
  const shippedOrder = orders.filter((o) => o.status === "Order shipped");
  const closedOrders = orders
    .filter((o) => o.status === "Order closed")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

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

    if (!response.ok)
      return alert("Could not update order state, please try later.");

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

  const renderCards = (orderList) =>
    orderList.map((order) => (
      <ProducerOrderCard
        key={order._id}
        user={user}
        order={order}
        containerSelections={containerSelections}
        handleContainerChange={handleContainerChange}
        handlePackedProduct={handlePackedProduct}
        handleContainerCheckin={handleContainerCheckin}
      />
    ));

  return (
    <div className="orders-container">
      <h3 className="component-title">Orders list</h3>
      {/* NEW ORDERS */}
      {newOrders.length > 0 && (
        <div className="producer-order-section">
          <h4> New orders:</h4>
          {renderCards(newOrders)}
        </div>
      )}
      {/* PREPARING ORDERS */}
      {preparingOrders.length > 0 && (
        <div className="producer-orders-section">
          <h4>Preparing orders:</h4>
          {renderCards(preparingOrders)}
        </div>
      )}

      {/* SHIPPED ORDERS */}
      {shippedOrder.length > 0 && (
        <div className="producer-orders-section">
          <h4>Shipped orders & waiting for containers return</h4>
          {renderCards(shippedOrder)}
        </div>
      )}

      {/* COLLAPSABLE CLOSED ORDERS */}
      <div className="producer-orders-section">
        <button
          className="toggle-orders-section"
          onClick={() => setShowClosed(!showClosed)}
        >
          {showClosed
            ? "Hide closed orders △"
            : `Show closed ordes ▼ (${closedOrders.length})`}
        </button>
        {showClosed && renderCards(closedOrders)}
      </div>
    </div>
  );
}

export default ProducerOrder;
