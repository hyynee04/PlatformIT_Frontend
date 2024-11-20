import axios from "../utils/axiosCustomize";

const postForgotPassword = (email) => {
  return axios.post("api/User/ForgotPassword", null, {
    params: {
      email,
    },
  });
};

const getPI = (idUser) => {
  return axios.get("api/User/showPI", {
    params: {
      id: idUser,
    },
  });
};
const getAvaImg = async (idUser) => {
  return await axios.get("api/User/GetAvaImg", {
    params: {
      id: idUser,
    },
    responseType: "text",
  });
};

const postChangePassword = async (
  currentPW,
  newPW,
  idAccountUpdated,
  idUserUpdatedBy
) => {
  try {
    return await axios.post(
      "api/User/ChangePassword",
      {
        currentPW: currentPW,
        newPW: newPW,
        idAccountUpdated: idAccountUpdated,
        idUserUpdatedBy: idUserUpdatedBy,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error object:", error);
  }
};

const postUpdateUserBasicPI = async (
  idUser,
  fullName,
  phoneNumber,
  gender,
  dob,
  nationality
) => {
  const model = {
    idUser: idUser,
    fullName: fullName,
    phoneNumber: phoneNumber,
    gender: gender,
    dob: dob,
    nationality: nationality,
  };
  try {
    return await axios.post("api/User/UpdateUserBasicPI", model, {
      params: {
        idUpdatedBy: idUser,
      },
    });
  } catch (error) {
    console.error("Error updating basic info: ", error);
  }
};
const postUpdateTeacherSpecializedPI = async (
  idUser,
  teachingMajor,
  description
) => {
  const model = {
    idUser: idUser,
    teachingMajor: teachingMajor,
    description: description,
  };
  try {
    return await axios.post("api/User/UpdateTeacherSpecializedPI", model, {
      params: {
        idUpdatedBy: idUser,
      },
    });
  } catch (error) {
    console.error("Error updating teacher info: ", error);
  }
};
const postAddProfileLink = async (name, url) => {
  const idUser = +localStorage.getItem("idUser");
  const model = {
    idUser: idUser,
    name: name,
    url: url,
  };
  try {
    return await axios.post("api/User/AddProfileLink", model);
  } catch (error) {
    throw error;
  }
};
const deleteProfileLink = async (idProfileLink) => {
  try {
    return await axios.delete("api/User/DeleteProfileLink", {
      params: {
        id: idProfileLink,
      },
    });
  } catch (error) {
    console.error("Error delete profile link: ", error);
  }
};
const deleteQualification = async (idQualification) => {
  try {
    return await axios.delete("api/User/DeleteQualification", {
      params: {
        id: idQualification,
      },
    });
  } catch (error) {
    console.error("Error delete qualification: ", error);
  }
};
const postAddQualification = async (
  idUser,
  qualificationName,
  description,
  qualificationFile
) => {
  try {
    const formData = new FormData();
    formData.append("IdUser", idUser);
    formData.append("QualificationName", qualificationName);
    formData.append("Description", description);
    formData.append("QualificationFile", qualificationFile);
    return await axios.post(`api/User/AddQualification`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error(
      "Error add qualification:",
      error.response?.data || error.message
    );
  }
};
const postChangeAvatar = async (isChangeAva, avatarFile) => {
  const idUser = +localStorage.getItem("idUser");

  try {
    const formData = new FormData();
    if (isChangeAva) {
      formData.append("IdUser", idUser);
    } else {
      const idCenter = +localStorage.getItem("idCenter");
      formData.append("IdCenter", idCenter);
    }
    formData.append("AvatarFile", avatarFile);
    return await axios.post(
      `api/User/ChangeAvatar?idUpdatedBy=${idUser}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error changing avatar:",
      error.response?.data || error.message
    );
  }
};
const postRemoveAvatar = async (isAvatar) => {
  const idUser = +localStorage.getItem("idUser");
  const idCenter = +localStorage.getItem("idCenter");

  const model = isAvatar ? { idUser } : { idCenter };

  try {
    return await axios.post("api/User/RemoveAvatar", model, {
      params: {
        idUpdatedBy: idUser,
      },
    });
  } catch (error) {
    throw error;
  }
};
const getAllUser = () => {
  return axios.post("api/User/getAllUser");
};
const postInactiveUser = (idUserInactive) => {
  const idUserUpdatedBy = +localStorage.getItem("idUser");
  return axios.post("api/User/InactiveUser", null, {
    params: {
      idUserInactive: idUserInactive,
      idUserUpdatedBy: idUserUpdatedBy,
    },
  });
};
const postReactiveUser = (idUserReactive) => {
  const idUserUpdatedBy = +localStorage.getItem("idUser");
  return axios.post("api/User/ReactiveUser", null, {
    params: {
      idUser: idUserReactive,
      idUserUpdatedBy: idUserUpdatedBy,
    },
  });
};
const getPendingQualifications = () => {
  const idCenter = +localStorage.getItem("idCenter");
  return axios.get("api/User/GetPendingQualifications", {
    params: {
      centerId: idCenter,
    },
  });
};
const postApproveQualification = async (idUser, idQualification) => {
  const idUpdatedBy = +localStorage.getItem("idUser");
  const approveQuaModel = {
    idUser: idUser,
    idQualification: idQualification,
  };
  try {
    return await axios.post("api/User/ApproveQualification", approveQuaModel, {
      params: {
        idUpdatedBy: idUpdatedBy,
      },
    });
  } catch (error) {
    console.log("Error approve qualification: ", error);
  }
};
const postRejectQualification = async (idUser, idQualification, reason) => {
  const idUpdatedBy = +localStorage.getItem("idUser");
  const rejectQuaModel = {
    idUser: idUser,
    idQualification: idQualification,
    reason: reason,
  };
  try {
    return await axios.post("api/User/RejectQualification", rejectQuaModel, {
      params: {
        idUpdatedBy: idUpdatedBy,
      },
    });
  } catch (error) {
    console.log("Error reject qualification: ", error);
  }
};

const getAllTeacherCards = () => {
  return axios.get("api/User/GetAllTeacherCards");
};

const getTeacherDetail = (idUser) => {
  return axios.get("api/User/GetDetailTeacher", {
    params: {
      idTeacher: idUser,
    },
  });
};

export {
  getPI,
  getAvaImg,
  postChangePassword,
  postUpdateUserBasicPI,
  postUpdateTeacherSpecializedPI,
  postAddProfileLink,
  deleteProfileLink,
  postAddQualification,
  deleteQualification,
  postChangeAvatar,
  postRemoveAvatar,
  getAllUser,
  postInactiveUser,
  postReactiveUser,
  postForgotPassword,
  getPendingQualifications,
  postApproveQualification,
  postRejectQualification,
  getAllTeacherCards,
  getTeacherDetail,
};
