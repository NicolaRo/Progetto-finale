function ProducerOrderCard({
  order,
 user, 
/*   packedProducts, */
  containerSelections,
  handleContainerChange,
  handlePackedProduct,
  handleShipOrder,
/* handleContainerCheckin  */
}) {
  if (!order) return null;

  console.log("ProducerOrderCard mounted:", order._id);

  return (
    <div className="single-order-container">
      
      {/* ORDER HEADER */}
      <div className="order-user-details-container">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Customer:</strong> {order.user?.name}</p>
      </div>

      {/* PACK BUTTON */}
      {order.products?.map((p) => (
  <div key={p.product._id} className="ordered-products">

    <p><strong>{p.product.name}</strong></p>

    {(order.status === "Order created" ||
      order.status === "Preparing order") &&
      user?.role === "Producer" && (
        <>
        <button
          onClick={() =>
            handlePackedProduct(
              p.product._id,
              p,
              order._id
            )
          }
        >
          Pack product
        </button>

<select
value={
  containerSelections?.[order._id]?.[p.product._id]?.type || ""
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

<select
value={
  containerSelections?.[order._id]?.[p.product._id]?.quantity || ""
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
{[1,2,3,4,5,6,7,8,9,10].map(n => (
  <option key={n} value={n}>{n}</option>
))}
</select>
</>
      )}

    </div>

))}

      {/* SHIP BUTTON */}
      {order.status === "Preparing order" && (
        <button
          className="ship-order-btn"
          onClick={() => handleShipOrder(order._id)}
        >
          Ship order
        </button>
      )}

      {/* PRODUCTS LIST (MINIMAL DEBUG) */}
      {order.products?.map((p) => (
        <div key={p.product?._id} className="ordered-products">
          <p>PRODUCT: {p.product?.name}</p>
          <p>QTY: {p.orderedQuantity}</p>
        </div>
      ))}

    </div>
  );
}

export default ProducerOrderCard;