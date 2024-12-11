import React, { useState } from "react";
import { LuLogOut, LuX } from "react-icons/lu";
import { postEnrollCourse } from "../../services/courseService";
import { APIStatus } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const DiagBuyCourseForm = ({ isOpen, onClose, idCourse }) => {
  const navigate = useNavigate();
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);

  const openSuccessModal = () => setIsModalSuccessOpen(true);
  const closeSuccessModal = () => setIsModalSuccessOpen(false);
  const handleBuyCourse = async () => {
    let idUser = +localStorage.getItem("idUser");
    if (idUser) {
      const response = await postEnrollCourse(idCourse);
      if (response.status === APIStatus.success) {
        openSuccessModal();
        // setIsEnrolledCourse(true);
      }
      //   openSuccessModal();
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diag-header">
          <div className="container-title">
            <LuLogOut className="diag-icon" />
            <span className="diag-title">Sign Out</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>Are you sure you want to buy this course?</span>
          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleBuyCourse();
                  onClose();
                }}
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagBuyCourseForm;
