import React from "react";
import { LuCheckCheck, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
const DiagCreateSuccessfully = ({
  isOpen,
  onClose,
  notification,
  clearData,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${isOpen ? "float-in" : "float-out"}`}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "500px" }}
      >
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
                className="btn diag-btn cancel"
                onClick={() => {
                  onClose();
                  navigate(-1);
                }}
              >
                Back to Previous Page
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  clearData();
                  onClose();
                }}
              >
                Create new lecture
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagCreateSuccessfully;
