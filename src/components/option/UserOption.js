import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import "../../assets/css/card/OptionCard.css";
import { Role, UserStatus } from "../../constants/constants";
import DiagInactiveForm from "../diag/DiagInactiveForm";
import DiagReactiveForm from "../diag/DiagReactiveForm";
import DiagTransmitForm from "../diag/DiagTransmitForm";

const UserOption = ({
  idUserSelected,
  statusUserSelected,
  onUserInactivated,
  roleUserSelected,
  isReactivatable,
  optionBtnRef,
  onClose,
}) => {
  const idRole = +localStorage.getItem("idRole");
  const navigate = useNavigate();
  const [isOptionVisible, setIsOptionVisible] = useState(true);

  const [isModalInactiveOpen, setIsModalInactiveOpen] = useState(false);
  const openInactiveModal = () => setIsModalInactiveOpen(true);
  const closeInactiveModal = () => setIsModalInactiveOpen(false);

  const [isModalReactiveOpen, setIsModalReactiveOpen] = useState(false);
  const openReactiveModal = () => setIsModalReactiveOpen(true);
  const closeReactiveModal = () => setIsModalReactiveOpen(false);

  const [isModalTransmitOpen, setIsModalTransmitOpen] = useState(false);
  const openTransmitModal = () => setIsModalTransmitOpen(true);
  const closeTransmitModal = () => setIsModalTransmitOpen(false);

  const handleInactiveClick = () => {
    setIsOptionVisible(false);
    openInactiveModal();
  };
  const handleReactiveClick = () => {
    setIsOptionVisible(false);
    openReactiveModal();
  };
  const handleTransmitMainAdmin = () => {
    setIsOptionVisible(false);
    openTransmitModal();
  };
  const optionRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target) &&
        optionBtnRef &&
        !optionBtnRef().contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <>
      {isModalInactiveOpen && (
        <DiagInactiveForm
          isOpen={isModalInactiveOpen}
          onClose={closeInactiveModal}
          idUserSelected={idUserSelected}
          onUserInactivated={onUserInactivated}
          roleUserSelected={roleUserSelected}
        />
      )}
      {isModalReactiveOpen && (
        <DiagReactiveForm
          isOpen={isModalReactiveOpen}
          onClose={closeReactiveModal}
          idUserSelected={idUserSelected}
          onUserInactivated={onUserInactivated}
          roleUserSelected={roleUserSelected}
        />
      )}
      {isModalTransmitOpen && (
        <DiagTransmitForm
          isOpen={isModalTransmitOpen}
          onClose={closeTransmitModal}
          idUserSelected={idUserSelected}
        />
      )}
      {!isModalInactiveOpen &&
        !isModalReactiveOpen &&
        !isModalTransmitOpen &&
        isOptionVisible && (
          <div ref={optionRef} className="container-options userOption">
            {statusUserSelected === UserStatus.active && (
              <button className="op-buts" onClick={handleInactiveClick}>
                <span>Inactive user</span>
              </button>
            )}
            {isReactivatable && statusUserSelected === UserStatus.inactive && (
              <button className="op-buts" onClick={handleReactiveClick}>
                <span>Reactive user</span>
              </button>
            )}
            {idRole === Role.centerAdmin &&
              roleUserSelected === Role.centerAdmin &&
              statusUserSelected === UserStatus.active && (
                <button className="op-buts" onClick={handleTransmitMainAdmin}>
                  <span>Set as Main Admin</span>
                </button>
              )}
            <button
              className="op-buts"
              onClick={() => {
                if (roleUserSelected === Role.teacher)
                  navigate("/teacherDetail", {
                    state: {
                      idTeacher: idUserSelected,
                      idRole: localStorage.getItem("idRole"),
                      idUser: localStorage.getItem("idUser"),
                    },
                  });
                else if (roleUserSelected === Role.student)
                  navigate("/studentDetail", {
                    state: {
                      idStudent: idUserSelected,
                    },
                  });
                else if (roleUserSelected === Role.centerAdmin)
                  navigate("/adminCenterDetail", {
                    state: {
                      idUser: idUserSelected,
                    },
                  });
                setIsOptionVisible(false);
              }}
            >
              <span>View detail</span>
            </button>
          </div>
        )}
    </>
  );
};

export default UserOption;
