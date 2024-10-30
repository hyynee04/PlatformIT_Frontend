import React, { useState } from "react";

import "../assets/scss/card/OptionCard.css";
import DiagInactiveForm from "./DiagInactiveForm";
import { Role } from "../constants/constants";
import DiagTransmitForm from "./DiagTransmitForm";

const UserOption = ({
  idUserSelected,
  statusUserSelected,
  onUserInactivated,
  roleUserSelected,
}) => {
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
        <button className="op-buts" onClick={() => setIsOptionVisible(false)}>
          <span>View detail</span>
        </button>
      </div>
    </div>
  );
};

export default UserOption;
