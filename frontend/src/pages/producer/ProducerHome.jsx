import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ProducerProductCard from "../../components/ProducerProductCard";

import { CloseIcon } from "../../components/icons/Icons";

import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/Toast";

function ProducerHome({ setShowGreenAssistant }) {
  const { token, user } = useContext(AuthContext);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [myProducts, setMyProducts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  
  const {toast, notify, dismiss} = useToast();


  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductType("");
    setProductQuantity("");
    setProductUnit("");
    setSelectedImage("");
    setSelectedIngredientId("");
    setIngredientResults([]);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (
      !productName ||
      !productDescription ||
      !productType ||
      !productPrice ||
      !productQuantity ||
      !productUnit
    ) {
      notify("Please provide all the product's details.", "error");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productName,
          type: productType,
          quantity: productQuantity,
          unit: productUnit,
          price: productPrice,
          description: productDescription,
          image: selectedImage,
          ingredientId: selectedIngredientId,
        }),
      }
    );
    if (response.ok) {
      setRefresh((prev) => prev + 1);
      notify("Product created successfully!");
      resetForm();
    } else {
      notify("Could not create product, try later.", "error");
    }
  };

  //Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      setOrders(Array.isArray(data)? data : []);
    };
    fetchOrders();
  }, [token, refresh]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      }
    );
    if (!response.ok) {
      notify("Could not update quantity, try later", "error");
      return;
    } setRefresh((prev) => prev + 1);
  }

  const handleUpdateProduct = async (productId, editData) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      }
    );
    if (!response.ok) {
      notify ("Could not update product, try later", "error"); 
      return;
    }
    notify("Product updated successfully");
    setRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    if (!productName) return;
    const timer = setTimeout(async () => {
      setIsLoadingIngredients(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ingredients?query=${productName}`
      );
      const data = await response.json();
      setIngredientResults(Array.isArray (data) ? data : []);

      setIsLoadingIngredients(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [productName]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/my-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setMyProducts(Array.isArray(data) ? data : []);
      setIsLoading(false);
    };
    fetchProducts();
  }, [token, refresh]);

  return (
    <>
   <Toast toast={toast} onDismiss={dismiss} />
      <Navbar 
        setShowGreenAssistant={setShowGreenAssistant}
        showOrders={showOrders}
        setShowOrders = {setShowOrders}
        orders= {orders} 
      />

        {showWelcome && (
          <div className="toast-welcome">
            <p className="text-body" style={{fontWeight: 600}}>Welcome back, {user?.name}!</p>
            <button className="close-toast-btn" onClick={() => setShowWelcome(false)}>
              <CloseIcon size={14} />
            </button>
          </div>
        )}
      <div className="create-product-container">
        <h3 className="component-title text-h2">Add a new product</h3>
        <div className="add-new-product">
          <input
            className="input"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product's name"
          />
          <input
            className="input"
            type="text"
            value={productDescription}
            placeholder="Product short description"
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <select
            className="dropdown"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
          >
            <option value="">Select type...</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dry">Dry</option>
            <option value="Frozen">Frozen</option>
            <option value="Liquid">Liquid</option>
          </select>
          <input
            className="input"
            type="number"
            value={productPrice}
            placeholder="1,00€/Kg"
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <input
            className="input"
            type="number"
            value={productQuantity}
            placeholder="10"
            onChange={(e) => setProductQuantity(e.target.value)}
          />
          <select
            className="dropdown"
            value={productUnit}
            onChange={(e) => setProductUnit(e.target.value)}
          >
            <option value="">Choose unit...</option>
            <option value="Kg">Kg</option>
            <option value="Lt">Lt</option>
            <option value="Gr">Gr</option>
            <option value="Cl">Cl</option>
            <option value="Piece">Piece</option>
          </select>
        </div>
        {/*SKELETON LOADER*/}
        {ingredientResults.length > 0 && !isLoadingIngredients && (
            <p className="ingredients-hint text-label">
              Select an image for your product:
            </p>
          )}
          <div className="ingredients-grid">
          {isLoadingIngredients ? (
              [1,2,3].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line skeleton-line--short"></div>
                </div>
                ))
              ) : (
                ingredientResults.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className={`ingredient-option ${
                      selectedIngredientId === ingredient.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setProductName(ingredient.name);
                      setSelectedImage(ingredient.image);
                      setSelectedIngredientId(ingredient.id);
                    }}
                  >
                    <img
                      className="ingredient-img"
                      src={`https://img.spoonacular.com/ingredients_250x250/${ingredient.image}`}
                      alt={ingredient.name}
                    />
                    <p className="text-label">{ingredient.name}</p>
                    </div>
                )))}
        </div>
        <button
          className="btn-add-new-product btn btn--primary"
          type="submit"
          onClick={handleCreateProduct}
        >
          Add a new product
        </button>
      </div>
      <h3 className="sub-session-title text-h2">My Products</h3>
      <div className="my-products-container">
       
        {/*SKELETON LOADER*/}
        {isLoading ? (
          <div className="skeleton-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line skeleton-line--short"></div>
              </div>
            ))}
          </div>
        ) : (
          myProducts.map((product) => (
            <ProducerProductCard
              key={product._id}
              product={product}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateProduct={handleUpdateProduct}
            />
          ))
        )}
      </div>
    </>
  );
}

export default ProducerHome;
