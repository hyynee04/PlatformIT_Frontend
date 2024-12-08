import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { LuBuilding2, LuX } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  approveCenter,
  fetchCenters,
  rejectCenter,
} from "../../store/listCenterSlice";

import "../../assets/css/card/DiagForm.css";
const DiagActionCenterForm = ({
  isOpen,
  onClose,
  idCenterSelected,
  activeStatus,
  isApproveAction,
}) => {
  const dispatch = useDispatch();
  const idUserUpdated = +localStorage.getItem("idUser");
  const [reasonReject, setReasonReject] = useState(null);
  const [errorRejectString, setErrorRejectString] = useState("");
  const [loadingBtn, setLoadingBtn] = useState({
    approve: false,
    reject: false,
  });

  const handleApproveCenter = async () => {
    setLoadingBtn((prevState) => ({
      ...prevState,
      approve: true,
    }));
    try {
      const resultAction = await dispatch(
        approveCenter({ idCenterSelected: idCenterSelected, idUserUpdated })
      );
      if (approveCenter.fulfilled.match(resultAction)) {
        dispatch(fetchCenters(activeStatus));
        onClose();
      }
    } catch (error) {
      console.error("Error while approving center: ", error);
    }
    setLoadingBtn((prevState) => ({
      ...prevState,
      approve: false,
    }));
  };

  const handleRejectCenter = async () => {
    if (reasonReject.trim()) {
      try {
        const resultAction = await dispatch(
          rejectCenter({ idCenterSelected, reasonReject, idUserUpdated })
        );
        if (rejectCenter.fulfilled.match(resultAction)) {
          dispatch(fetchCenters(activeStatus));
        }
      } catch (error) {
        console.error("Error while rejecting center: ", error);
      }
    } else {
      setErrorRejectString("Please enter reason for rejection");
      setTimeout(() => {
        setErrorRejectString("");
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {isApproveAction === true ? (
        <div
          className="modal-container slide-to-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="diag-header">
            <div className="container-title">
              <LuBuilding2 className="diag-icon" />
              <span className="diag-title">Approve Center</span>
            </div>
            <LuX className="diag-icon" onClick={onClose} />
          </div>
          <div className="diag-body">
            <span>Are you sure to Approve this center?</span>
            <div className="str-btns">
              <div className="act-btns">
                <button className="btn diag-btn cancel" onClick={onClose}>
                  No
                </button>
                <button
                  className="btn diag-btn signout"
                  onClick={async () => {
                    await handleApproveCenter();
                  }}
                >
                  {loadingBtn.approve && (
                    <ImSpinner2 className="icon-spin" color="#397979" />
                  )}
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="modal-container slide-to-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="diag-header">
            <div className="container-title">
              <LuBuilding2 className="diag-icon" />
              <span className="diag-title">Reject Center</span>
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
                value={reasonReject || ""}
                onChange={(e) => setReasonReject(e.target.value)}
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
                    await handleRejectCenter();
                  }}
                >
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

export default DiagActionCenterForm;
