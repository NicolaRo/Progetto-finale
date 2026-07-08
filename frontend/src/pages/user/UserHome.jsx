import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProductList from "../../components/ProductList";
import Navbar from "../../components/Navbar";
import Cart from "../../components/Cart";
import UserOrder from "../../components/UserOrder";

import RecycleBuddy from "../../components/RecycleBuddy";
import {AssistantIcon, CloseIcon } from "../../components/icons/Icons";

import { useToast } from "../../hooks/useToast";
import { Toast } from "../../components/Toast";
import { useLocation, useNavigate } from "react-router-dom";

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
  const [showWelcome, setShowWelcome] = useState(() => !location.state?.justRegistered);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState (true);

  const { token, user } = useContext(AuthContext);
  const { toast, notify, dismiss } = useToast();

  const location = useLocation();
  const navigate = useNavigate();

  //Show a confirmation toast if the user just registered
  useEffect(() => {
    if (location.state?.justRegistered) {
      notify("Account created successfully! Welcome to PackBack.", "success");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, notify, navigate]);

  //Loading products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        setShopProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setShopProducts([]);
        notify("Couldn't load products, please try again later.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [token, notify]);

  //Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        setOrders(Array.isArray(data)? data : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        notify("Failed to get orders from the Database, please try later", "error");
        setOrders([]);
      } finally {
        setIsLoadingOrders (false);
      }
      
    };
    fetchOrders();
  }, [token, refresh, notify]);

  //Fetch green tips from OpenAI
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ai/hero-tip`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setHeroTip(data.tip))
      .catch((error) => {
        console.error("Failed to fetch hero tip:", error);
        //UX Improvement: show the statement instead of infinite loading if API crash
        setHeroTip("Reduce, reuse, recycle!");
      });
  }, [token]);

  //Search + filters
  const fetchProducts = async (nameQuery, filters, producer) => {
    const params = new URLSearchParams();
    if (nameQuery) params.append("name", nameQuery);
    if (filters) filters.forEach((f) => params.append("type", f));
    if (producer) params.append("producerId", producer);

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      setShopProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to search products:", error);
      setShopProducts([]);
      notify("Couldn't get the products from Database, please try later", "error");
    } finally {
      setIsLoading(false);
    }
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
      <Toast toast={toast} onDismiss={dismiss} />
      <Navbar
        setShowCart={setShowCart}
        setShowOrders={setShowOrders}
        showOrders={showOrders}
        orders={orders}
      />
{showWelcome && (
  <div className="toast-welcome">
    <p className="text-body" style={{fontWeight: 600}}>Welcome back, {user?.name}</p>
    <button className="close-toast-btn" onClick={() => setShowWelcome(false)}>
      <CloseIcon size={14} />
    </button>
  </div>
)}

      {showCart && <Cart setShowCart={setShowCart} />}
      {showOrders && ( 
        isLoadingOrders ? (
          <div className="user-order-skeleton-grid">
            {[1,2,3].map((i) => (
              <div key={i} className="user-order-skeleton-card">
                <div className ="user-order-skeleton-line"></div>
                <div className="user-order-skeleton-line--short"></div>
              </div>
            ))}
          </div>
        ) : (
          <UserOrder
          orders={orders}
          setRefresh={setRefresh}
          setShowOrders={setShowOrders}
        />
        )
      )}
<div className="research-container">
<h3 className="page-title text-h1">What do you need today?</h3>
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
            className="search-button btn btn--primary"
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
                className={`filter-btn text-label ${
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
              className="producer-select text-label"
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
      
      {/* SKELETON LOADER */}
      {isLoading ? (
        <div className="user-skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="user-skeleton-card">
              <div className="user-skeleton-img"></div>
              <div className="user-skeleton-line"></div>
              <div className="user-skeleton-line skeleton-line--short"></div>
            </div>
          ))}
        </div>
      ) : (
        <ProductList products={shopProducts} />
      )}

      <div className="hero-banner">
      <AssistantIcon className="hero-assistant-icon" size={28} />
        <h3 className="hero-title text-h2">Green tip of the day</h3>
        <p className="hero-tip text-body">{heroTip || "Loading..."}</p>
        <button className="hero-chat-btn btn btn--primary" onClick={() => setShowChat(true)}>
        <AssistantIcon size={16} />
          Chat with RecycleBuddy
        </button>
      </div>
      {showChat && <RecycleBuddy onClose={() => setShowChat(false)} />}
    </>
  );
}

export default UserHome;
