import {useNavigate} from  "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function SuccessPage() {
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    return (
        <>
        <div className="payment-success">
        
        </div>
            <div className ="success-payment-container">
            <h1 className="payment-success-title">🎉 Payment successful!</h1>

            <div className="success-checkmark">
                <svg viewBox="0 0 52 52">
                    <circle className="success-checkmark-circle" cx="26" cy="26" r="24" />
                    <path className="success-checkmark-tick" d="M14 27 l8 8 l16 -16" />
                </svg>
            </div>

                <p className="success-impact">
                {user?.name}, thanks to your sustainable purchase you helped reduce
                single-use plastic — one of the greatest threats facing our planet.
                </p>
                <p>
                Track your delivery in the orders section, and remember to return your
                containers so other people can enjoy eco-friendly shopping too.
                </p>
                <button 
                    className="back-btn btn btn--primary"
                    onClick={() => navigate("/UserHome")}>
                    Continue shopping
                </button>
        </div>
        </>
    );
}

export default SuccessPage;