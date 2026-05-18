function ProducerOrderCard({
  order,
  user,
  containerSelections,
  handleContainerChange,
  handlePackedProduct,
  handleContainerCheckin
}) {
  if (!order) return null;

  return (
    <div className="single-order-container">
      
      {/* ORDER HEADER */}
      <div className="order-user-details-container">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Customer:</strong> {order.user?.name}</p>
      </div>

      {/* PRODUCTS + PACK */}
      {order.products?.map((p) => (
        <div key={p.product._id} className="ordered-products">
          
          <p><strong>{p.product.name}</strong></p>
          <p>Qty: {p.orderedQuantity}</p>

          {(order.status === "Order created" || order.status === "Preparing order") &&
            user?.role === "Producer" && (
            <>
            


              <select className="select-container-type"
                value={containerSelections?.[order._id]?.[p.product._id]?.type || ""}
                onChange={(e) => handleContainerChange(p.product._id, order._id, "type", e.target.value)}
              >
                <option value="">Container type...</option>
                <option value="Sealed">Sealed</option>
                <option value="Non-Sealed">Non-Sealed</option>
                <option value="Freezer-Container">Freezer</option>
              </select>

              <select className="select-container-qty"
                value={containerSelections?.[order._id]?.[p.product._id]?.quantity || ""}
                onChange={(e) => handleContainerChange(p.product._id, order._id, "quantity", e.target.value)}
              >
                <option value="">Qty...</option>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>

              <button className="btn-pack-product" onClick={() => handlePackedProduct(p.product._id, order._id)}>
                Pack product
              </button>
            </>
          )}
        </div>
      ))}

      {/* CHECKIN — solo quando lo user ha confermato la ricezione */}
      {order.status === "Order shipped" && (
        <button className="checkin-containers-btn" onClick={() => handleContainerCheckin(order._id)}>
          Check in containers and close the order
        </button>
      )}

    </div>
  );
}

export default ProducerOrderCard;