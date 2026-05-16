import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateContainerStatus } from "../services/containerService";

import ProducerOrderCard from "./ProducerOrderCard";

function ProducerOrder({ orders, setRefresh }) {
  const [containerSelections, setContainerSelections] = useState({});

  const { token, user} = useContext(AuthContext);

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
        {orders.map((order)=> (
          <ProducerOrderCard 
            key={order._id}
            user={user}
            order={order}
            packedProducts={packedProducts}
            containerSelections={containerSelections}
            handleContainerChange={handleContainerChange}
            handlePackedProduct={handlePackedProduct}
            handleShipOrder={handleShipOrder}
            handleContainerCheckin={handleContainerCheckin}/>
        ))}
      </div>
      
    </>
  );
}
export default ProducerOrder;
