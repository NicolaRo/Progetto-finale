import {useNavigate} from  "react-router-dom";

import PlaceholderImg from '../../assets/PlaceholderImg.png';

function SuccessPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="payment-success">
            <h1 className="payment-success-title">🎉 Payment successful!</h1>
            <img
                className="payment-success-icon"
                src={PlaceholderImg}
                alt="Payment successful"
                />
            <p>Your order has been confirmed.</p>
            <p>You will receive an email when the order is shipped.</p>
      <button 
        className="back-btn"
        onClick={() => navigate("/UserHome")}>Back to shop</button>
        </div>
        </>
    );
}

export default SuccessPage;