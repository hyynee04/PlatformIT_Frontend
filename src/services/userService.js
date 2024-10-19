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
    const response = await axios.post("api/User/UpdateUserBasicPI", model, {
      params: {
        idUpdatedBy: idUser,
      },
    });
    console.log(response);
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
    const response = await axios.post(
      "api/User/UpdateTeacherSpecializedPI",
      model,
      {
        params: {
          idUpdatedBy: idUser,
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.error("Error updating teacher info: ", error);
  }
};
const postAddProfileLink = async (idUser, name, url) => {
  const model = {
    idProfileLink: 0,
    name: name,
    url: url,
  };
  try {
    const response = await axios.post("api/User/AddProfileLink", model, {
      params: {
        idUser: idUser,
      },
    });
    console.log(response);
  } catch (error) {
    console.error("Error add profile link: ", error);
  }
};
const deleteProfileLink = async (idProfileLink) => {
  try {
    const response = await axios.delete("api/User/DeleteProfileLink", {
      params: {
        id: idProfileLink,
      },
    });
    console.log(response);
  } catch (error) {
    console.error("Error delete profile link: ", error);
  }
};
const deleteQualification = async (idQualification) => {
  try {
    const response = await axios.delete("api/User/DeleteQualification", {
      params: {
        id: idQualification,
      },
    });
    console.log(response);
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
    formData.append("QualificationName", qualificationName);
    formData.append("Description", description);
    formData.append("QualificationFile", qualificationFile);
    await axios.post(`api/User/AddQualification?IdUser=${idUser}`, formData, {
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
const postChangeAvatar = async (userId, avatarFile, idUpdatedBy) => {
  try {
    const formData = new FormData();
    formData.append("IdUser", userId);
    formData.append("AvatarFile", avatarFile);
    await axios.post(
      `api/User/ChangeAvatar?idUpdatedBy=${idUpdatedBy}`,
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
const getAllUser = () => {
  return axios.post("api/User/getAllUser");
};

const postInactiveUser = (idUserInactive, idUserUpdatedBy) => {
  return axios.post("api/User/InactiveUser", null, {
    params: {
      idUserInactive: idUserInactive,
      idUserUpdatedBy: idUserUpdatedBy,
    },
  });
};

export {
  getPI,
  postUpdateUserBasicPI,
  postUpdateTeacherSpecializedPI,
  postAddProfileLink,
  deleteProfileLink,
  postAddQualification,
  deleteQualification,
  postChangeAvatar,
  getAllUser,
  postInactiveUser,
  postForgotPassword,
};
