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
const postApproveCenter = (id, idUserUpdated) => {
  return axios.post("api/Center/ApproveCenter", null, {
    params: {
      id: id,
      idUserUpdated: idUserUpdated,
    },
  });
};
const postAddTeacher = async (email, username, password, idCenter) => {
  try {
    const response = await axios.post(
      "https://localhost:7167/api/Authentication/AddTeacher",
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
  postApproveCenter,
  postAddTeacher,
};
