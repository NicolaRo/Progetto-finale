export interface OrderProduct {
    product: string;
    orderedQuantity: number;
    price: number;
    producerId: string;
    containerType?: string;
    containerQuantity?: number;
  }
  
  export interface Order {
    _id: string;
    user: string;
    products: OrderProduct[];
    containers: string[];
    status: "Order created" | "Preparing order" | "Order shipped" | "Order closed";
    stripePaymentIntentId?: string;
    depositAmount: number;
    depositStatus: "held" | "refunded";
    createdAt: string;
    updatedAt: string;
  }
  
  export async function getOrders(token: string): Promise<Order[]> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  }