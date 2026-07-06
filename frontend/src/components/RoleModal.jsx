import { useState } from 'react';

const RoleModal = ({ isOpen, userName, onClose, onChooseRole }) => {
  
  const [isProducer, setIsProducer] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2 className="text-h2">Welcome, {userName}! 👋</h2>
        <p className="text-subtitle">Please choose your role in PackBack:</p>

        <div className="role-cards">
          <div
            className={`role-card ${!isProducer ? "active" : ""}`}
            onClick={() => setIsProducer(false)}
          >
            <span className="role-card-icon">🛒</span>
            <h3 className="text-card-title">User</h3>
            <p className="text-body">Buy products from local producers and get them in reusable containers.</p>
          </div>

          <div
            className={`role-card ${isProducer ? "active" : ""}`}
            onClick={() => setIsProducer(true)}
          >
            <span className="role-card-icon">🌱</span>
            <h3>Producer</h3>
            <p>Sell your products and ship them with our reusable packaging.</p>
          </div>
        </div>

        <div className="modal__actions">
          <button
            className="modal__btn modal__btn--primary"
            onClick={() => onChooseRole(isProducer ? "Producer" : "User")}
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoleModal;