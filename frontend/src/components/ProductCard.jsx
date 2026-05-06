import { useContext, useState} from "react";
import {CartContext} from '../context/CartContext';

function ProductCard({product}) {


    const [quantity, setQuantity] = useState("");
    const {addToCart} = useContext(CartContext);

    

    const handleAddToCart = () => {
        console.log("handleAddToCart chiamato", quantity);
        if(!quantity || quantity === '0' ){
            alert('Chose a quantity higher than 0')
            return; 
        }

        addToCart({
            product: product._id,
            orderedQuantity: quantity,
            price: product.price,
            producerId: product.producerId._id
        });
    };
    

    return (
        <>
        <div className="product-card">
        <img 
                className="product-listed-preview"
                src={`http://img.spoonacular.com/ingredients_100x100/${product.image}`}
                alt={product.name}
                />
            <div className="product-details">
            
                <p className="p-details">{product.name}</p>
                <p className="p-details">{product.description}</p>
                <p className="p-details">{product.quantity}</p> <p>{product.unit}</p>
                <p className="p-details">{product.price}€</p>
                <p className="p-details">{product.producerId.name}€</p>
                
            </div>
            <div className="card-btn-container">
                <select
                className="dropdown"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                >
                <option value="">Quantity...</option>
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
                className="create-order-btn" 
                type="submit"
                onClick={handleAddToCart}>
                    Add product to cart
                </button> 
            </div>
        </div> 
        </>
    )
}

export default ProductCard;