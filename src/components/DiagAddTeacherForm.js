import React, { useState } from "react";
import { LuUserPlus, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { addTeacher, fetchListUserOfCenter } from "../store/listUserOfCenter";
import { Role } from "../constants/constants";

import "../assets/scss/card/DiagForm.scss";
const DiagAddTeacherForm = ({ isOpen, onClose }) => {
  const idCenter = +localStorage.getItem("idCenter");
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleAddTeacher = async () => {
    // let data = await postAddTeacher(email, username, password, idCenter);

    // console.log(data);
    try {
      const resultAction = await dispatch(
        addTeacher({ email, username, password, idCenter })
      );
      if (addTeacher.fulfilled.match(resultAction)) {
        console.log("Add teacher successfully");
        dispatch(fetchListUserOfCenter(Role.teacher));
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
            <LuUserPlus className="diag-icon" />
            <span className="diag-title">Add new teacher</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          {/* <span>Are you sure you want to inactive this user!</span> */}
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
          <div className="act-btns">
            <button className="btn diag-btn cancle" onClick={onClose}>
              Cancle
            </button>
            <button
              className="btn diag-btn signout"
              onClick={async () => {
                await handleAddTeacher();
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

export default DiagAddTeacherForm;
