import {useNavigate} from  "react-router-dom";

import SuccessPayment from '../../assets/payment-successful.gif';

function SuccessPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="payment-success">
            <h1 className="payment-success-title">🎉 Payment successful!</h1>
            <img
                className="payment-success-icon"
                src={SuccessPayment}
                alt="Payment successful"
                />
            <p>Your order has been confirmed.</p>
            <p>Track your order state in the order page.</p>
      <button 
        className="back-btn"
        onClick={() => navigate("/UserHome")}>Back to shop</button>
        </div>
        </>
    );
}

export default SuccessPage;