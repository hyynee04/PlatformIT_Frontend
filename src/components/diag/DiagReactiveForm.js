import React from "react";
import { LuUserCheck, LuX } from "react-icons/lu";
import { postReactiveUser } from "../../services/userService";
import { useDispatch } from "react-redux";
import { Role } from "../../constants/constants";
import { fetchAllUsers } from "../../store/userSlice";
import { fetchListUserOfCenter } from "../../store/listUserOfCenter";

const DiagReactiveForm = ({
  isOpen,
  onClose,
  idUserSelected,
  onUserInactivated,
  roleUserSelected,
}) => {
  const dispatch = useDispatch();
  const idRole = +localStorage.getItem("idRole");
  const handleReactiverUser = async () => {
    await postReactiveUser(idUserSelected);
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
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuUserCheck className="diag-icon" />
            <span className="diag-title">Reactive User</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>
            Are you sure you want to reactivate this user?
            <br />
            <br />
            <strong>Note:</strong> This will allow the user to log in and access
            the system again.
          </span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                No
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleReactiverUser();
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

export default DiagReactiveForm;
