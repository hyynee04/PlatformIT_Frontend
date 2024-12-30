import React, { useEffect, useState } from "react";
import { LuCheckCheck, LuX } from "react-icons/lu";
import { postEnrollCourse } from "../../services/courseService";
import { APIStatus, LectureStatus } from "../../constants/constants";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { getPayment } from "../../services/paymentService";
const DiagBuyCourseConfirmation = ({
  isOpen,
  onClose,
  idCourse,
  status,
  paymentData,
  setIsEnrolledCourse,
}) => {
  const navigate = useNavigate();
  const idUser = +localStorage.getItem("idUser");
  const [loading, setLoading] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const handleBuyCourse = async () => {
    setLoading(true);
    try {
      if (idUser) {
        const response = await postEnrollCourse(idCourse);
        if (response.status === APIStatus.success) {
          setIsSucceeded(true);
        } else {
          console.error(response.data);
          setIsFailed(true);
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error posting data: ", error);
      setIsFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCourse = async () => {
    setLoading(true);
    try {
      const response = await getPayment(paymentData);
      if (response.status === APIStatus.success) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.log("Error posting data: ", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="diag-header"
          style={{
            backgroundColor: isFailed
              ? "var(--red-color)"
              : "var(--main-color)",
          }}
        >
          <div className="container-title">
            {!isFailed ? (
              <LuCheckCheck className="diag-icon" />
            ) : (
              <LuX className="diag-icon" />
            )}
            <span className="diag-title">
              {isSucceeded
                ? "Successfully"
                : isFailed
                ? "Error"
                : "Buy Confirmation"}
            </span>
          </div>
        </div>
        <div className="diag-body">
          <span>
            {isSucceeded
              ? "Buy successfully"
              : isFailed
              ? "Something went wrong"
              : "Are you sure to buy this course?"}
          </span>
          <div className="str-btns">
            <div className="act-btns">
              {isSucceeded || isFailed ? (
                <button
                  className="btn diag-btn signout"
                  style={{
                    backgroundColor: isFailed
                      ? "var(--red-color)"
                      : "var(--main-color)",
                  }}
                  onClick={() => {
                    onClose();
                    if (isSucceeded) {
                      setIsEnrolledCourse(true);
                      setIsSucceeded(false);
                    } else {
                      setIsFailed(false);
                    }
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
                      if (status === 1) handleBuyCourse();
                      else handlePaymentCourse();
                    }}
                  >
                    {loading && <ImSpinner2 className="icon-spin" />}
                    Buy now
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
export default DiagBuyCourseConfirmation;
