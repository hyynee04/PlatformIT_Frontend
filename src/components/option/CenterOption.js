import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/card/OptionCard.css";
import { CenterStatus } from "../../constants/constants";
import DiagLockCenterForm from "../diag/DiagLockCenterForm";
import DiagUnlockCenterForm from "../diag/DiagUnlockCenterForm";
const CenterOption = ({
  idCenterSelected,
  statusCenterSelected,
  onCenterOption,
  isReactivatable,
}) => {
  const navigate = useNavigate();
  const [isOptionVisible, setIsOptionVisible] = useState(true);

  const [isModalLockCenter, setIsModalLockCenter] = useState(false);
  const openLockCenterModal = () => setIsModalLockCenter(true);
  const closeLockCenterModal = () => setIsModalLockCenter(false);

  const [isModalUnlockCenter, setIsModalUnlockCenter] = useState(false);
  const openUnlockCenterModal = () => setIsModalUnlockCenter(true);
  const closeUnlockCenterModal = () => setIsModalUnlockCenter(false);
  const handleLockCenter = () => {
    setIsOptionVisible(false);
    openLockCenterModal();
  };
  const handleUnlockCenter = () => {
    setIsOptionVisible(false);
    openUnlockCenterModal();
  };
  return (
    <>
      {isModalLockCenter && (
        <DiagLockCenterForm
          isOpen={isModalLockCenter}
          onClose={closeLockCenterModal}
          idCenterSelected={idCenterSelected}
          statusCenterSelected={statusCenterSelected}
          onCenterOption={onCenterOption}
        />
      )}
      {isModalUnlockCenter && (
        <DiagUnlockCenterForm
          isOpen={isModalUnlockCenter}
          onClose={closeUnlockCenterModal}
          idCenterSelected={idCenterSelected}
          statusCenterSelected={statusCenterSelected}
          onCenterOption={onCenterOption}
        />
      )}
      {!isModalLockCenter && isOptionVisible && (
        <div className="container-options userOption">
          {statusCenterSelected === CenterStatus.active && (
            <button className="op-buts" onClick={handleLockCenter}>
              <span>Lock center</span>
            </button>
          )}
          {isReactivatable && (
            <button className="op-buts" onClick={handleUnlockCenter}>
              <span>Unlock center</span>
            </button>
          )}
          <button
            className="op-buts"
            onClick={() => {
              navigate('/centerDetail', {
                state: {
                  idCenter: idCenterSelected,
                  idUser: localStorage.getItem("idUser"),
                  idRole: localStorage.getItem("idRole")
                }
              });
              setIsOptionVisible(false)
            }}
          >
            <span>View detail</span>
          </button>
        </div>
      )}
    </>
  );
};

export default CenterOption;
