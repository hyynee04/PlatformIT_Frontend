import axios from "../utils/axiosCustomize";

const getAllCenter = () => {
  return axios.get("api/Center/GetAllCenter");
};
const getPendingCenter = () => {
  return axios.get("api/Center/GetPendingCenter");
};
const getInactiveLockedCenter = () => {
  return axios.get("api/Center/GetInactiveLockedCenter");
};
const getAllTeacherByIdCenter = (idCenter) => {
  return axios.get("api/Center/GetAllTeacherByIdCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};
const getAllActiveTeacherCardsOfCenter = async (idCenter) => {
  return await axios.get("api/User/GetAllActiveTeacherCardsOfCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};
const getAllStudentByIdCenter = (idCenter) => {
  return axios.get("/api/Center/GetAllStudentByIdCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};
const getAllAdminOfCenter = (idCenter) => {
  return axios.get("api/Center/GetAllAdminOfCenter", {
    params: {
      idCenter: idCenter,
    },
  });
};
const postApproveCenter = (id, idUserUpdated) => {
  return axios.post("api/Center/ApproveCenter", null, {
    params: {
      id: id,
      idUserUpdated: idUserUpdated,
    },
  });
};
const postRejectCenter = async (
  idCenterSelected,
  reasonReject,
  idUserUpdated
) => {
  const rejectModel = {
    id: idCenterSelected,
    reason: reasonReject,
  };
  try {
    return await axios.post("api/Center/RejectCenter", rejectModel, {
      params: {
        idUserUpdated: idUserUpdated,
      },
    });
  } catch (error) {
    console.error("Error updating basic info: ", error);
  }
};
const postAddCenterAmin = async (
  fullName,
  username,
  email,
  password,
  idCenter,
  idUserUpdatedBy
) => {
  try {
    return await axios.post(
      "api/Center/AddCenterAdmin",
      {
        username: username,
        fullName: fullName,
        email: email,
        password: password,
        idCenter: idCenter,
        idUserUpdatedBy: idUserUpdatedBy,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding admin center:", error);
  }
};
const postAddTeacher = async (
  fullName,
  email,
  username,
  password,
  idCenter
) => {
  try {
    return await axios.post(
      "api/Authen/AddTeacher",
      {
        fullName: fullName,
        email: email,
        username: username,
        password: password,
        idCenter: idCenter,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding teacher:", error);
  }
};

const getAllCenterCards = () => {
  return axios.get("api/Center/GetAllCenterCards");
};
const getCenterInfo = async () => {
  const idCenter = +localStorage.getItem("idCenter");

  return await axios.get("api/Center/GetCenterInfo", {
    params: {
      idCenter: idCenter,
    },
  });
};
const postUpdateCenterBasicInfo = async (
  centerName,
  centerEmail,
  address,
  phoneNumber,
  description,
  establishedDate
) => {
  const idCenter = +localStorage.getItem("idCenter");
  const idUpdatedBy = +localStorage.getItem("idUser");
  const model = {
    idCenter: idCenter,
    centerName: centerName,
    centerEmail: centerEmail,
    address: address,
    phoneNumber: phoneNumber,
    description: description,
    establishedDate: establishedDate,
  };
  try {
    return await axios.post("api/Center/UpdateCenterInfo", model, {
      params: {
        idUpdatedBy: idUpdatedBy,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postAddCenterLink = async (name, url) => {
  const idCenter = +localStorage.getItem("idCenter");
  const model = {
    idCenter: idCenter,
    name: name,
    url: url,
  };
  try {
    return await axios.post("api/User/AddProfileLink", model);
  } catch (error) {
    throw error;
  }
};
const postAddCenterQualification = async (
  qualificationName,
  description,
  qualificationFile
) => {
  const idCenter = +localStorage.getItem("idCenter");
  try {
    const formData = new FormData();
    formData.append("IdCenter", idCenter);
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
const getWorkingHours = async () => {
  const centerId = +localStorage.getItem("idCenter");
  try {
    return axios.get("api/Center/getWorkingHours", {
      params: {
        centerId: centerId,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postAddOrUpdateWorkingHours = async (hoursModel) => {
  const centerId = +localStorage.getItem("idCenter");
  const idUpdated = +localStorage.getItem("idUser");
  try {
    return axios.post("api/Center/AddOrUpdateWorkingHours", hoursModel, {
      params: {
        centerId: centerId,
        idUpdated: idUpdated,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postTransferMainAdmin = async (idNewAdmin) => {
  const idUpdated = +localStorage.getItem("idUser");
  try {
    return await axios.post("api/Center/TransferMainAdmin", null, {
      params: {
        IdNewAdmin: idNewAdmin,
        idUpdated: idUpdated,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postLockCenter = async (idCenter) => {
  // const idCenter = +localStorage.getItem("idCenter");
  const idUserUpdated = +localStorage.getItem("idUser");
  try {
    return await axios.post("api/Center/LockCenter", null, {
      params: {
        idCenter: idCenter,
        idUserUpdated: idUserUpdated,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postUnlockCenter = async (idCenter) => {
  const idUserUpdated = +localStorage.getItem("idUser");
  try {
    return await axios.post("api/Center/ReactiveCenter", null, {
      params: {
        idCenter: idCenter,
        idUserUpdated: idUserUpdated,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getCenterDetail = (idCenter) => {
  return axios.get("api/Center/GetCenterDetail", {
    params: {
      idCenter: idCenter,
    },
  });
};

export {
  getAllCenter,
  getPendingCenter,
  getInactiveLockedCenter,
  getAllTeacherByIdCenter,
  getAllActiveTeacherCardsOfCenter,
  getAllStudentByIdCenter,
  getAllAdminOfCenter,
  postApproveCenter,
  postRejectCenter,
  postAddCenterAmin,
  postAddTeacher,
  getAllCenterCards,
  getCenterInfo,
  postUpdateCenterBasicInfo,
  postAddCenterLink,
  postAddCenterQualification,
  postAddOrUpdateWorkingHours,
  getWorkingHours,
  postTransferMainAdmin,
  postLockCenter,
  postUnlockCenter,
  getCenterDetail,
};
