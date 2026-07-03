import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ProducerProductCard from "../../components/ProducerProductCard";

function ProducerHome({ setShowGreenAssistant }) {
  const { token, user } = useContext(AuthContext);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState(null);
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
  const [isLoadingOrders, setIsLoadingOrders] = useState (true);
  

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
      alert("Please provide all the product's details.");
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
    }
  };

  //Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      setOrders(Array.isArray(data)? data : []);
      setIsLoadingOrders (false);
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
    if (!response.ok) return alert("Could not update quantity, try later");
    setRefresh((prev) => prev + 1);
  };

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
    if (!response.ok) return alert("Could not update product, try later");
    alert("Product updated successfully");
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
      setIngredientResults(data);
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
      <Navbar 
        setShowGreenAssistant={setShowGreenAssistant}
        showOrders={showOrders}
        setShowOrders = {setShowOrders}
        orders= {orders} 
      />

      {showWelcome && (
        <div className="toast-welcome">
          <div className="welcome-msg">Welcome back, {user?.name}!</div>
        </div>
      )}
      <div className="create-product-container">
        <h3 className="component-title">Add a new product</h3>
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
                    <p>{ingredient.name}</p>
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
      <h3 className="sub-session-title">My Products</h3>
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
