import React from "react";
import { LuListPlus, LuX } from "react-icons/lu";
import "../assets/scss/card/DiagForm.scss";
import { postApproveCenter } from "../services/centerService";

const DiagApproveCenterForm = ({ isOpen, onClose, idCenterSelected }) => {
  const handleApproveCenter = async () => {
    const idUserUpdated = +localStorage.getItem("idUser");
    try {
      let data = await postApproveCenter(idCenterSelected, idUserUpdated);

      console.log("Response data:", data);

      //   if (data === true) {
      //     console.log("Center successfully approved.");
      //   } else {
      //     console.error("Failed to approve center:", data);
      //   }
    } catch (error) {
      console.error("Error while approving center: ", error);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuListPlus className="diag-icon" />
            <span className="diag-title">Approve Center</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure to Approve this center?</span>
          <div className="act-btns">
            <button className="btn diag-btn cancle" onClick={onClose}>
              No
            </button>
            <button
              className="btn diag-btn signout"
              onClick={() => {
                handleApproveCenter();
                onClose();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagApproveCenterForm;
