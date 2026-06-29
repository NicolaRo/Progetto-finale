import {useNavigate} from  "react-router-dom";

import SuccessPayment from '../../assets/payment-successful.gif';

function SuccessPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="payment-success">
        <button 
        className="back-btn btn btn--primary"
        onClick={() => navigate("/UserHome")}>Continue shopping</button>
        </div>
        <div className ="success-payment-container">
        <h1 className="payment-success-title">🎉 Payment successful!</h1>
            <img
                className="payment-success-icon"
                src={SuccessPayment}
                alt="Payment successful"
                />
            <p>Your order has been confirmed.</p>
            <p>Track your order state in the order page.</p>
        </div>
        </>
    );
}

export default SuccessPage;