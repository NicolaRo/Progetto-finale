function OrderCard({ order, variant, onReturnContainers}) {
    const isCompleted = variant === "completed";
    return (
        <><div className={`single-order-container ${isCompleted ? "completed" : ""}`}>
            <div className="order-user-details-container">
                <label><strong>Customer</strong></label>
            </div>
            <p><strong>{order.user.name}</strong>, Id: {order.user._id}</p>

            <label><strong>Order Id: </strong></label> <p>{order._id}</p>

            <label><strong>Order Status:</strong> {order.status}</label>
            
            {order.products.map((products)=> (
            <div className="ordered-products" key={products.product._id}>

                <div className="order-product-details-container">
                    <label><strong>Product: </strong></label>
                    <p>{products.product.name}</p>
                    <img
                    className="prod-order-preview"
                    src={`http://img.spoonacular.com/ingredients_100x100/${products.product.image}`}
                    alt={products.product.name}
                    />
                </div>

                <div className="order-producer-details-container">
                    <label><strong>Producer: </strong></label>
                    <p>{products.producerId.name}</p>
                </div>

                <div className="order-product-details-container">
                    <label><strong>Price: </strong></label>
                    <p>{products.product.price}€</p>
                </div>

                <div className="order-product-quantity-container">
                    <p>{products.orderedQuantity}</p>
                </div>

                <div className="order-product-quantity-container">
                    <p><strong>{products.product.unit}</strong></p>
                </div>

                </div>
            ))}
        </div>
        

            {!isCompleted && order.status === "Order shipped" && (
                <div className="containers-return">
                    <h4>Order received?</h4>
                    {order.containers.some(c => c.status === "Container busy") ? (
                        <button 
                            onClick={() => onReturnContainers(order.containers)}>
                            Confirm receipt & return containers
                        </button> ) : ( <p>All containers are returned! See you on the next order.</p>                    
                    )}
                </div>
            )}
        </>
    );
}

export default OrderCard;