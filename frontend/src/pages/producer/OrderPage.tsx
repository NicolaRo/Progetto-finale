import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import Navbar from "../../components/Navbar";

import { getOrders } from "../../services/orderService";

import ProducerOrder from "../../components/ProducerOrder";
import { ContainerStatus } from "../../services/containerService";

interface OrderProductItem {
  product: { _id: string; name: string };
  orderedQuantity: number;
  containerType?: string;
  containerQuantity?: number;
}

interface OrderContainer {
  _id: string;
  status: ContainerStatus;
}

// Note: getOrders() (orderService.ts) types containers as string[]
// (unpopulated), but the backend actually returns them populated for
// producers, and ProducerOrder needs the populated shape. Same
// inconsistency already logged in IMPROVEMENTS_BACKLOG.md
// (shared types frontend/backend). Cast below reflects actual runtime
// shape, not the orderService type.
interface Order {
  _id: string;
  status: "Order created" | "Preparing order" | "Order shipped" | "Order closed";
  products?: OrderProductItem[];
  containers: OrderContainer[];
  updatedAt: string;
}

interface OrderPageProps {
  setShowGreenAssistant: (show: boolean) => void;
}

function OrderPage({ setShowGreenAssistant }: OrderPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders(token as string);
        setOrders(data as unknown as Order[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
          {[1, 2, 3].map((item, index) => (
            <div key={index} className="skeleton-card">
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