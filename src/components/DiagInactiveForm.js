import React from "react";
import { LuUserX, LuX } from "react-icons/lu";
// import { postInactiveUser } from "../services/userService";

import "../assets/scss/card/DiagForm.scss";
import { fetchAllUsers, updateUserStatus } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { fetchListUserOfCenter } from "../store/listUserOfCenter";
import { Role } from "../constants/constants";

const DiagInactiveForm = ({
  isOpen,
  onClose,
  idUserSelected,
  onUserInactivated,
}) => {
  const dispatch = useDispatch();

  const handleInactiverUser = async () => {
    const idUserUpdatedBy = +localStorage.getItem("idUser");
    try {
      const resultAction = await dispatch(
        updateUserStatus({ idUser: idUserSelected, idUserUpdatedBy })
      );

      if (updateUserStatus.fulfilled.match(resultAction)) {
        // console.log("User successfully set to inactive.");
        dispatch(fetchAllUsers());
        dispatch(fetchListUserOfCenter(Role.teacher));
        onUserInactivated();
      } else {
        console.error("Failed to set user inactive.");
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
              No
            </button>
            <button
              className="btn diag-btn signout"
              onClick={() => {
                handleInactiverUser();
                // onClose();
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

export default DiagInactiveForm;
