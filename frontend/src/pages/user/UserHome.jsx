import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProductList from "../../components/ProductList";
import Navbar from "../../components/Navbar";
import Cart from "../../components/Cart";
import UserOrder from "../../components/UserOrder";

import RecycleBuddy from "../../components/RecycleBuddy";

function UserHome() {
  const [shopProducts, setShopProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState("");
  const [heroTip, setHeroTip] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const { token, user } = useContext(AuthContext);

  //Loading products
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setShopProducts(data));
  }, [token]);

  //Fetch orders
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []));
  }, [token, refresh]);

  //Fetch green tips from OpenAI
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ai/hero-tip`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setHeroTip(data.tip));
  }, [token]);

  //Search + filters
  const fetchProducts = async (nameQuery, filters, producer) => {
    const params = new URLSearchParams();
    if (nameQuery) params.append("name", nameQuery);
    if (filters) filters.forEach((f) => params.append("type", f));
    if (producer) params.append("producerId", producer);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    setShopProducts(Array.isArray(data) ? data : []);
  };

  const producers = [
    ...new Map(
      shopProducts
        .filter((p) => p.producerId)
        .map((p) => [p.producerId._id, p.producerId])
    ).values(),
  ];

  const toggleFilter = (type) => {
    const updated = activeFilters.includes(type)
      ? activeFilters.filter((f) => f !== type)
      : [...activeFilters, type];
    setActiveFilters(updated);
    fetchProducts(query, updated, selectedProducer);
  };

  const handleProducerChange = (e) => {
    setSelectedProducer(e.target.value);
    fetchProducts(query, activeFilters, e.target.value);
  };

  return (
    <>
      <Navbar
        setShowCart={setShowCart}
        setShowOrders={setShowOrders}
        showOrders={showOrders}
        orders={orders}
      />
      {showWelcome && (
        <div className="toast-welcome">
          <div className="welcome-msg">Welcome back, {user?.name}!</div>
          <button
            className="close-welcome-btn"
            onClick={() => setShowWelcome(false)}
          >
            ✕
          </button>
        </div>
      )}

      {showCart && <Cart setShowCart={setShowCart} />}
      {showOrders && (
        <UserOrder
          orders={orders}
          setRefresh={setRefresh}
          setShowOrders={setShowOrders}
        />
      )}

      <div className="hero-banner">
        <h3 className="hero-title">Green tip of the day</h3>
        <p className="hero-tip">{heroTip || "Loading..."}</p>
        <button className="hero-chat-btn" onClick={() => setShowChat(true)}>
          Chat with RecycleBuddy
        </button>
      </div>
      {showChat && <RecycleBuddy onClose={() => setShowChat(false)} />}

      <div className="research-container">
        <h3 className="page-title">What do you need today?</h3>

        <div className="searchbar">
          <input
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                fetchProducts(query, activeFilters, selectedProducer);
            }}
          />
          <button
            className="search-button"
            onClick={() =>
              fetchProducts(query, activeFilters, selectedProducer)
            }
          >
            Search
          </button>
        </div>

        <div className="filters-container">
          <div className="filter-tag-container">
            {["Vegetables", "Fruits", "Dry", "Frozen", "Liquid"].map((type) => (
              <button
                key={type}
                className={`filter-btn ${
                  activeFilters.includes(type) ? "active" : ""
                }`}
                onClick={() => toggleFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="filter-select">
            <select
              className="producer-select"
              value={selectedProducer}
              onChange={handleProducerChange}
            >
              <option value="">Choose Producer...</option>
              {producers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ProductList products={shopProducts} />
    </>
  );
}

export default UserHome;
