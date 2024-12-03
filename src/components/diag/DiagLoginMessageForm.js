import { LuAlertTriangle, LuX } from "react-icons/lu";
import "../../assets/css/card/DiagForm.css";

const DiagLoginMessageForm = (props) => {
  const { message, isOpen, onClose } = props;
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${isOpen ? 'float-in' : 'float-out'}`} onClick={(e) => e.stopPropagation()}>
        <div
          className="diag-header"
          style={{ backgroundColor: "var(--yellow-color)" }}
        >
          <div className="container-title">
            <LuAlertTriangle className="diag-icon" color="#ffffff" />
            <span className="diag-title">Login notification</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span className="login-message">{message}</span>
          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn cancel"
                onClick={onClose}
                style={{ backgroundColor: "var(--yellow-color)", color: "var(--white-color)" }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagLoginMessageForm;
