import React from "react";
import { LuUserX, LuX } from "react-icons/lu";
import { postInactiveUser } from "../services/userService";

import "../assets/scss/card/DiagForm.scss";

const DiagInactiveForm = ({ isOpen, onClose, idUserSelected }) => {
  const handleInactiverUser = async () => {
    const idUserUpdatedBy = +localStorage.getItem("idUser");
    try {
      let data = await postInactiveUser(idUserSelected, idUserUpdatedBy);

      console.log("Response data:", data);

      if (data === true) {
        console.log("User successfully set to inactive.");
      } else {
        console.error("Failed to set user inactive:", data);
      }
    } catch (error) {
      console.error("Error while inactivating user:", error);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuUserX className="diag-icon" />
            <span className="diag-title">Inactive User</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure you want to inactive this user!</span>
          <div className="act-btns">
            <button className="btn diag-btn cancle" onClick={onClose}>
              Cancle
            </button>
            <button
              className="btn diag-btn signout"
              onClick={() => {
                handleInactiverUser();
                onClose();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagInactiveForm;
