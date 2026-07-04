import { useContext, useState } from "react";
import {useDispatch} from 'react-redux';
import { addToCart } from "../store/cartSlice";
import { AuthContext } from "../context/AuthContext";

function ProductCard({ product }) {
  const [quantity, setQuantity] = useState("");
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    if (!quantity || quantity === "0") {
      showToast("Choose a quantity higher than 0", "error");
      return;
    }
  
    if (Number(quantity) > product.quantity) {
      showToast(
        `Not enough stock. ${product.name} Availability: ${product.quantity} ${product.unit}`,
        "error"
      );
      return;
    }
  
    showToast("Product added to cart", "success");
  
    dispatch(addToCart({
      product: product._id,
      orderedQuantity: quantity,
      price: product.price,
      name: product.name,
      image: product.image,
      producerName: product.producerId.name,
      producerId: product.producerId._id,
    }));
    setQuantity("");
  };

  return (
    <>

    {toast && (
      <div className={`toast-cart ${toast.type === "error" ? "toast-cart--error" : ""}`}>
        <p className="text-body">{toast.message}</p>
      </div>
    )}
      <div className="product-card">
        <div className="p-name-pic-details">
          <p className="p-name-details text-card-title">{product.name}</p>
          <img
            className="product-listed-img"
            src={`https://img.spoonacular.com/ingredients_100x100/${product.image}`}
            alt={product.name}
          />
        </div>

        <div className="product-details">
          <div className="p-unit-details">
            <p className="p-details text-label">
              <span className="text-emphasis">Availability: </span>
              <span style = {{color: 'black'}}>{product.quantity}
              {product.unit}</span> 
            </p>
          </div>
          <p className="p-details text-label">
            <span className="text-emphasis">Unit price: </span>{product.price}€</p>
          <p className="p-details text-label">
            <span className="text-emphasis">Producer: </span>{product.producerId.name}</p>
        </div>
        <span className="eco-badge text-utility">♻️ Reusable pack</span>
        <div className="card-btn-container">
          <select
            className="dropdown"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          >
            <option value="">Quantity...</option>
            <option value="1">1 {product.unit}</option>
            <option value="2">2 {product.unit}</option>
            <option value="3">3{product.unit}</option>
            <option value="4">4{product.unit}</option>
            <option value="5">5 {product.unit}</option>
            <option value="6">6 {product.unit}</option>
            <option value="7">7 {product.unit}</option>
            <option value="8">8 {product.unit}</option>
            <option value="9">9 {product.unit}</option>
            <option value="10">10 {product.unit}</option>
          </select>
            <button
              className="add-to-cart-btn btn btn--primary"
              type="submit"
              onClick={handleAddToCart}
            >
              {user?.role === "User" ? "Add to cart" : "Load product"}
            </button>
          
        </div>
      </div>
    </>
  );
}

export default ProductCard;
