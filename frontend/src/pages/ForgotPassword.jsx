import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please provide a valid email address.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/password/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    setConfirmationMsg(data.message);
  };

  return (
    <div className="login-container">
      <h3 className="container-title">Reset your password</h3>
      <p>Enter your email and we'll send you a reset link.</p>

      <div className="input-container">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          className="input-text"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
      </div>

      <button className="login-btn btn btn--primary" onClick={handleSubmit}>
        Send reset link
      </button>

      {confirmationMsg && <p className="confirmation-msg">{confirmationMsg}</p>}
    </div>
  );
}

export default ForgotPassword;
