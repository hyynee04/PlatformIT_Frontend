import axios from "../utils/axiosCustomize";

const getAllCenter = () => {
  return axios.get("api/Center/GetAllCenter");
};
const getPendingCenter = () => {
  return axios.get("api/Center/GetPendingCenter");
};
const getAllTeacherByIdCenter = (idCenter) => {
  return axios.get("api/Center/GetAllTeacherByIdCenter", {
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
    const response = await axios.post("api/Center/RejectCenter", rejectModel, {
      params: {
        idUserUpdated: idUserUpdated,
      },
    });
    console.log(response);
  } catch (error) {
    console.error("Error updating basic info: ", error);
  }
};
const postAddCenterAmin = async (
  username,
  email,
  password,
  idCenter,
  idUserUpdatedBy
) => {
  try {
    const response = await axios.post(
      "api/Center/AddCenterAdmin",
      {
        username: username,
        email: email,
        password: password,
        idCenter: idCenter,
        idUserUpdatedBy: idUserUpdatedBy,
      },
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo server nhận dữ liệu dưới dạng JSON
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding admin center:", error);
  }
};
const postAddTeacher = async (email, username, password, idCenter) => {
  try {
    const response = await axios.post(
      "api/Authen/AddTeacher",
      {
        email: email,
        username: username,
        password: password,
        idCenter: idCenter,
      },
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo server nhận dữ liệu dưới dạng JSON
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding teacher:", error);
  }
};
const getCenterInfo = async () => {
  const idCenter = +localStorage.getItem("idCenter");

  const data = await axios.get("api/Center/GetCenterInfo", {
    params: {
      idCenter: idCenter,
    },
  });
  return data;
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
    await axios.post("api/Center/UpdateCenterInfo", model, {
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
    await axios.post("api/User/AddProfileLink", model);
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
    await axios.post(`api/User/AddQualification`, formData, {
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
    return axios.post("api/Center/TransferMainAdmin", null, {
      params: {
        IdNewAdmin: idNewAdmin,
        idUpdated: idUpdated,
      },
    });
  } catch (error) {
    throw error;
  }
};
const postLockCenter = async () => {
  const idCenter = +localStorage.getItem("idCenter");
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
export {
  getAllCenter,
  getPendingCenter,
  getAllTeacherByIdCenter,
  getAllStudentByIdCenter,
  getAllAdminOfCenter,
  postApproveCenter,
  postRejectCenter,
  postAddCenterAmin,
  postAddTeacher,
  getCenterInfo,
  postUpdateCenterBasicInfo,
  postAddCenterLink,
  postAddCenterQualification,
  postAddOrUpdateWorkingHours,
  getWorkingHours,
  postTransferMainAdmin,
  postLockCenter,
};
