import {useNavigate} from  "react-router-dom";

import RejectedPayment from '../../assets/payment-rejected.gif';

function CancelPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="cancel-payment">
            <h1 className="cancel-payment-title">Payment failed</h1>
            <img
                src={RejectedPayment}
                alt="rejected payment"
            />
            <p>Your payment has been canceled.</p>
            <p>Please check it and try later.</p>
      <button className="back-btn" onClick={() => navigate("/UserHome")}>Back to my home</button>
        </div>
        </>
    );
}

export default CancelPage;