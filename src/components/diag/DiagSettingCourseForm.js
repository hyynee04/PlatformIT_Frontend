import React from "react";
import { FiSettings } from "react-icons/fi";
import { LuX } from "react-icons/lu";
import Form from "react-bootstrap/Form";
import "../../assets/scss/card/DiagForm.scss";
const DiagSettingCourseForm = ({
  isOpen,
  onClose,
  isApprovedLecture,
  isSequenced,
  onSettingChange,
}) => {
  const handleApprovedLectureChange = (e) => {
    onSettingChange({ isApprovedLecture: e.target.checked, isSequenced });
  };

  const handleSequencedChange = (e) => {
    onSettingChange({ isApprovedLecture, isSequenced: e.target.checked });
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <FiSettings className="diag-icon" />
            <span className="diag-title">Setting Course</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <div className="container-diag-field">
            <div className="left-diag-container">
              <div className="info">
                <Form>
                  <Form.Check
                    type="switch"
                    className="custom-switch"
                    label="Require lecture approval before publishing"
                    checked={isApprovedLecture}
                    onChange={handleApprovedLectureChange}
                  />
                </Form>
              </div>
              <div className="info">
                <Form>
                  <Form.Check
                    type="switch"
                    className="custom-switch"
                    label="Enforce lecture sequence completion"
                    checked={isSequenced}
                    onChange={handleSequencedChange}
                  />
                </Form>
              </div>
            </div>
            <div className="right-diag-container"></div>
          </div>

          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancle" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  onSettingChange({ isApprovedLecture, isSequenced });
                  onClose();
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

export default DiagSettingCourseForm;
