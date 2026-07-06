import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";

function ResetPassword() {
  const { toast, notify, dismiss } = useToast();

  //UseParams gets the token from the URL
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      notify("Password must be at least 8 characters.", "error");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/password/reset/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setConfirmationMsg(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      alert(data.message);
    }
  };

  return (
    <>
    <Toast toast={toast} onDismiss={dismiss} />
    <div className="login-container">
      <h3 className="container-title">Reset your password</h3>
      <p>Choose a new password — at least 8 characters.</p>

      <div className="input-container">
        <label className="label" htmlFor="password">
          New password
        </label>
        <input
          className="input-text"
          id="password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Choose a new password"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
      </div>

      <button className="login-btn btn btn--primary" onClick={handleSubmit}>
        Reset Password
      </button>

      {confirmationMsg && <p className="confirmation-msg text-h2">{confirmationMsg}</p>}
    </div>
    </>
  );
}

export default ResetPassword;
