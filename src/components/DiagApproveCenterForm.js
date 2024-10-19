import React from "react";
import { LuListPlus, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { approveCenter, fetchCenters } from "../store/listCenterSlice";

import "../assets/scss/card/DiagForm.scss";
const DiagApproveCenterForm = ({
  isOpen,
  onClose,
  idCenterSelected,
  activeStatus,
}) => {
  const dispatch = useDispatch();
  const handleApproveCenter = async () => {
    const idUserUpdated = +localStorage.getItem("idUser");
    try {
      const resultAction = await dispatch(
        approveCenter({ idCenterSelected: idCenterSelected, idUserUpdated })
      );
      if (approveCenter.fulfilled.match(resultAction)) {
        console.log("Approve center successfully.");
        dispatch(fetchCenters(activeStatus));
      }
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
              onClick={async () => {
                await handleApproveCenter();
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
