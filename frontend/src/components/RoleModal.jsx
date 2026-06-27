import { useState } from 'react';

const RoleModal = ({ isOpen, userName, onClose, onChooseRole }) => {
  
  const [isProducer, setIsProducer] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2>Welcome, {userName}! 👋</h2>
        <p>Please choose your role in PackBack:</p>

        <div className="checkbox-wrapper-35">
          <input
            id="modal-switch"
            name="modal-switch"
            type="checkbox"
            className="switch"
            checked={isProducer}
            onChange={() => setIsProducer(!isProducer)}
          />
          <label htmlFor="modal-switch">
            <span className="switch-x-text">Register as: </span>
            <span className="switch-x-toggletext">
              <span className="switch-x-unchecked">
                <span className="switch-x-hiddenlabel">Unchecked: </span>
                User
              </span>
              <span className="switch-x-checked">
                <span className="switch-x-hiddenlabel">Checked: </span>
                Producer
              </span>
            </span>
          </label>
        </div>

        <div className="modal__description">
          {isProducer ? (
            <ul>
              <p><strong>A Producer can:</strong></p>
              <li>Add new products</li>
              <li>Pack ordered items with our reusable containers</li>
              <li>Ship the order</li>
              <li>Checkin the containers before using them for another order</li>
            </ul>
          ) : (
            <ul>
              <p><strong>An User can:</strong></p>
              <li>Browse and buy producuts from local producers</li>
              <li>Get your grocery delivered in reusable containers</li>
              <li>Return the containers so they can be used for another customer</li>
            </ul>
          )}
        </div>

        <div className="modal__actions">
          <button
            className="modal__btn modal__btn--primary"
            onClick={() => onChooseRole(isProducer ? "Producer" : "User")}
          >
            <strong>Confirm</strong>
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoleModal;