import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserOrder from "../../components/UserOrder";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    //console.log for debug
    console.log("refetch triggered, refres", refresh);
    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders`,
                { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
              );
              const data = await response.json();
        
              //Console log for debug
              console.log("orders ricevuti:", data);
              setOrders(data);
        } catch (error) {
            console.log("Errore fetch ordini:", error);
        }
    };
    fetchOrders();
  }, [token, refresh]);

  return (
    <>
      <button className="back-btn" onClick={() => navigate("/ProducerHome")}>
        Back to myHome
      </button>
      <Navbar />
      <UserOrder orders={orders} setRefresh={setRefresh} />
      <div className="btn-container"></div>
    </>
  );
}

export default OrderPage;
