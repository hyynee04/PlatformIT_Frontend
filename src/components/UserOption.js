import React, { useState } from "react";

import "../assets/scss/card/OptionCard.css";
import DiagInactiveForm from "./DiagInactiveForm";

const UserOption = ({ idUserSelected }) => {
  const [isOptionVisible, setIsOptionVisible] = useState(true);
  const [isModalInactiveOpen, setIsModalInactiveOpen] = useState(false);
  const openInactiveModal = () => setIsModalInactiveOpen(true);
  const closeInactiveModal = () => setIsModalInactiveOpen(false);

  if (!isOptionVisible)
    return (
      <>
        {isModalInactiveOpen && (
          <DiagInactiveForm
            isOpen={isModalInactiveOpen}
            onClose={closeInactiveModal}
            idUserSelected={idUserSelected}
          />
        )}
      </>
    );
  return (
    <div>
      <div className="container-options userOption">
        <button
          className="op-buts"
          onClick={() => {
            openInactiveModal();
            setIsOptionVisible(false);
          }}
        >
          <span>Inactive account</span>
        </button>
        <button className="op-buts" onClick={() => setIsOptionVisible(false)}>
          <span>View profile</span>
        </button>
      </div>
      <div>
        <DiagInactiveForm
          isOpen={isModalInactiveOpen}
          onClose={closeInactiveModal}
          idUserSelected={idUserSelected}
        />
      </div>
    </div>
  );
};

export default UserOption;
