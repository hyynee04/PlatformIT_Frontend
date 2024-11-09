import React, { useState } from "react";
import { LuUserPlus, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { fetchListUserOfCenter } from "../../store/listUserOfCenter";
import { Role } from "../../constants/constants";

import "../../assets/scss/card/DiagForm.scss";
import {
  postAddCenterAmin,
  postAddTeacher,
} from "../../services/centerService";
const DiagAddUserForm = ({ isOpen, onClose, roleAdded }) => {
  const idCenter = +localStorage.getItem("idCenter");
  const idUserUpdatedBy = +localStorage.getItem("idUser");
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorString, setErrorString] = useState("");
  const handleAddUser = async () => {
    if (roleAdded === Role.teacher) {
      try {
        const data = await postAddTeacher(email, username, password, idCenter);
        if (!data.accountId) {
          setErrorString(data.message);
        } else {
          onClose();
          dispatch(fetchListUserOfCenter(Role.teacher));
        }
      } catch (error) {
        console.error("Error while add teacher center: ", error);
      }
    } else if (roleAdded === Role.centerAdmin) {
      try {
        const data = await postAddCenterAmin(
          username,
          email,
          password,
          idCenter,
          idUserUpdatedBy
        );
        if (
          data.message !==
          "Center Admin is created and notification email sent."
        ) {
          setErrorString(data.message);
        } else {
          onClose();
          dispatch(fetchListUserOfCenter(Role.centerAdmin));
        }
      } catch (error) {
        console.error("Error while approving center: ", error);
      }
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuUserPlus className="diag-icon" />
            {roleAdded === Role.teacher ? (
              <span className="diag-title">Add new teacher</span>
            ) : (
              <span className="diag-title">Add new admin</span>
            )}
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <div className="container-diag-field">
            <div className="left-diag-container">
              <div className="info">
                <span>Username</span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="info">
                <span>Email</span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="right-diag-container">
              <div className="info">
                <span>Password</span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="str-btns">
            {errorString && <span className="error-str">{errorString}</span>}
            <div className="act-btns">
              <button className="btn diag-btn cancle" onClick={onClose}>
                Cancle
              </button>
              <button
                className="btn diag-btn signout"
                onClick={async () => {
                  await handleAddUser();
                  // onClose();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagAddUserForm;