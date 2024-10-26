import React, { useState } from "react";

import "../assets/scss/card/OptionCard.css";
import DiagInactiveForm from "./DiagInactiveForm";

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

  const handleInactiveClick = () => {
    setIsOptionVisible(false);
    openInactiveModal();
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
        <button className="op-buts" onClick={() => setIsOptionVisible(false)}>
          <span>View detail</span>
        </button>
      </div>
      <div>
        <DiagInactiveForm
          isOpen={isModalInactiveOpen}
          onClose={closeInactiveModal}
          idUserSelected={idUserSelected}
          onUserInactivated={onUserInactivated}
          roleUserSelected={roleUserSelected}
        />
      </div>
    </div>
  );
};

export default UserOption;
