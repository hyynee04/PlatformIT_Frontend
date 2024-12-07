import React from "react";
import { LuLogOut, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../assets/css/card/DiagForm.css";
import { resetCenterPI } from "../../store/profileCenterSlice";
import { resetUserPI } from "../../store/profileUserSlice";

const DiagSignOutForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.clear();
    dispatch(resetUserPI());
    dispatch(resetCenterPI());
    navigate("/");
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diag-header">
          <div className="container-title">
            <LuLogOut className="diag-icon" />
            <span className="diag-title">Sign Out</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure you want to sign out?</span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                Cancel
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
    </div>
  );
};

export default DiagSignOutForm;
