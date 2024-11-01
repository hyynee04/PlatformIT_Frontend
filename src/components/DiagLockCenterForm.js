import React from "react";
import { LuLock, LuX } from "react-icons/lu";
import { postLockCenter } from "../services/centerService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const DiagLockCenterForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLockCenter = async () => {
    try {
      await postLockCenter();
      localStorage.clear();
      dispatch({ type: "RESET_APP" });
      navigate("/");
    } catch (error) {
      throw error;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div
          className="diag-header lock"
          style={{ backgroundColor: "var(--red-color)" }}
        >
          <div className="container-title">
            <LuLock className="diag-icon" />
            <span className="diag-title">Lock Center</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>
            Confirm Locking of <strong>Center</strong> and Associated Accounts
          </span>
          <div
            style={{
              color: "var(--black-color)",
              fontSize: "14px",
              maxWidth: "800px",
              lineHeight: "1.5",
              margin: "16px 0",
              textAlign: "justify",
            }}
          >
            <p
              style={{
                lineHeight: "1.5",
                textAlign: "justify",
              }}
            >
              <strong>Important Notice:</strong> Locking the center will lead to
              the following actions and restrictions:
            </p>
            <ul>
              <li>
                <strong>Access Restriction:</strong> All <strong>admin</strong>{" "}
                and <strong>teacher</strong> accounts associated with this
                center will be deactivated. These users will be unable to log in
                or perform any system-related actions.
              </li>
              <li>
                <strong>Email Notification:</strong> A notification will be sent
                to affected admin and teacher accounts informing them of the
                center’s locked status and their subsequent loss of access.
              </li>
              <li>
                <strong>Course Continuity:</strong> All ongoing courses managed
                by the center will remain active and accessible to currently
                enrolled students, ensuring uninterrupted learning experiences.
                However, new student enrollments will not be permitted.
              </li>
              <li>
                <strong>Data Retention and Security:</strong> All data, records,
                and activity logs will be securely retained and protected during
                the locked period, ensuring no loss of information.
              </li>
              <li>
                <strong>Center Operations Suspension:</strong> All
                administrative actions, including user management, role
                assignments, and center configuration, will be suspended until
                the center is reactivated.
              </li>
            </ul>
            <p
              style={{
                lineHeight: "1.5",
                textAlign: "justify",
              }}
            >
              <strong>Reactivation Process:</strong> To unlock and restore full
              access and functionality to the center, please reach out to our
              support team via the platform’s support channels at{" "}
              <a href="mailto:plaitplatform@gmail.com">
                plaitplatform@gmail.com
              </a>
              . Our team will guide you through the reactivation process and
              answer any questions.
            </p>
          </div>

          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn cancle"
                style={{
                  color: "var(--red-color)",
                  border: "1px solid var(--red-color)",
                }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn diag-btn signout"
                style={{ backgroundColor: "var(--red-color)" }}
                onClick={() => {
                  handleLockCenter();
                  onClose();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagLockCenterForm;
