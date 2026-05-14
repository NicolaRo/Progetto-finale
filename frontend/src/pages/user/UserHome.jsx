import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import ProductList from "../../components/ProductList";
import Navbar from "../../components/Navbar";
import Cart from "../../components/Cart";
import Order from "../../components/Order";

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
      setOrders(data);
    };
    fetchOrders();
  }, [token, refresh]);

  return (
    <>
      <Navbar setShowCart={setShowCart} setShowOrders={setShowOrders} />
      {showCart && <Cart setShowCart={setShowCart} />}
      {showOrders && <Order orders={orders} setRefresh={setRefresh} setShowOrders={setShowOrders}/>}

      
      <div className="product-list">
        <h3 className="page-title">User Home</h3>
        <h4 className="sub-session-title">Available products</h4>
      </div>
      <ProductList products={shopProducts} />
    </>
  );
}

export default UserHome;
