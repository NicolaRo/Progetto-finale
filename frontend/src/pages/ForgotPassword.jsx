import { useState } from "react";

import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";


function ForgotPassword() {
  const { toast, notify, dismiss } = useToast();
  const [email, setEmail] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [isLoading, setIsLoading] = useState (false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      notify("Please provide a valid email address.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/password/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
  
      const data = await response.json();

      if(!response.ok) {
        notify(data.message || "Something went wrong, please try again.", "error");
        return;
      }

      setConfirmationMsg(data.message);
    } catch (error) {
      console.error("Password reset request failed:", error);
      notify("Something went wrong, please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Toast toast={toast} onDismiss={dismiss} />
    <div className="login-container">
      <h3 className="text-h2">Reset your password</h3>
      <p className="text-subtitle">Enter your email and we'll send you a reset link.</p>

      <div className="input-container">
        <label className="text-label" htmlFor="reset-email">
          Email
        </label>
        <input
          className="input-text"
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
      </div>

      <button className="reset-pwd-btn btn btn--primary" onClick={handleSubmit} disabled={isLoading}>
        Send reset link
      </button>

      {confirmationMsg && <p className="confirmation-msg text-h2">{confirmationMsg}</p>}
    </div>
    </>
    
  );
}

export default ForgotPassword;
