import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import Navbar from "../../components/Navbar";

import { getOrders } from "../../services/orderService";

import ProducerOrder from "../../components/ProducerOrder";

function OrderPage({ setShowGreenAssistant }) {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders(token);
        setOrders(data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching orders:", error);
        setIsLoading(false)
      }
    };
    fetchOrders();
  }, [token, refresh]);

  return (
    <>
      <Navbar setShowGreenAssistant={setShowGreenAssistant} />
      <button className="back-btn btn btn--ghost" onClick={() => navigate("/ProducerHome")}>
        Back to myHome
      </button>
      {isLoading ? (
        <div className="skeleton-grid">
          {[1,2,3].map((item, index) => (
            <div key ={index} className ="skeleton-card">
              <div className="skeleton-line skeleton-line--short"></div>
              <div className="skeleton-line skeleton-line--short"></div>
            </div>
          ))}
        </div>
      ) : (
        <ProducerOrder orders={orders} setRefresh={setRefresh} />
      )}
      
      <div className="btn-container"></div>
    </>
  );
}

export default OrderPage;
