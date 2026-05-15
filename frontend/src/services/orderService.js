
export async function getOrders(token) {
    const response = await fetch (
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );
    if(!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    return response.json();
}