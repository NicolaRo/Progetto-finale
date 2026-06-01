/* import ShippingOrder from '../assets/shipping-order.gif'; */

import SealedContainer from '../assets/sealed-container-img.png';
import NonSealedContainer from '../assets/non-sealed-container-img.png';
import FreezerContainer from '../assets/freezer-container.png';

const CONTAINER_IMAGES = {
  "Sealed": SealedContainer,
  "Non-Sealed": NonSealedContainer,
  "Freezer-Container": FreezerContainer
};



function OrderCard({ order, variant, onReturnContainers}) {
    
    const isCompleted = variant === "completed";
    return (
        <>
        <div className={`single-order-container ${isCompleted ? "completed" : ""}`}>

            <div className="order-user-details-container">
                <label><strong>Customer:</strong></label>
            </div>
            {CONTAINER_IMAGES[order.containerType] && (
                    <div className="container-assigned-preview">
                      <img
                        className="container-type-img"
                        src={CONTAINER_IMAGES[order.containerType]}
                        alt={order.containerType}
                        />
                        <p>{order.containerQuantity} X {order.containerType}</p>
                    </div>
                  )}
            <p><strong>{order.user.name}</strong>, Id: {order.user._id}</p>

            <label><strong>Order Id: </strong></label> <p>{order._id}</p>

            <label><strong>Order Status:</strong> {order.status}</label>
            
            {order.products.map((products)=> (
            <div className="ordered-products" key={products.product._id}>

            {CONTAINER_IMAGES[products.containerType] && (
                    <div className="container-assigned-preview">
                      <img
                        className="container-type-img"
                        src={CONTAINER_IMAGES[products.containerType]}
                        alt={products.containerType}
                        />
                        <p>{products.containerType} x {products.containerQuantity}</p>
                    </div>
                  )}

                <div className="order-product-details-container">
                    <label><strong>Product: </strong></label>
                    
                    <p>{products.product.name}</p>
                    {!isCompleted && (<img
                    className="prod-order-preview"
                    src={`http://img.spoonacular.com/ingredients_100x100/${products.product.image}`}
                    alt={products.product.name}
                    />
                    )}
                </div>
                <div className="order-details-contianer">
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
                    <p><strong>{products.product.unit}</strong></p>
                </div>

                </div>
                
                </div>
            ))}
            {!isCompleted && order.status === "Order shipped" && (
                <div className="containers-return">
                    <h4>Order received?</h4>
                    {order.containers.some(c => c.status === "Container busy") ? (
                        <button className="return-containers-btn"
                            onClick={() => onReturnContainers(order.containers)}>
                            Confirm receipt & return containers
                        </button> ) : ( <p>All containers are returned! See you on the next order.</p>                    
                    )}
                </div>
            )}
        </div>   
        </>
    );
}

export default OrderCard;