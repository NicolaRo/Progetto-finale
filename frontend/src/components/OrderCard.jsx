import { useState } from "react";

import SealedContainer from "../assets/sealed-container-img.png";
import NonSealedContainer from "../assets/non-sealed-container-img.png";
import FreezerContainer from "../assets/freezer-container.png";

const CONTAINER_IMAGES = {
  Sealed: SealedContainer,
  "Non-Sealed": NonSealedContainer,
  "Freezer-Container": FreezerContainer,
};

function OrderCard({ order, variant, onReturnContainers }) {
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
        {CONTAINER_IMAGES[order.containerType] && (
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
              {products.containerType} x{products.containerQuantity}
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
              {CONTAINER_IMAGES[products.containerType] && (
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
            <h4>Order received?</h4>
            {order.containers.some((c) => c.status === "Container busy") ? (
              <div className= "container-return-btn-container">
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
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Containers are on their way back!</h3>
            <p>
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
