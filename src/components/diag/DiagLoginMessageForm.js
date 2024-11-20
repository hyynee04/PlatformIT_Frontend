import { LuAlertTriangle, LuX } from "react-icons/lu";
import "../../assets/scss/card/DiagForm.css";

const DiagLoginMessageForm = (props) => {
  const { message, isOpen, onClose } = props;
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuAlertTriangle className="diag-icon" color="#c00f0c" />
            <span className="diag-title">Login notification</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span className="login-message">{message}</span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
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
