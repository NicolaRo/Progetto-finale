import { useState, useRef, useEffect } from 'react';

interface RoleModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onChooseRole: (role: "User" | "Producer") => void;
}

const RoleModal = ({ isOpen, userName, onClose, onChooseRole }: RoleModalProps) => {

  const [isProducer, setIsProducer] = useState(false);

  const firstCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstCardRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent, setProducer: boolean) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsProducer(setProducer);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2 className="text-h2">Welcome, {userName}! 👋</h2>
        <p className="text-subtitle">Please choose your role in PackBack:</p>

        <div className="role-cards" role="radiogroup" aria-label="Choose your role">
          <div
            ref={firstCardRef}
            className={`role-card ${!isProducer ? "active" : ""}`}
            onClick={() => setIsProducer(false)}
            role="radio"
            aria-checked={!isProducer}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, false)}
          >
            <span className="role-card-icon">🛒</span>
            <h3 className="text-card-title">User</h3>
            <p className="text-body">Buy products from local producers and get them in reusable containers.</p>
          </div>

          <div
            className={`role-card ${isProducer ? "active" : ""}`}
            onClick={() => setIsProducer(true)}
            role="radio"
            aria-checked={isProducer}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, true)}
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