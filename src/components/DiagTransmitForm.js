import React from "react";
import { LuUsers, LuX } from "react-icons/lu";
import { postTransferMainAdmin } from "../services/centerService";
import { useDispatch } from "react-redux";
import { fetchListUserOfCenter } from "../store/listUserOfCenter";
import { Role } from "../constants/constants";
import { fetchCenterProfile } from "../store/profileCenterSlice";
const DiagTransmitForm = ({ isOpen, onClose, idUserSelected }) => {
  const dispatch = useDispatch();
  const handleTransmit = async () => {
    try {
      await postTransferMainAdmin(idUserSelected);
      await dispatch(fetchListUserOfCenter(Role.centerAdmin));
      await dispatch(fetchCenterProfile());
    } catch (error) {
      throw error;
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="diag-header">
          <div className="container-title">
            <LuUsers className="diag-icon" />
            <span className="diag-title">Set as Main Admin</span>
          </div>
          <LuX className="diag-icon" onClick={onClose} />
        </div>
        <div className="diag-body">
          <span>
            Are you sure you want to transfer the <strong>Main Admin</strong>{" "}
            role?
          </span>
          <div style={{ color: "var( --black-color)", fontSize: "14px" }}>
            <p>
              <strong>Note:</strong> As the <strong>Main Admin</strong>, this
              role holds the following responsibilities and permissions:
            </p>
            <ul>
              <li>
                Adding and managing <strong>teachers</strong> within the center.
              </li>
              <li>
                Adding, assigning, and managing <strong>sub-admins</strong> to
                assist with center operations.
              </li>
              <li>
                Granting or removing access, as well as{" "}
                <strong>deactivating the center</strong> if necessary.
              </li>
            </ul>
            <p>
              By transferring this role, you will no longer have the above
              permissions, and the selected sub-admin will assume all
              responsibilities as the new Main Admin.
            </p>
          </div>

          <div className="str-btns">
            <div className="act-btns">
              <button className="btn diag-btn cancle" onClick={onClose}>
                No
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  handleTransmit();
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagTransmitForm;
