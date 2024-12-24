import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ImSpinner2 } from "react-icons/im";
import { LuClipboardCheck, LuClipboardX, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import {
  approveQualification,
  fetchTaskOfCenterAd,
  rejectQualification,
} from "../../store/listTaskOfCenterAd";

const DiagActionQualiForm = ({
  isOpen,
  onClose,
  idUser,
  idQualification,
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
  const handleApproveQualification = async () => {
    setLoadingBtn((prevState) => ({
      ...prevState,
      approve: true,
    }));
    try {
      const resultAction = await dispatch(
        approveQualification({ idUser, idQualification })
      );
      if (approveQualification.fulfilled.match(resultAction)) {
        dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
      }
    } catch (error) {
      console.error("Error while approving qualification: ", error);
    } finally {
      setLoadingBtn((prevState) => ({
        ...prevState,
        approve: false,
      }));
    }
  };
  const handleRejectQualification = async () => {
    if (reason) {
      setLoadingBtn((prevState) => ({
        ...prevState,
        reject: false,
      }));
      try {
        const resultAction = await dispatch(
          rejectQualification({ idUser, idQualification, reason })
        );
        if (rejectQualification.fulfilled.match(resultAction)) {
          dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
          onClose();
        }
      } catch (error) {
        console.error("Error while rejecting qualification: ", error);
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
              <span className="diag-title">Approve Qualification</span>
            </div>
            <LuX className="diag-icon" onClick={onClose} />
          </div>
          <div className="diag-body">
            <span>Are you sure to Approve this qualification?</span>
            <div className="str-btns">
              <div className="act-btns">
                <button className="btn diag-btn cancel" onClick={onClose}>
                  No
                </button>
                <button
                  className="btn diag-btn signout"
                  onClick={async () => {
                    await handleApproveQualification();
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
              <span className="diag-title">Reject Qualification</span>
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
                    await handleRejectQualification();
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

export default DiagActionQualiForm;
