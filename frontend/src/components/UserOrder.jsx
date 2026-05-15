import { useContext} from "react";
import { AuthContext } from "../context/AuthContext";

import { updateContainerStatus } from "../services/containerService";

function UserOrder({ orders, setRefresh }) {

  const { token} = useContext(AuthContext);

  const handleReturnContainers = async (containers) => {
    try {
      for (const container of containers) {
        await updateContainerStatus (
          container._id,
          "Container ready for collection",
          token
        );
      }
      alert("Containers returned successfully");

      setRefresh((prev) => prev + 1);

    } catch {
      alert ("Could not update container status, try later");
    }
  };

  return (
    <>
      <div className="orders-container">
        <h3 className="component-title">Orders list</h3>
        {orders.map((order) => (
          
          <div className="single-order-container" key={order._id}>

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

            {order.products
              
              .map((products) => {

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
                    
                    {order.status === "Order shipped" && (
                        <div className="containers-return">
                          <h4>Order received?</h4>
                          {order.containers.some(
                            (c) => c.status === "Container busy"
                          ) ? (
                            <button
                              onClick={() =>
                                handleReturnContainers(order.containers)
                              }
                            >
                              Confirm receipt & return containers
                            </button>
                          ) : (
                            <p>
                              All containers are returned! See you on the next
                              order.
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </>
  );
}
export default UserOrder;
