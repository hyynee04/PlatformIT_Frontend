import React, { useState } from "react";
import { LuImageOff, LuX } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import "../../assets/css/card/DiagForm.css";
import { postRemoveAvatar } from "../../services/userService";
import { fetchCenterProfile } from "../../store/profileCenterSlice";
import { fetchUserProfile } from "../../store/profileUserSlice";

const DiagRemoveImgForm = ({ isOpen, onClose, isAvatar }) => {
  const dispatch = useDispatch();
  const userId = +localStorage.getItem("idUser");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const handleRemoveAvatar = async () => {
    setLoadingBtn(true);
    try {
      if (isAvatar) {
        await postRemoveAvatar(true);
        await dispatch(fetchUserProfile(userId));
      } else {
        await postRemoveAvatar(false);
        await dispatch(fetchCenterProfile());
      }

      onClose();
    } catch (error) {
      throw error;
    } finally {
      setLoadingBtn(false);
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
            <LuImageOff className="diag-icon" />
            {isAvatar ? (
              <span className="diag-title">Remove Avatar</span>
            ) : (
              <span className="diag-title">Remove Cover Image of Center</span>
            )}
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          {isAvatar ? (
            <span>Are you sure you want to delete your avatar?</span>
          ) : (
            <span>Are you sure you want to delete the center cover image?</span>
          )}

          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancel" onClick={onClose}>
                No
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleRemoveAvatar();
                }}
              >
                {loadingBtn && (
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

export default DiagRemoveImgForm;
