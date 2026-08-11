import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProducerOrderCard from "./ProducerOrderCard";

import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";
import { ContainerStatus } from "../services/containerService";

interface OrderProductItem {
  product: { _id: string; name: string };
  orderedQuantity: number;
  containerType?: string;
  containerQuantity?: number;
}

interface OrderContainer {
  _id: string;
  status: ContainerStatus;
}

interface Order {
  _id: string;
  user?: { name: string };
  status: "Order created" | "Preparing order" | "Order shipped" | "Order closed";
  products?: OrderProductItem[];
  containers: OrderContainer[];
  updatedAt: string;
}

interface ContainerSelection {
  type?: string;
  quantity?: string;
}

type ContainerSelections = Record<string, Record<string, ContainerSelection>>;

interface ProducerOrderProps {
  orders: Order[];
  setRefresh: (updater: (prev: number) => number) => void;
}

function ProducerOrder({ orders, setRefresh }: ProducerOrderProps) {
  const [containerSelections, setContainerSelections] = useState<ContainerSelections>({});
  const { token, user } = useAuth();
  const [showClosed, setShowClosed] = useState(false);
  const { toast, notify, dismiss } = useToast();

  if (!orders || !Array.isArray(orders)) return null;

  // divide orders per status new orders goes on top, closed orders into a collapsable

  const newOrders = orders.filter((o) => o.status === "Order created");
  const preparingOrders = orders.filter((o) => o.status === "Preparing order");
  const shippedOrder = orders.filter((o) => o.status === "Order shipped");
  const closedOrders = orders
    .filter((o) => o.status === "Order closed")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleContainerChange = (productId: string, orderId: string, field: "type" | "quantity", value: string) => {
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

  const handlePackedProduct = async (productId: string, orderId: string) => {
    if (
      !containerSelections[orderId]?.[productId]?.type ||
      !containerSelections[orderId]?.[productId]?.quantity
    ) {
      notify("Please select container type and quantity", "error");
      return;
    }
    try {
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

      if (!response.ok) {
        notify("Could not update order state, please try later.", "error");
        return;
      }

      setRefresh((prev) => prev + 1);
    } catch {
      notify("Could not update order state, please try later.", "error");
    }
  };

  const handleContainerCheckin = async (orderId: string) => {
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
      notify("Could not complete order, try later", "error");
    }
  };

  const renderCards = (orderList: Order[]) =>
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
    <>
      <Toast toast={toast} />
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
            className={`toggle-orders-section btn ${showClosed ? "btn--ghost" : "btn--primary"}`}
            onClick={() => setShowClosed(!showClosed)}
          >
            {showClosed
              ? "Hide closed orders △"
              : `Show closed ordes ▼ (${closedOrders.length})`}
          </button>
          {showClosed && renderCards(closedOrders)}
        </div>
      </div>
    </>

  );
}

export default ProducerOrder;