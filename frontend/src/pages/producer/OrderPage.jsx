import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import Navbar from "../../components/Navbar";

import { getOrders } from "../../services/orderService";

import ProducerOrder from "../../components/ProducerOrder";

function OrderPage({setShowGreenAssistant}) {
  
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(token);
        setOrders(data);
      } catch (error) {
                console.log("Errore fetch ordini:", error);
            }
        };
        fetchOrders();
      }, [token, refresh]);

  return (
    <>
      
      <Navbar setShowGreenAssistant={setShowGreenAssistant}/>
      <button className="back-btn" onClick={() => navigate("/ProducerHome")}>
        Back to myHome
      </button>
      <ProducerOrder orders={orders} setRefresh={setRefresh} />
      <div className="btn-container"></div>
    </>
  );
}

export default OrderPage;
