import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import ProductList from '../../components/ProductList';

function ProducerHome() {

  //***IMPORTANT REMOVE THIS LOG BEFORE DEPLOY*** */
  const { token } = useContext(AuthContext);
  
  //console.log for debug
  console.log(token);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState(null);
  const [productQuantity, setProductQuantity] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [myProducts, setMyProducts] = useState ([]);

  /* const [orders, setOrders] = useState([]); */

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
    } else {
      //Fetch data to the backend
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
            ingredientId: selectedIngredientId
          })
        });

      if (response.ok) {
        alert("Product created");
      }
    }
  };
//Call spoonacular API from the backend to get the ingredients pictures
  useEffect(() => {
    if (!productName) return;

    const timer = setTimeout(async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ingredients?query=${productName}`
      );
      const data = await response.json();
      setIngredientResults(data);
       //wait 1 second to call the API
    }, 1000);

    return () => clearTimeout(timer);
  }, [productName]);

  //API call to the DB to get the list of products
  useEffect (() => {
    const fetchProducts = async () => {
      const response = await fetch (
        `${import.meta.env.VITE_API_URL}/api/products/my-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMyProducts (data);
    };
    fetchProducts();
  }, [token] );

  //useEffect handle the DB call to fetch the Order to the DB
  /* useEffect(() => {
      const fetchOrders = async () => {
          const response = await fetch (
              `${import.meta.env.VITE_API_URL}/api/orders`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          );
          const orders = await response.json();
          
          setOrders(orders);
      };
      fetchOrders();
  }, [token]); */

  return (
    <>
      <h3 className="page-title"> Producer Home</h3>
      <Navbar />
      <div className="create-product-container">
        <h3 className="component-title">Add a new product</h3>

        <input
          className="input"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product's name"
        ></input>

        <input
          className="input"
          type="text"
          value={productDescription}
          placeholder="Product short description"
          minLength="10"
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
          minLength="10"
          onChange={(e) => setProductPrice(e.target.value)}
        />

        <input
          className="input"
          type="quantity"
          value={productQuantity}
          placeholder="10Kg"
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

       

        <div className="ingredients-grid">
          {ingredientResults.map((ingredient) => (
            <div
              key={ingredient.id}
              onClick={() => {
                setProductName(ingredient.name);
                setSelectedImage(ingredient.image);
                setSelectedIngredientId(ingredient.id);
              }}
            >
              <img
                src={`https://img.spoonacular.com/ingredients_250x250/${ingredient.image}`}
                alt={ingredient.name}
              />
              <p>{ingredient.name}</p>
            </div>
          ))}
        </div>

        <button className="create-product-btn" type="submit" onClick={handleCreateProduct}>
          Add a new product
        </button>
      </div>
      <div className="product-upd-preview">
        <h4 className="sub-session-title">My Products</h4>
        <p>{productName || "New product to upload"}</p>
        <p>{productDescription || "Product short description"}</p>
        <p>
          {productPrice || "0.00"}€/{productUnit || "Unit"}
        </p>
      </div>
      <ProductList products={myProducts} />
    </>
  );
}

export default ProducerHome;
