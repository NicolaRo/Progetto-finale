import {useEffect, useContext, useState} from 'react';
import { AuthContext } from '../../context/AuthContext';
import Order from '../../components/Order';
import Navbar from '../../components/Navbar';

function OrderPage(){
    const [orders, setOrders] = useState([]);
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            const data = await response.json();
        setOrders(data);
        };
        fetchOrders();
    }, [token]);

    return (
        <>
        <Navbar />
        <Order orders={orders} />
        </>
    );
}

export default OrderPage;