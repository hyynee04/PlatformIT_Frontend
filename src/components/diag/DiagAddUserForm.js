import React, { useState } from "react";
import { LuUserPlus, LuX } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { APIStatus, Role } from "../../constants/constants";
import { fetchListUserOfCenter } from "../../store/listUserOfCenter";

import "../../assets/css/card/DiagForm.css";
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
  const [fullName, setFullName] = useState("");
  const [errorString, setErrorString] = useState("");
  const [loading, setLoading] = useState(false);
  const handleAddUser = async () => {
    if (roleAdded === Role.teacher) {
      setLoading(true);
      try {
        const response = await postAddTeacher(
          fullName,
          email,
          username,
          password,
          idCenter
        );
        const data = response.data;

        if (response.status !== APIStatus.success) {
          setErrorString(data.message);
        } else {
          onClose();
          dispatch(fetchListUserOfCenter(Role.teacher));
        }
      } catch (error) {
        console.error("Error while add teacher center: ", error);
      } finally {
        setLoading(false);
      }
    } else if (roleAdded === Role.centerAdmin) {
      setLoading(true);
      try {
        const response = await postAddCenterAmin(
          fullName,
          username,
          email,
          password,
          idCenter,
          idUserUpdatedBy
        );
        const data = response.data;
        if (response.status !== APIStatus.success) {
          setErrorString(data.message);
        } else {
          onClose();
          dispatch(fetchListUserOfCenter(Role.centerAdmin));
        }
      } catch (error) {
        console.error("Error while approving center: ", error);
      } finally {
        setLoading(false);
      }
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
                <span>
                  Email<span className="required">*</span>
                </span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="info">
                <span>
                  Username<span className="required">*</span>
                </span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="right-diag-container">
              <div className="info">
                <span>
                  Fullname<span className="required">*</span>
                </span>
                <input
                  type="text"
                  className="input-form-diag"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="info">
                <span>
                  Password<span className="required">*</span>
                </span>
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
              <button className="btn diag-btn cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn diag-btn signout"
                disabled={!email || !fullName || !username || !password}
                onClick={async () => {
                  await handleAddUser();
                  setErrorString("");
                }}
              >
                {loading && (
                  <ImSpinner2 className="icon-spin" color="#393979" />
                )}
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
