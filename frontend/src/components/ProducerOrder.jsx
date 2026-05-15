import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateContainerStatus } from "../services/containerService";

function Order({ orders, setRefresh }) {
  const [containerSelections, setContainerSelections] = useState({});

  const { token, user } = useContext(AuthContext);

  const [packedProducts, setPackedProducts] = useState({});

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

  const handleShipOrder = async (orderId) => {
    if (!containerSelections[orderId]) {
      alert("Please select containers for all products first");
      return;
    }

    //console.log for debug
    console.log("orderId:", orderId);

    const containers = Object.entries(containerSelections[orderId]).map(
      ([productId, selection]) => ({
        productId,
        type: selection.type,
        quantity: selection.quantity,
      })
    );

    //console.log for debug
    console.log("containers:", containers);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Order shipped" }),
      }
    );
    if (!response.ok) return alert("Could not assign container, try later");
    await response.json();

    alert("Containers assigned to your products, order ready to ship.");

    setRefresh((prev) => prev + 1);
  };

  if (!orders || !Array.isArray(orders)) return null;

  //function to temporary store the product assigned with its container into a card before
  //Producer can confirm shipping
  const handlePackedProduct = async (productId, productData, orderId) => {
    //validate type and quantity must be selected
    if (
      !containerSelections[orderId]?.[productId]?.type ||
      !containerSelections[orderId]?.[productId]?.quantity
    ) {
      alert("Please select container type and quantity");
      return;
    }

    //Fetch Order status to update "Order created" -> "Preparing order"
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Preparing order",
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

    await response.json();

    alert("Updated order state: Preparing Order.");

    setPackedProducts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [productId]: {
          ...productData,
          containerType: containerSelections[orderId][productId].type,
          containerQuantity: containerSelections[orderId][productId].quantity,
        },
      },
    }));
    console.log(packedProducts);
    setRefresh((prev) => prev + 1);
  };

const handleContainerCheckin = async (containerId) => {
    
      try{
      await updateContainerStatus (
      containerId,
      "Container ready to use",
      token);

      setRefresh((prev) => prev + 1);

      alert("Containers successfully checked in");
      } catch {
       alert("Could not update container status, try later");
      }
  };

  return (
    <>
      <div className="orders-container">
        <h3 className="component-title">Orders list</h3>
        {orders.map((order) => (
          <div className="single-order-container" key={order._id}>
            {/*Console.log for debug*/}
            {order.products.map((p) =>
              console.log(
                "containers:",
                order.containers,
                "producerId:",
                p.producerId,
                "user._id:",
                user._id,
                "match:",
                p.producerId === user._id
              )
            )}

            <div className="order-user-details-container">
              <label htmlFor="order-user-detail">
                <strong>Customer: </strong>
              </label>
              <p>
                <strong>{order.user.name}</strong>, Id: {order.user._id}
              </p>
              <label htmlFor="order-user-detail">
                <strong>Order Id: </strong>
              </label>
              <p> {order._id}</p>
              <label htmlFor="order-status-detail">
                <strong>Order Status:</strong> {order.status}
              </label>
            </div>

            {order.status === "Preparing order" && (
              <button
                className="ship-order-btn"
                onClick={() => handleShipOrder(order._id)}
              >
                Ship order
              </button>
            )}
            {/*console log for debug */}
            {order.products.map((p) =>
              console.log("producerId:", p.producerId, "user._id:", user._id)
            )}

            {order.products
              .filter((p) =>
                user?.role === "Producer" ? p.producerId._id === user._id : true
              )
              .map((products) => {
                if (packedProducts[order._id]?.[products.product._id])
                  return null;
                return (
                  <div className="ordered-products" key={products.product._id}>
                    <div className="order-product-details-container">
                      <label htmlFor="order-product-detail">
                        <strong>Product: </strong>
                      </label>
                      <p>{products.product.name}</p>
                      <img
                        className="prod-order-preview"
                        src={`http://img.spoonacular.com/ingredients_100x100/${products.product.image}`}
                        alt={products.product.name}
                      />
                    </div>
                    <div className="order-producer-details-container">
                      <label htmlFor="order-producter-detail">
                        <strong>Producer: </strong>
                      </label>
                      <p>{products.producerId.name}</p>
                    </div>
                    <div className="order-product-details-container">
                      <label htmlFor="order-product-detail">
                        <strong>Price: </strong>
                      </label>
                      <p>{products.product.price}€</p>
                    </div>
                    <div className="order-product-quantity-container">
                      <label htmlFor="order-product-quantity"></label>
                      <p>{products.orderedQuantity}</p>
                    </div>
                    <div className="order-product-quantity-container">
                      <label htmlFor="order-product-quantity"></label>
                      <p>
                        <strong>{products.product.unit}</strong>
                      </p>
                    </div>

                    {(order.status === "Order created" ||
                      order.status === "Preparing order") &&
                      user?.role === "Producer" && (
                        <>
                          <div className="order-btn-container">
                            <select
                              className="container-type-sel-btn"
                              value={
                                containerSelections[order._id]?.[
                                  products.product._id
                                ]?.type || ""
                              }
                              onChange={(e) =>
                                handleContainerChange(
                                  products.product._id,
                                  order._id,
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Container type...</option>
                              <option value="Sealed">Sealed</option>
                              <option value="Non-Sealed">Non-Sealed</option>
                              <option value="Freezer-Container">
                                Freezer-Container
                              </option>
                            </select>

                            <select
                              className="container-qty-sel-btn"
                              value={
                                containerSelections[order._id]?.[
                                  products.product._id
                                ]?.quantity || ""
                              }
                              onChange={(e) =>
                                handleContainerChange(
                                  products.product._id,
                                  order._id,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Container quantity...</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>

                            <button
                              className="handle-packed-product-btn"
                              onClick={() =>
                                handlePackedProduct(
                                  products.product._id,
                                  products,
                                  order._id
                                )
                              }
                            >
                              Pack
                            </button>
                          </div>
                        </>
                      )}
                  </div>
                );
              })}

            {Object.values(packedProducts[order._id] || {}).length > 0 && (
              <div className="packed-summary">
                {/*   <h4>Order status: {order.status}</h4> */}
                {Object.values(packedProducts[order._id] || {}).map(
                  (packed) => (
                    <>
                      <div className="packing-list">
                        <h4>Packing list:</h4>
                        <div
                          className="packed-products"
                          key={packed.product._id}
                        >
                          <h4>Ordered products:</h4>
                          <p>
                            {packed.product.name} - {packed.orderedQuantity}{" "}
                            {packed.product.unit}
                          </p>
                        </div>
                        <div className="assigned-containers">
                          <h4>Assigned containers:</h4>
                          <p>
                            Container: {packed.containerType} - N.:{" "}
                            {packed.containerQuantity}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                )}
                
              </div>

            )}
            {order.status === "Order shipped" && user?.role === "Producer" && (
                  <div className="containers-checkin">
                    <h4>Returned containers:</h4>
                    {order.containers
                      .filter(c => c.status === "Container ready for collection")
                      .map(container => (
                        <div key={container._id}>
                          <p>Type: {container.type} — Status: {container.status}</p>
                          <button onClick={() => handleContainerCheckin(container._id)}>
                            Set ready to use
                          </button>
                        </div>
                      ))}
                  </div>
                )}
          </div>
        ))}
      </div>
    </>
  );
}
export default Order;
