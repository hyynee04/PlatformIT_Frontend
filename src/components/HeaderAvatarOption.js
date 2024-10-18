import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "../constants/constants";
import DiagSignOutForm from "./DiagSignOutForm";
import "../assets/scss/card/OptionCard.css";

const HeaderAvatarOption = () => {
  const [isOptionVisible, setIsOptionVisible] = useState(true);
  const [isModalSignoutOpen, setIsModalSignoutOpen] = useState(false);

  const openSignoutModal = () => setIsModalSignoutOpen(true);
  const closeSignoutModal = () => setIsModalSignoutOpen(false);

  const navigate = useNavigate();
  const idRole = +localStorage.getItem("idRole");
  if (!isOptionVisible)
    return (
      <>
        {isModalSignoutOpen && (
          <div>
            <DiagSignOutForm
              isOpen={isModalSignoutOpen}
              onClose={closeSignoutModal}
            />
          </div>
        )}
      </>
    );

  return (
    <div>
      <div className="container-options headerOption">
        <button
          className="op-buts"
          onClick={() => {
            idRole === Role.teacher
              ? navigate("./teacherPI")
              : navigate("./pi");
            setIsOptionVisible(false);
          }}
        >
          <span>View Profile</span>
        </button>
        {idRole === Role.student && (
          <button className="op-buts" onClick={() => setIsOptionVisible(false)}>
            <span>Payment History</span>
          </button>
        )}

        <button
          className="op-buts"
          onClick={() => {
            openSignoutModal();
            setIsOptionVisible(false);
          }}
        >
          <span>Sign Out</span>
        </button>
      </div>
      <div>
        <DiagSignOutForm
          isOpen={isModalSignoutOpen}
          onClose={closeSignoutModal}
        />
      </div>
    </div>
  );
};

export default HeaderAvatarOption;
