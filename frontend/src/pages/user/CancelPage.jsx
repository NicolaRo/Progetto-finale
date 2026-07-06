// CancelPage.jsx
import { useNavigate } from "react-router-dom";

function CancelPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="payment-cancel"></div>
      <div className="cancel-payment-container">
        <h1 className="payment-cancel-title text-h1">😕 Payment not completed</h1>

        <div className="cancel-mark">
          <svg viewBox="0 0 52 52">
            <circle className="cancel-mark-circle" cx="26" cy="26" r="24" />
            <path className="cancel-mark-cross" d="M17 17 L35 35 M35 17 L17 35" />
          </svg>
        </div>

        <p className="cancel-impact text-body">
          Good news — you have not been charged. Your order was not placed.
        </p>
        <p className="text-body">
          You can go back to the shop and try again whenever you're ready.
        </p>

        <button
          className="back-btn btn btn--primary"
          onClick={() => navigate("/UserHome")}
        >
          Back to shop
        </button>
      </div>
    </>
  );
}

export default CancelPage;