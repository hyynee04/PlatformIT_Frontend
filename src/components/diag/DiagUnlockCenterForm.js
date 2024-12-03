import React from "react";
import { LuUnlock, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { postUnlockCenter } from "../../services/centerService";
import { fetchCenters } from "../../store/listCenterSlice";
import { CenterStatus } from "../../constants/constants";
const DiagUnlockCenterForm = ({
  isOpen,
  onClose,
  idCenterSelected,
  onCenterOption,
}) => {
  const dispatch = useDispatch();
  const handleUnlockCenter = async () => {
    try {
      await postUnlockCenter(idCenterSelected);
      dispatch(fetchCenters(CenterStatus.active));
      onCenterOption();
    } catch (error) {
      throw error;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuUnlock className="diag-icon" />
            <span className="diag-title">Unlock Center</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span
            style={{
              maxWidth: "600px",
              textAlign: "justify",
            }}
          >
            Are you sure you want to unlock this center?
            <br />
            <br />
            <strong>Note:</strong> Only users (center admin and teachers) who
            were active before the center was locked will be allowed to operate
            and log in to the system again.
          </span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                No
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleUnlockCenter();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagUnlockCenterForm;
