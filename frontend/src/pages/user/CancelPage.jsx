import {useNavigate} from  "react-router-dom";

function CancelPage() {
    const navigate = useNavigate();

    return (
        <>
        <div className="cancel-payment">
            <h1 className="cancel-payment-title">⛔️Cancel Pay</h1>
            <p>Your payment has been canceled.</p>
      <button onClick={() => navigate("/UserHome")}>Back to shop</button>
        </div>
        </>
    );
}

export default CancelPage;