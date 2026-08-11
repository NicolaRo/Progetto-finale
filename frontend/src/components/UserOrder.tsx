import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateContainerStatus, ContainerStatus } from "../services/containerService";
import OrderCard from "./OrderCard";

import ShippingIcon from '../assets/shipping-order.gif';

import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";

interface OrderProductItem {
  product: { _id: string; name: string; price: number; unit: string; image?: string };
  orderedQuantity: number;
  producerId: { _id: string; name: string };
  containerType?: string;
  containerQuantity?: number;
}

interface OrderContainer {
  _id: string;
  status: ContainerStatus;
}

interface Order {
  _id: string;
  user: { name: string };
  status: "Order created" | "Preparing order" | "Order shipped" | "Order closed";
  products: OrderProductItem[];
  containers: OrderContainer[];
}

interface UserOrderProps {
  orders: Order[];
  setRefresh: (updater: (prev: number) => number) => void;
}

function UserOrder({ orders, setRefresh }: UserOrderProps) {
  const { toast, notify, dismiss } = useToast();
  const { token } = useAuth();
  const [seenOrders, setSeenOrders] = useState<string[]>(() => {
    const saved = localStorage.getItem("seenOrders");
    return saved ? JSON.parse(saved) : [];
  });

  const handleReturnContainers = async (containers: OrderContainer[]) => {
    try {
      for (const container of containers) {
        await updateContainerStatus(
          container._id,
          "Container ready for collection",
          token as string
        );
      }
      setRefresh((prev) => prev + 1);
    } catch {
      notify("Could not update container status", "error");
    }
  };

  const isCompleted = (order: Order) => order.status === "Order closed";
  const isShipped = (order: Order) => order.status === "Order shipped";
  /*   const isPreparing = (order) => order.status === "Preparing order"; */
  const isCreated = (order: Order) => order.status === "Order created";

  const shippedOrderForModal = orders.find((o) => o.status === "Order shipped" && (!seenOrders.includes(o._id)) && o.containers.some((c) => c.status === "Container busy"));

  const createdOrders = orders.filter(isCreated);
  /*   const preparingOrders = orders.filter(isPreparing); */
  const shippedOrders = orders.filter(isShipped);
  const completedOrders = orders.filter(isCompleted);

  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <>
      <Toast toast={toast} />
      <div className="user-orders-container">
        <div className="user-openOrders-container">
          <h3 className="text-h2">Open orders</h3>
          {createdOrders.map((order) => (
            <OrderCard key={order._id} order={order} variant="active" onReturnContainers={handleReturnContainers} />
          ))}
        </div>

        <div className="user-shippedOrders-container">
          <h3 className="text-h2">Shipped orders</h3>
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
          <h3 className="text-h2">Completed orders</h3>
          <button
            className="toggle-btn-completed-orders btn btn--secondary"
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
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Order shipped notification"
            >
              <h3>Your order is on its way!</h3>
              <p>Once you receive it, tap <strong>"Confirm receipt & return containers"</strong> so we can reuse them.</p>
              <p>This way doing the grocery won't pollute with single-use packaging.</p>
              <button className="modal-btn" onClick={() => {
                const updated = [...seenOrders, shippedOrderForModal._id];
                setSeenOrders(updated);
                localStorage.setItem("seenOrders", JSON.stringify(updated));
              }}>
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserOrder;