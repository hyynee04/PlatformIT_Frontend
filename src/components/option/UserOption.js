import React, { useState } from "react";

import "../../assets/scss/card/OptionCard.css";
import DiagInactiveForm from "../diag/DiagInactiveForm";
import { Role, UserStatus } from "../../constants/constants";
import DiagTransmitForm from "../diag/DiagTransmitForm";
import DiagReactiveForm from "../diag/DiagReactiveForm";

const UserOption = ({
  idUserSelected,
  statusUserSelected,
  onUserInactivated,
  roleUserSelected,
  isReactivatable,
}) => {
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
          <div className="container-options userOption">
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
            {roleUserSelected === Role.centerAdmin &&
              statusUserSelected > UserStatus.inactive && (
                <button className="op-buts" onClick={handleTransmitMainAdmin}>
                  <span>Set as Main Admin</span>
                </button>
              )}
            <button
              className="op-buts"
              onClick={() => setIsOptionVisible(false)}
            >
              <span>View detail</span>
            </button>
          </div>
        )}
    </>
  );
};

export default UserOption;
