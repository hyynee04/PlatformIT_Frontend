import React, { useEffect, useState } from "react";
import { LuCheckCheck, LuX } from "react-icons/lu";
const DiagSuccessfully = ({ isOpen, onClose, notification }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      const timer = setTimeout(() => {
        onClose(); // Đóng modal sau 3 giây
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShow(false); // Ẩn modal khi isOpen là false
    }
  }, [isOpen, onClose]);
  if (!isOpen && !show) return null;

  return (
    <div className={`modal-overlay ${show ? "show" : ""}`} onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuCheckCheck className="diag-icon" />
            <span className="diag-title">Successfully</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>{notification}</span>
          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagSuccessfully;
