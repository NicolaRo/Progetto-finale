import {useNavigate} from  "react-router-dom";

function SuccessPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="payment-success">
            <h1 className="payment-success-title">🎉 Payment successful!</h1>
            <p>Your order has been confirmed.</p>
      <button onClick={() => navigate("/UserHome")}>Back to shop</button>
        </div>
        </>
    );
}

export default SuccessPage;