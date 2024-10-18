import React, { useRef, useState } from "react";
import { postChangeAvatar } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAvatar,
  fetchUserProfile,
  updateUserPI,
} from "../store/profileUserSlice";

const AvatarImageOption = () => {
  const dispatch = useDispatch();
  const userPI = useSelector((state) => state.profileUser);
  const userId = +localStorage.getItem("idUser");
  const [isOptionVisible, setIsOptionVisible] = useState(true);

  const inputFileRef = useRef(null);
  const handleChangeAvatar = () => {
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

        await postChangeAvatar(userId, blobFile, userId);

        await dispatch(fetchUserProfile(userId));
        setIsOptionVisible(false);
      } catch (error) {
        console.error("Error changing avatar:", error);
      }
    }
  };
  if (!isOptionVisible) {
    return null;
  }
  return (
    <div>
      <div className="container-options avatarOption">
        <button className="op-buts" onClick={handleChangeAvatar}>
          <span>Change avatar</span>
        </button>
        <button
          className="op-buts"
          onClick={() => {
            setIsOptionVisible(false);
          }}
        >
          <span>Remove avatar</span>
        </button>
      </div>
      <input
        type="file"
        ref={inputFileRef}
        style={{ display: "none" }} // Ẩn input file
        accept=".png, .jpg, .jpeg" // Chỉ cho phép chọn file ảnh
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarImageOption;
