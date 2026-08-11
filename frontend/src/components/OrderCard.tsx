import { useState } from "react";

import SealedContainer from "../assets/sealed-container-img.png";
import NonSealedContainer from "../assets/non-sealed-container-img.png";
import FreezerContainer from "../assets/freezer-container.png";
import { ContainerStatus } from "../services/containerService";

const CONTAINER_IMAGES: Record<string, string> = {
  Sealed: SealedContainer,
  "Non-Sealed": NonSealedContainer,
  "Freezer-Container": FreezerContainer,
};

interface OrderProductItem {
  product: {
    _id: string;
    name: string;
    price: number;
    unit: string;
    image?: string;
  };
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
  containerType?: string;    // dead field, never set by backend — see IMPROVEMENTS_BACKLOG.md
  containerQuantity?: number;
}

interface OrderCardProps {
  order: Order;
  variant?: string;
  onReturnContainers?: (containers: OrderContainer[]) => Promise<void>;
}

function OrderCard({ order, variant, onReturnContainers }: OrderCardProps) {
  const isCompleted = variant === "completed";
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className={`single-order-container ${isCompleted ? "completed" : ""}`}
      >
        <div className="order-user-details-container">
          <p className="text-label">
            <span className="text-emphasis">Customer:</span> {order.user.name}
          </p>
        </div>
        {order.containerType && CONTAINER_IMAGES[order.containerType] && (
          <div className="container-assigned-preview">
            <p className="text-label">
              <span className="text-emphasis">Container: </span>
            </p>
            <img
              className="container-type-img"
              src={CONTAINER_IMAGES[order.containerType]}
              alt={order.containerType}
            />
            <span className="badge-container-type text-utility">
              {order.containerType} x{order.containerQuantity}
            </span>
          </div>
        )}
        <div className="user-id-order-container">
          <p className="text-label">
            <span className="text-emphasis">Order Id:</span> {order._id}
          </p>
        </div>
        <div className="user-order-status-container">
          <p className="text-label">
            <span className="text-emphasis">Order Status:</span> {order.status}
          </p>
        </div>

        {order.products
          .filter((p) => p.product)
          .map((products) => (
            <div className="ordered-products" key={products.product._id}>
              {products.containerType && CONTAINER_IMAGES[products.containerType] && (
                <div className="container-assigned-preview">
                  <p className="text-label">
                    <span className="text-emphasis">Container: </span>
                  </p>
                  <img
                    className="container-type-img"
                    src={CONTAINER_IMAGES[products.containerType]}
                    alt={products.containerType}
                  />
                  <span className="badge-container-type text-utility">
                    {products.containerType} x{products.containerQuantity}
                  </span>
                </div>
              )}
              <div className="user-order-card-details">
                <div className="order-product-details-container">
                  <p className="text-label">
                    <span className="text-emphasis">Product:</span> {products.product.name}
                  </p>
                  {!isCompleted && (
                    <img
                      className="prod-order-preview"
                      src={`https://img.spoonacular.com/ingredients_100x100/${products.product.image}`}
                      alt={products.product.name}
                    />
                  )}
                </div>
                <div className="order-details-contianer">
                  <div className="order-producer-details-container">
                    <p className="text-label">
                      <span className="text-emphasis">Producer: </span>{products.producerId.name}
                    </p>
                  </div>

                  <div className="order-product-details-container">
                    <p className="text-label">
                      <span className="text-emphasis">Price: </span>{products.product.price}€
                    </p>
                  </div>

                  <div className="order-product-quantity-container">
                    <p className="text-label">
                      <span className="text-emphasis">Ordered Quantity: </span>
                      {products.orderedQuantity} {products.product.unit}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        {!isCompleted && order.status === "Order shipped" && (
          <div className="containers-return">
            <h4 className="text-h2">Order received?</h4>
            {order.containers.some((c) => c.status === "Container busy") ? (
              <div className="container-return-btn-container">
                <button
                  className="return-containers-btn btn btn--primary"
                  onClick={async () => {
                    await onReturnContainers(order.containers);
                    setShowModal(true);
                  }}
                >
                  Confirm receipt & return containers
                </button>
              </div>
            ) : (
              <p>All containers are returned! See you on the next order.</p>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Containers returned confirmation"
          >
            <h3 className="text-h2">Containers are on their way back!</h3>
            <p className="text-body">
              Congratulations - You contributed to reducing single-use plastic
              packaging. Your 5,00€ deposit will be refunded shortly
            </p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              Continue shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderCard;