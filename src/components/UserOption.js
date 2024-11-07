import React, { useState } from "react";

import "../assets/scss/card/OptionCard.css";
import DiagInactiveForm from "./DiagInactiveForm";
import { Role } from "../constants/constants";
import DiagTransmitForm from "./DiagTransmitForm";
import { useNavigate } from "react-router-dom";

const UserOption = ({
  idUserSelected,
  statusUserSelected,
  onUserInactivated,
  roleUserSelected,
}) => {
  const navigate = useNavigate();
  const [isOptionVisible, setIsOptionVisible] = useState(true);

  const [isModalInactiveOpen, setIsModalInactiveOpen] = useState(false);
  const openInactiveModal = () => setIsModalInactiveOpen(true);
  const closeInactiveModal = () => setIsModalInactiveOpen(false);

  const [isModalTransmitOpen, setIsModalTransmitOpen] = useState(false);
  const openTransmitModal = () => setIsModalTransmitOpen(true);
  const closeTransmitModal = () => setIsModalTransmitOpen(false);

  const handleInactiveClick = () => {
    setIsOptionVisible(false);
    openInactiveModal();
  };
  const handleTransmitMainAdmin = () => {
    setIsOptionVisible(false);
    openTransmitModal();
  };
  console.log(idUserSelected, roleUserSelected)

  if (!isOptionVisible)
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
        {isModalTransmitOpen && (
          <DiagTransmitForm
            isOpen={isModalTransmitOpen}
            onClose={closeTransmitModal}
            idUserSelected={idUserSelected}
          />
        )}
      </>
    );
  return (
    <div>
      <div className="container-options userOption">
        {statusUserSelected > 0 && (
          <button className="op-buts" onClick={handleInactiveClick}>
            <span>Inactive user</span>
          </button>
        )}
        {roleUserSelected === Role.centerAdmin && statusUserSelected > 0 && (
          <button className="op-buts" onClick={handleTransmitMainAdmin}>
            <span>Set as Main Admin</span>
          </button>
        )}
        <button 
          className="op-buts" 
          onClick={() => {
            if(roleUserSelected === Role.teacher) {
              navigate('/teacherDetail', {
                state: { 
                    idTeacher: idUserSelected, 
                    idRole: localStorage.getItem("idRole"),
                    idUser: localStorage.getItem("idUser")
                },
            });
            }
            setIsOptionVisible(false)
          }}>
          <span>View detail</span>
        </button>
      </div>
    </div>
  );
};

export default UserOption;
