import React, { useEffect, useState } from "react";
import { LuCheckCheck, LuX, LuPenLine } from "react-icons/lu";
import { postUpdateLecture } from "../../services/courseService";
import { APIStatus, LectureStatus } from "../../constants/constants";
import { ImSpinner2 } from "react-icons/im";
const DiagUpdateConfirmation = ({
  isOpen,
  onClose,
  message,
  editLecture,
  setLectureStatus,
  lectureStatus,
  idList,
  fetchData,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);

  const handleEditLecture = async (idList, lectureData, lectureStatus) => {
    setLoading(true);
    try {
      const response = await postUpdateLecture(
        idList,
        lectureData,
        lectureStatus
      );
      if (response.status === APIStatus.success) {
        setIsSucceeded(true);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  console.log(lectureStatus);

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
          <span>{isSucceeded ? "Update successfully" : message}</span>
          <div className="str-btns">
            <div className="act-btns">
              {isSucceeded ? (
                <button
                  className="btn diag-btn signout"
                  onClick={() => {
                    onClose();
                    setIsSucceeded(false);
                    if (lectureStatus) {
                      setLectureStatus(lectureStatus);
                    }
                    fetchData();
                  }}
                >
                  OK
                </button>
              ) : (
                <>
                  <button
                    className="btn diag-btn cancel"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    No
                  </button>
                  <button
                    className="btn diag-btn signout"
                    onClick={() => {
                      handleEditLecture(
                        idList,
                        editLecture,
                        lectureStatus ? lectureStatus : LectureStatus.active
                      );
                    }}
                  >
                    {loading && <ImSpinner2 className="icon-spin" />}
                    Save changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagUpdateConfirmation;
