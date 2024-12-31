import React, { useState, useSyncExternalStore } from "react";
import { LuLock, LuTrash2 } from "react-icons/lu";

import { APIStatus } from "../../constants/constants";
import { postForgotPassword } from "../../services/userService";
import { ImSpinner2 } from "react-icons/im";
const DiagForgotPassword = (props) => {
  const { isOpen, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [verifyMessage, setVerifyMessage] = useState({
    error: "",
    success: "",
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleForgotPassword = async () => {
    // validate email
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setVerifyMessage({ ...verifyMessage, error: "Invalid email!" });
      return;
    }
    setLoading(true);
    try {
      let response = await postForgotPassword(email);
      if (response.status !== APIStatus.success) {
        setVerifyMessage({
          ...verifyMessage,
          error: "Something went wrong! Check your email or connection!",
        });
        return;
      } else {
        setVerifyMessage({
          ...verifyMessage,
          success: "We have sent an email to you. Please check it out!",
        });
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const resetMessage = () => {
    setVerifyMessage({ error: "", success: "" });
    setEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${isOpen ? "float-in" : "float-out"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diag-header">
          <div className="container-title">
            <LuLock className="diag-icon" />
            <span className="diag-title">Forgot password</span>
          </div>
        </div>
        <div className="diag-body">
          <div className="verify-otp-container">
            <input
              type="text"
              placeholder="Enter your email..."
              value={email}
              onChange={(event) => {
                resetMessage();
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="error-message-container">
            <span
              className={`${
                !verifyMessage.success ? "error-noti" : "success-noti"
              }`}
            >
              {verifyMessage.error || verifyMessage.success}
            </span>
          </div>
          <div className="str-btns">
            <div className="act-btns">
              {!verifyMessage.success && (
                <button
                  className="btn diag-btn cancel"
                  onClick={() => {
                    onClose();
                    resetMessage();
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className={`btn diag-btn signout`}
                onClick={() => {
                  if (verifyMessage.success) {
                    onClose();
                    resetMessage();
                  } else {
                    handleForgotPassword();
                  }
                }}
                disabled={verifyMessage.error || !email}
              >
                {loading && <ImSpinner2 className="icon-spin" />}
                {verifyMessage.success ? "Close" : "Sent"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagForgotPassword;
