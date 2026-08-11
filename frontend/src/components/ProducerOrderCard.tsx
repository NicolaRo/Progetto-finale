import ProPackedIcon from "../assets/pro-packed-icon.gif";

import SealedContainer from "../assets/sealed-container-img.png";
import NonSealedContainer from "../assets/non-sealed-container-img.png";
import FreezerContainer from "../assets/freezer-container.png";
import { User } from "../context/AuthContext";
import { ContainerStatus } from "../services/containerService";

const CONTAINER_IMAGES: Record<string, string> = {
  Sealed: SealedContainer,
  "Non-Sealed": NonSealedContainer,
  "Freezer-Container": FreezerContainer,
};

const CONTAINER_ICONS: Record<string, string> = {
  Sealed: "🔒",
  "Non-Sealed": "📦",
  "Freezer-Container": "🧊",
};

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
}

interface ContainerSelection {
  type?: string;
  quantity?: string;
}

type ContainerSelections = Record<string, Record<string, ContainerSelection>>;

interface ProducerOrderCardProps {
  order: Order;
  user: User | null;
  containerSelections: ContainerSelections;
  handleContainerChange: (productId: string, orderId: string, field: "type" | "quantity", value: string) => void;
  handlePackedProduct: (productId: string, orderId: string) => void;
  handleContainerCheckin: (orderId: string) => void;
}

function ProducerOrderCard({
  order,
  user,
  containerSelections,
  handleContainerChange,
  handlePackedProduct,
  handleContainerCheckin,
}: ProducerOrderCardProps) {
  if (!order) return null;

  return (
    <div className="single-order-container">
      {/* ORDER HEADER */}

      <div className="order-user-details-container">
        <p>Order ID: {order._id}</p>
        <p>Status: {order.status}</p>
        <p>Customer: {order.user?.name}</p>
      </div>

      {/* PRODUCTS + PACK */}
      {order.products
        ?.filter((p) => p.product)
        .map((p) => (
          <div key={p.product._id} className="ordered-products">
            <p>{p.product.name}</p>
            <p>Qty: {p.orderedQuantity}</p>

            {p.containerType && CONTAINER_IMAGES[p.containerType] && (
              <div className="container-assigned-preview">
                <p className="text-label">
                  <span className="text-emphasis">Container: </span>
                </p>
                <img
                  className="container-type-img"
                  src={CONTAINER_IMAGES[p.containerType]}
                  alt={p.containerType}
                />
                <p>
                  {p.containerType} x {p.containerQuantity}
                </p>
              </div>
            )}

            {(order.status === "Order created" ||
              order.status === "Preparing order") &&
              user?.role === "Producer" && (
                <>
                  {p.containerType ? (
                    <div className="containers-assigned">
                      <img
                        className="packed-product-icon"
                        src={ProPackedIcon}
                        alt="packed"
                      />
                      <p>This product is packed and ready for shipping.</p>
                    </div>
                  ) : (
                    <>
                      <div className="container-assign-btn">
                        <div className="container-select-row">
                          <span className="container-icon">
                            {CONTAINER_ICONS[
                              containerSelections?.[order._id]?.[p.product._id]
                                ?.type ?? ""
                            ] || "🧺"}
                          </span>
                          <select
                            className="dropdown text-label"
                            value={
                              containerSelections?.[order._id]?.[p.product._id]
                                ?.type || ""
                            }
                            onChange={(e) =>
                              handleContainerChange(
                                p.product._id,
                                order._id,
                                "type",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Container type...</option>
                            <option value="Sealed">Sealed</option>
                            <option value="Non-Sealed">Non-Sealed</option>
                            <option value="Freezer-Container">Freezer</option>
                          </select>
                        </div>

                        <select
                          className="dropdown text-label"
                          value={
                            containerSelections?.[order._id]?.[p.product._id]
                              ?.quantity || ""
                          }
                          onChange={(e) =>
                            handleContainerChange(
                              p.product._id,
                              order._id,
                              "quantity",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Qty...</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>

                        <button
                          className="btn-pack-product btn btn--primary"
                          onClick={() =>
                            handlePackedProduct(p.product._id, order._id)
                          }
                        >
                          Pack product
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
          </div>
        ))}

      {/* CHECKIN CONTAINERS*/}
      {order.status === "Order shipped" &&
        order.containers.length > 0 &&
        order.containers.every(
          (c) => c.status === "Container ready for collection"
        ) && (
          <div className="container-checkin-btn-container">
            <button
              className="btn-checkin-containers btn btn--primary"
              onClick={() => handleContainerCheckin(order._id)}
            >
              Check in containers and close the order
            </button>
          </div>

        )}
    </div>
  );
}

export default ProducerOrderCard;