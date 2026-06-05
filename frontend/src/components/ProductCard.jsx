import { useContext, useState} from "react";
import {CartContext} from '../context/CartContext';
import { AuthContext } from "../context/AuthContext";

function ProductCard({product}) {


    const [quantity, setQuantity] = useState("");
    const {addToCart} = useContext(CartContext);
    const {user} = useContext(AuthContext);
    

    const handleAddToCart = () => {
        console.log("handleAddToCart called", quantity);
        if(!quantity || quantity === '0' ){
            alert('Chose a quantity higher than 0')
            return; 
        }

        if(Number(quantity) > product.quantity) {
            alert(`Not enough stock. ${product.name} Availability: ${product.quantity} ${product.unit}`);
            return;
        }

        addToCart({
            product: product._id,
            orderedQuantity: quantity,
            price: product.price,
            name: product.name,
            image: product.image,
            producerName: product.producerId.name,
            producerId: product.producerId._id
        });
        setQuantity("");
    };
    

    return (
        <>
        <div className="product-card">
            <div className="p-name-pic-details">
                <p className="p-name-details"><strong>{product.name}</strong></p>
                <img 
                className="product-listed-img"
                src={`http://img.spoonacular.com/ingredients_100x100/${product.image}`}
                alt={product.name}
                />
            </div>
        
        
            <div className="product-details">
                <div className="p-unit-details">
                <p className="p-details"><strong>Availability: </strong>{product.quantity}{product.unit}</p>
                </div>
                <p className="p-details"><strong>Unit price: </strong>{product.price}€</p>
                <p className="p-details"><strong>Producer: </strong>{product.producerId.name}</p>
                
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
                    {user?.role === "User" ? "Add to cart" : "Load product"}
                </button> 
            </div>
        </div> 
        </>
    )
}

export default ProductCard;