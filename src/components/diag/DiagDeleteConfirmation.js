import React, { useEffect, useState } from "react";
import { LuCheckCheck, LuTrash2, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { inactiveLecture, inactiveSection } from "../../services/courseService";
import { APIStatus } from "../../constants/constants";
import { deleteComment } from "../../services/commentService";
const DiagDeleteConfirmation = (props) => {
  const { isOpen, onClose, object, fetchData } = props;
  const navigate = useNavigate();
  const idUser = +localStorage.getItem("idUser");
  const [isSucceed, setIsSucceed] = useState(false);
  if (!isOpen) return null;

  const deleteSection = async () => {
    try {
      let response = await inactiveSection(object.id, idUser);
      if (response.status === APIStatus.success) {
        setIsSucceed(true);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const deleteLecture = async () => {
    try {
      let response = await inactiveLecture(object.id, idUser);
      if (response.status === APIStatus.success) {
        navigate(-1);
      }
    } catch (error) {
      console.log("Error posting data: ", error);
    }
  };

  const removeComment = async () => {
    try {
      let response = await deleteComment(object.id, idUser);
      if (response.status === APIStatus.success) {
        setIsSucceed(true);
      }
    } catch (error) {
      console.log("Error posting data: ", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${isOpen ? "float-in" : "float-out"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="diag-header"
          style={{
            backgroundColor: isSucceed
              ? "var(--main-color)"
              : "var(--red-color)",
          }}
        >
          <div className="container-title">
            <LuTrash2 className="diag-icon" />
            <span className="diag-title">
              {isSucceed ? "Successfully" : "Remove"}
            </span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>{isSucceed ? "Remove successfully!" : object.message}</span>
          <div className="str-btns">
            <div className="act-btns">
              {!isSucceed && (
                <button
                  className="btn diag-btn cancel"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className={`btn diag-btn ${isSucceed ? "signout" : "remove"}`}
                onClick={() => {
                  if (isSucceed) {
                    fetchData();
                    onClose();
                    setIsSucceed(false);
                  } else {
                    if (object.name === "section") deleteSection();
                    else if (object.name === "lecture") deleteLecture();
                    else if (object.name === "comment") removeComment();
                  }
                }}
              >
                {isSucceed ? "Close" : "Yes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagDeleteConfirmation;
