import React from "react";
import { FiSettings } from "react-icons/fi";
import { LuX } from "react-icons/lu";
import "../../assets/css/card/DiagForm.css";
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
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
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
                <div className="item setting-course">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isApprovedLecture}
                      onChange={handleApprovedLectureChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <label style={{ color: "var(--black-color)" }}>
                    Require lecture approval before publishing
                  </label>
                </div>
              </div>

              {/* <div className="info">
                <div className="item setting-course">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isSequenced}
                      onChange={handleSequencedChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <label style={{ color: "var(--black-color)" }}>
                    Enforce lecture sequence completion
                  </label>
                </div>
              </div> */}
            </div>
            <div className="right-diag-container"></div>
          </div>

          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
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
