import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/card/OptionCard.css";
import { Role } from "../constants/constants";
import DiagSignOutForm from "./diag/DiagSignOutForm";

const HeaderAvatarOption = ({ isOpen, onClose, optionButtonRef }) => {
  // const [isOptionVisible, setIsOptionVisible] = useState(true);
  const [isModalSignoutOpen, setIsModalSignoutOpen] = useState(false);

  const openSignoutModal = () => setIsModalSignoutOpen(true);
  const closeSignoutModal = () => setIsModalSignoutOpen(false);

  const optionBoxRef = useRef(null);

  const navigate = useNavigate();
  const idRole = +localStorage.getItem("idRole");
  useEffect(() => {
    const handleClickOutsideOptionBox = (event) => {
      if (
        optionBoxRef.current &&
        !optionBoxRef.current.contains(event.target) &&
        (!optionButtonRef.current ||
          !optionButtonRef.current.contains(event.target))
      ) {
        onClose();
      }
    };

    // Attach the event listener if the options are visible
    document.addEventListener("mousedown", handleClickOutsideOptionBox);
    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptionBox);
    };
  }, []);

  if (isModalSignoutOpen)
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
  if (!isOpen) return null;

  return (
    <div>
      <div ref={optionBoxRef} className="container-options headerOption">
        <button
          className="op-buts"
          onClick={() => {
            navigate("./pi");
            onClose();
          }}
        >
          <span>View Profile</span>
        </button>
        {(idRole === Role.student || idRole === Role.centerAdmin) && (
          <button
            className="op-buts"
            onClick={() => {
              navigate("/transaction");
              onClose();
            }}
          >
            <span>Transaction history</span>
          </button>
        )}

        <button
          className="op-buts"
          onClick={() => {
            setIsModalSignoutOpen(true);
            onClose();
          }}
        >
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderAvatarOption;
