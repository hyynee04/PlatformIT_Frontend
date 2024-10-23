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
  // console.log(id, reason);

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
};
