import React, { useEffect, useState } from "react";
import { LuCheckCheck, LuX, LuPenLine } from "react-icons/lu";
const DiagUpdateConfirmation = ({ isOpen, onClose, message }) => {
  const [loading, setLoading] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);

  const editLecture = (idList, lectureData, lectureStatus) => {
    setLoading(true);
    try {
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
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
            {isSucceeded ? (
              <>
                <LuCheckCheck className="diag-icon" />
                <span className="diag-title">Successfully</span>
              </>
            ) : (
              <>
                <LuPenLine className="diag-icon" />
                <span className="diag-title">Update confirmation</span>
              </>
            )}
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>{message}</span>
          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn cancel"
                onClick={() => {
                  onClose();
                }}
              >
                No
              </button>
              {isSucceeded ? (
                <button
                  className="btn diag-btn signout"
                  onClick={() => {
                    onClose();
                  }}
                >
                  OK
                </button>
              ) : (
                <button
                  className="btn diag-btn signout"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Save changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagUpdateConfirmation;
