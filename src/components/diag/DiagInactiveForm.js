import React from "react";
import { LuUserX, LuX } from "react-icons/lu";

import { useDispatch } from "react-redux";
import "../../assets/css/card/DiagForm.css";
import { Role } from "../../constants/constants";
import { fetchListUserOfCenter } from "../../store/listUserOfCenter";
import { fetchAllUsers, updateUserStatus } from "../../store/userSlice";

const DiagInactiveForm = ({
  isOpen,
  onClose,
  idUserSelected,
  onUserInactivated,
  roleUserSelected,
}) => {
  const dispatch = useDispatch();
  const idRole = +localStorage.getItem("idRole");
  const handleInactiverUser = async () => {
    try {
      const resultAction = await dispatch(updateUserStatus({ idUserSelected }));
      if (updateUserStatus.fulfilled.match(resultAction)) {
        if (idRole === Role.platformAdmin) {
          dispatch(fetchAllUsers());
        } else if (idRole === Role.centerAdmin) {
          if (roleUserSelected === Role.teacher) {
            dispatch(fetchListUserOfCenter(Role.teacher));
          } else if (roleUserSelected === Role.centerAdmin) {
            dispatch(fetchListUserOfCenter(Role.centerAdmin));
          }
        }

        onUserInactivated(); //To not show option
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
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diag-header">
          <div className="container-title">
            <LuUserX className="diag-icon" />
            <span className="diag-title">Inactive User</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>
            Are you sure you want to deactivate this user?
            <br />
            <br />
            <strong>Note:</strong> Deactivated users cannot log in until
            reactivated.
          </span>

          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
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
    </div>
  );
};

export default DiagInactiveForm;
