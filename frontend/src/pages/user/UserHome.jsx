import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import ProductList from "../../components/ProductList";
import Navbar from "../../components/Navbar";
import Cart from "../../components/Cart";
import UserOrder from "../../components/UserOrder";

function UserHome() {
  const [shopProducts, setShopProducts] = useState([]);

  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const [refresh, setRefresh] = useState(0);


  const { token } = useContext(AuthContext);
  //Console log for debug
  console.log(token);

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

  useEffect (() => {
    const fetchOrders = async () => {
      const response = await fetch (
        `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      const data = await response.json();

      //console.log for debug
      console.log("orders dopo refetch:", data);
      
      setOrders(data);
    };
    fetchOrders();
  }, [token, refresh]);

  //Search products
  const [query, setQuery] = useState("");

  const searchProducts = async () => {
    const url = query
    ? `${import.meta.env.VITE_API_URL}/api/products?name=${query}`
    : `${import.meta.env.VITE_API_URL}/api/products`;

    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${token}`},
    });
    const data = await response.json();
    setShopProducts(data);
  }

  return (
    <>
      <Navbar setShowCart={setShowCart} setShowOrders={setShowOrders} />
      {showCart && <Cart setShowCart={setShowCart} />}
      {showOrders && <UserOrder orders={orders} setRefresh={setRefresh} setShowOrders={setShowOrders}/>}

      
      <div className="product-list">
        <h3 className="page-title">What do you need today?</h3>
      </div>
      <div className="searchbar"> 
      <input
        className="search-input"
        type="text"
        placeholder="Search products..."
        value= {query}
        onChange={(e)=> setQuery(e.target.value)}
        onKeyDown={(e) => {if(e.key === "Enter")searchProducts}}
      /> 
      <button
        className="search-button"
        onClick={searchProducts}>
        Search
      </button>

      </div>
        
      <ProductList products={shopProducts} />
    </>
  );
}

export default UserHome;
