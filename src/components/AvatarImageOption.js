import React, { useRef, useState } from "react";
import { postChangeAvatar } from "../services/userService";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../store/profileUserSlice";
import { fetchCenterProfile } from "../store/profileCenterSlice";
import DiagRemoveImgForm from "./DiagRemoveImgForm";

const AvatarImageOption = ({ isAvatar }) => {
  const dispatch = useDispatch();
  // const userPI = useSelector((state) => state.profileUser);
  const userId = +localStorage.getItem("idUser");
  const [isOptionVisible, setIsOptionVisible] = useState(true);
  const [isModalRemoveAvaOpen, setIsModalRemoveAvaOpen] = useState(false);

  const openRemoveAvaModal = () => {
    setIsModalRemoveAvaOpen(true);
    setIsOptionVisible(false);
  };
  const closeRemoveAvaModal = () => setIsModalRemoveAvaOpen(false);

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
      }
    }
  };
  if (!isOptionVisible) {
    <>
      {isModalRemoveAvaOpen && (
        <div>
          <DiagRemoveImgForm
            isOpen={isModalRemoveAvaOpen}
            onClose={closeRemoveAvaModal}
            isAvatar={isAvatar}
          />
        </div>
      )}
    </>;
  }
  return (
    <div>
      <div className="container-options avatarOption">
        <button className="op-buts" onClick={handleChangeImg}>
          {isAvatar ? (
            <span>Change avatar</span>
          ) : (
            <span>Change cover image</span>
          )}
        </button>
        <button
          className="op-buts"
          onClick={() => {
            openRemoveAvaModal();
          }}
        >
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
        style={{ display: "none" }} // Ẩn input file
        accept=".png, .jpg, .jpeg" // Chỉ cho phép chọn file ảnh
        onChange={handleFileChange}
      />
      <DiagRemoveImgForm
        isOpen={isModalRemoveAvaOpen}
        onClose={closeRemoveAvaModal}
        isAvatar={isAvatar}
      />
    </div>
  );
};

export default AvatarImageOption;
