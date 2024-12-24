import React from "react";
import { LuX } from "react-icons/lu";
import { IoWarningOutline } from "react-icons/io5";
const DiagNotiWarning = ({ isOpen, onClose, invalidHeader, invalidMsg }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="diag-header"
          //   style={{ backgroundColor: "var(--red-color)" }}
        >
          <div className="container-title">
            <IoWarningOutline className="diag-icon" />
            <span className="diag-title">{invalidHeader}</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>{invalidMsg}</span>

          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn signout"
                // style={{ backgroundColor: "var(--red-color)" }}
                onClick={onClose}
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

export default DiagNotiWarning;
