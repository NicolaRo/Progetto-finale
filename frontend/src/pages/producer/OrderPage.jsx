import {useEffect, useContext, useState} from 'react';
import { AuthContext } from '../../context/AuthContext';
import Order from '../../components/Order';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

function OrderPage(){
    const [orders, setOrders] = useState([]);
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(0);


    useEffect(() => {
        //console.log for debug
        console.log("refetch triggered, refres", refresh);
        const fetchOrders = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            const data = await response.json();
        setOrders(data);
        };
        fetchOrders();
    }, [token, refresh]);

    return (
        <>
        <button 
            className="back-btn"
            onClick={()=> navigate ("/ProducerHome")}>Back to myHome
        </button>
        <Navbar />
        <Order orders={orders} setRefresh={setRefresh}/>
        <div className="btn-container">
        
        </div>
        
        </>
    );
}

export default OrderPage;