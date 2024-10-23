import React from "react";
import { LuLogOut, LuX } from "react-icons/lu";
import "../assets/scss/card/DiagForm.scss";
import { useNavigate } from "react-router-dom";

const DiagSignOutForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.removeItem("idRole");
    localStorage.removeItem("idUser");
    localStorage.removeItem("idCenter");
    navigate("/");
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuLogOut className="diag-icon" />
            <span className="diag-title">Sign Out</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure you want to sign out!</span>
          <div className="act-btns">
            <button className="btn diag-btn cancle" onClick={onClose}>
              Cancle
            </button>
            <button
              className="btn diag-btn signout"
              onClick={() => {
                handleSignout();
                onClose();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagSignOutForm;
