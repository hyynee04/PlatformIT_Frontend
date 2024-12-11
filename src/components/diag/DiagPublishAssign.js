import React, { useState } from "react";
import { LuX } from "react-icons/lu";
import { MdPublish } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { postPublishAssignment } from "../../services/assignmentService";
import { APIStatus } from "../../constants/constants";

const DiagPublishAssign = ({
  isOpen,
  onClose,
  idAssignment,
  onPublishSuccess,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handlePublishAssign = async () => {
    setLoading(true);
    try {
      const response = await postPublishAssignment(idAssignment);
      if (response.status === APIStatus.success) {
        onClose();
        onPublishSuccess();
        navigate("/teacherAssignment");
      }
    } catch (error) {
      throw error;
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
            <MdPublish className="diag-icon" />
            <span className="diag-title">Publish Assignment</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure you want to publish this assignment?</span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                No
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handlePublishAssign();
                }}
              >
                {loading && (
                  <ImSpinner2 className="icon-spin" color="#d9d9d9" />
                )}
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagPublishAssign;
