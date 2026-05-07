import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import ProductList from "../../components/ProductList";
import Navbar from "../../components/Navbar";
import Cart from "../../components/Cart";

function UserHome() {
  const [shopProducts, setShopProducts] = useState([]);

  const [showCart, setShowCart] = useState(false);

  const { token } = useContext(AuthContext);

  //API call to the DB to get the list of products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setShopProducts(data);
    };
    fetchProducts();
  }, [token]);

  return (
    <>
      <Navbar setShowCart={setShowCart} />
      {showCart && <Cart setShowCart={setShowCart} />}
      <h3 className="page-title">User Home</h3>
      <div className="product-list">
        <h4 className="sub-session-title">Available products</h4>
      </div>
      <ProductList products={shopProducts} />
    </>
  );
}

export default UserHome;
