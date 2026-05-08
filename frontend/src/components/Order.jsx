import {useState} from 'react';


function Order ({orders}) {
    const [containerSelections, setContainerSelections] = useState({});

const handleContainerChange = (productId, field, value) => {
  setContainerSelections(prev => ({
    ...prev,
    [productId]: { ...prev[productId], [field]: value }
  }));
};

    return (
        <>
        <div className="orders-container">
            <h3 className="component-title">Orders list</h3>
            {orders.map((order) => (
                <div key={order._id}>
                    <div className="order-user-details-container">
                        <label htmlFor='order-user-detail'><strong>Order Id: </strong></label>
                        <p>{order._id}</p>
                    </div>
                    
                    <div className="order-user-details-container">
                        <label htmlFor='order-user-detail'><strong>Customer: </strong></label>
                        <p>{order.user.name}, Id: {order.user._id}</p>
                    </div>
                    
                    
                    {order.products.map((products)=> (
                        <div className="ordered-products" key={products.product._id}>
                            <div className="order-product-details-container">
                                <label htmlFor='order-product-detail'><strong>Product: </strong></label>
                                <p>{products.product.name}</p>
                                <img 
                                    className="prod-order-preview"
                                    src={`http://img.spoonacular.com/ingredients_100x100/${products.product.image}`}
                                    alt={products.product.name}
                                />
                            </div>
                            <div className="order-product-details-container">
                                <label htmlFor='order-product-detail'><strong>Price: </strong></label>
                                <p>{products.product.price}€</p>
                            </div>
                            <div className="order-product-quantity-container">
                                <label htmlFor='order-product-quantity'><strong>Quantity: </strong></label>
                                <p>{products.orderedQuantity} <p>{products.product.unit}</p> </p>
                            </div>
                            
                            <select 
                                value={containerSelections[products.product._id]?.type || ""}
                                onChange={(e) => handleContainerChange(products.product._id, "type", e.target.value)}
                                >
                                     <option value="">Container type...</option>
                                    <option value="Sealed">Sealed</option>
                                    <option value="Non-Sealed">Non-Sealed</option>
                                    <option value="Freezer-Container">Freezer-Container</option>   
                            </select>

                            <select 
                                value={containerSelections[products.product._id]?.quantity || ""}
                                onChange={(e) => handleContainerChange(products.product._id, "quantity", e.target.value)}
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
                        </div>
                    ))}
                </div>
            ))}
        </div>
        </>
    );
}

export default Order; 