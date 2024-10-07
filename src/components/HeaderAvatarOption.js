import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Role } from "../constants/constants";
import DialogForm from "./DialogForm";

const HeaderAvatarOption = ({}) => {
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
            <DialogForm
              isOpen={isModalSignoutOpen}
              onClose={closeSignoutModal}
            />
          </div>
        )}
      </>
    );

  return (
    <div id="headerAvatarOption">
      <div className="container-options">
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
        <button className="op-buts" onClick={() => setIsOptionVisible(false)}>
          <span>Payment History</span>
        </button>
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
        <DialogForm isOpen={isModalSignoutOpen} onClose={closeSignoutModal} />
      </div>
    </div>
  );
};

export default HeaderAvatarOption;
