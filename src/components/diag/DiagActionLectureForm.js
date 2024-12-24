import React, { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { LuClipboardCheck, LuClipboardX, LuX } from "react-icons/lu";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import {
  approveLecture,
  fetchTaskOfCenterAd,
  rejectLecture,
} from "../../store/listTaskOfCenterAd";

const DiagActionLectureForm = ({
  isOpen,
  onClose,
  idLecture,
  activeTypeOfTask,
  isApproveAction,
}) => {
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState({
    approve: false,
    reject: false,
  });
  const [reason, setReason] = useState(null);
  const [errorRejectString, setErrorRejectString] = useState("");
  const handleApproveLecture = async () => {
    setLoadingBtn((prevState) => ({
      ...prevState,
      approve: true,
    }));
    try {
      const resultAction = await dispatch(approveLecture({ idLecture }));
      if (approveLecture.fulfilled.match(resultAction)) {
        dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
      }
    } catch (error) {
      console.error("Error while approving lecture: ", error);
    } finally {
      setLoadingBtn((prevState) => ({
        ...prevState,
        approve: false,
      }));
    }
  };
  const handleRejectLecture = async () => {
    if (reason) {
      setLoadingBtn((prevState) => ({
        ...prevState,
        reject: true,
      }));
      try {
        const resultAction = await dispatch(
          rejectLecture({ idLecture, reason })
        );
        if (rejectLecture.fulfilled.match(resultAction)) {
          dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
          onClose();
        }
      } catch (error) {
        console.error("Error while rejecting lecture: ", error);
      } finally {
        setLoadingBtn((prevState) => ({
          ...prevState,
          reject: false,
        }));
      }
    } else {
      setErrorRejectString("Please enter reason for rejection");
      setTimeout(() => {
        setErrorRejectString("");
      }, 1000);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      {isApproveAction === true ? (
        <div
          className="modal-container  slide-to-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="diag-header">
            <div className="container-title">
              <LuClipboardCheck className="diag-icon" />
              <span className="diag-title">Approve Lecture</span>
            </div>
            <LuX className="diag-icon" onClick={onClose} />
          </div>
          <div className="diag-body">
            <span>Are you sure to Approve this lecture?</span>
            <div className="str-btns">
              <div className="act-btns">
                <button className="btn diag-btn cancel" onClick={onClose}>
                  No
                </button>
                <button
                  className="btn diag-btn signout"
                  onClick={async () => {
                    await handleApproveLecture();
                    onClose();
                  }}
                >
                  {loadingBtn.approve && (
                    <ImSpinner2 className="icon-spin" color="#d9d9d9" />
                  )}
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="modal-container  slide-to-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="diag-header">
            <div className="container-title">
              <LuClipboardX className="diag-icon" />
              <span className="diag-title">Reject Lecture</span>
            </div>
            <LuX className="diag-icon" onClick={onClose} />
          </div>
          <div className="diag-body">
            <div className="reject-container">
              <span>Reason for rejection: </span>
              <Form.Control
                as="textarea"
                className="input-area-form-diag"
                placeholder="Write the reason here..."
                value={reason || ""}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="str-btns">
              {errorRejectString && (
                <Alert
                  variant="danger"
                  onClose={() => setErrorRejectString("")}
                  className="error-str"
                >
                  {errorRejectString}
                </Alert>
              )}
              <div className="act-btns">
                <button className="btn diag-btn cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="btn diag-btn signout"
                  onClick={async () => {
                    await handleRejectLecture();
                  }}
                >
                  {loadingBtn.reject && (
                    <ImSpinner2 className="icon-spin" color="#d9d9d9" />
                  )}
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagActionLectureForm;
