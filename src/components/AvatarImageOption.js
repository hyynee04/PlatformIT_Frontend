import React, { useEffect, useRef, useState } from "react";
import { postChangeAvatar } from "../services/userService";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/profileUserSlice";
import { fetchCenterProfile } from "../store/profileCenterSlice";
import { ImSpinner2 } from "react-icons/im";

const AvatarImageOption = ({
  isAvatar,
  openRemoveAvaModal,
  isOpen,
  onClose,
  optionButtonRef,
}) => {
  const dispatch = useDispatch();
  const userId = +localStorage.getItem("idUser");
  const [isOptionVisible, setIsOptionVisible] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const optionBoxRef = useRef(null);
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
    document.addEventListener("mousedown", handleClickOutsideOptionBox);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptionBox);
    };
  }, [onClose, optionButtonRef]);
  const inputFileRef = useRef(null);
  const handleChangeImg = () => {
    inputFileRef.current.click();
  };
  const formatFile = (file) => {
    return {
      uri: file.uri || "",
      name: file.name || "avatar.png",
      type: file.type || "image/png",
    };
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formattedFile = formatFile(file);
      setLoadingBtn(true);
      try {
        let blobFile;

        if (formattedFile.uri && formattedFile.uri.startsWith("blob:")) {
          let response = await fetch(formattedFile.uri);
          const blob = await response.blob();

          blobFile = new File([blob], formattedFile.name, {
            type: formattedFile.type,
          });
        } else {
          blobFile = file;
        }
        if (isAvatar) {
          await postChangeAvatar(true, blobFile);
          await dispatch(fetchUserProfile(userId));
        } else {
          await postChangeAvatar(false, blobFile, userId);
          await dispatch(fetchCenterProfile());
        }

        setIsOptionVisible(false);
      } catch (error) {
        console.error("Error changing avatar:", error);
      } finally {
        setLoadingBtn(false);
      }
    }
  };

  return (
    <div>
      <div
        ref={optionBoxRef}
        className={`container-options ${
          isAvatar ? "avatarOption" : "centerAvatarOption"
        }`}
      >
        <button className="op-buts" onClick={handleChangeImg}>
          {loadingBtn && (
            <ImSpinner2
              className="icon-spin"
              color="#397979"
              style={{ marginRight: "2px" }}
            />
          )}
          {isAvatar ? (
            <span>Change avatar</span>
          ) : (
            <span>Change cover image</span>
          )}
        </button>
        <button className="op-buts" onClick={() => openRemoveAvaModal()}>
          {isAvatar ? (
            <span>Remove avatar</span>
          ) : (
            <span>Remove cover image</span>
          )}
        </button>
      </div>
      <input
        type="file"
        ref={inputFileRef}
        style={{ display: "none" }}
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarImageOption;
