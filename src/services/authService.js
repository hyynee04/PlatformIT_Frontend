import axios from "../utils/axiosCustomize";

const postRegister = (
  fullName,
  email,
  username,
  password,
  centername,
  description,
  tin
) => {
  return axios.post("api/Authen/signup", {
    fullName: fullName,
    email: email,
    username: username,
    password: password,
    centerName: centername,
    description: description,
    tin: tin,
  });
};

const postLogin = (username, password) => {
  return axios.post("api/Authen/SignInByPassword", {
    username,
    password,
  });
};

const postCheckEmail = (email) => {
  return axios.post("api/Authen/CheckEmail", email, {
    headers: { "Content-Type": "application/json" }, // Đảm bảo gửi kiểu chuỗi văn bản
  });
};

const postSendOTP = (email) => {
  return axios.post("api/Authen/SendOTP", email, {
    headers: { "Content-Type": "application/json" }, // Đảm bảo gửi kiểu chuỗi văn bản
  });
};

const postVerifyOtp = (email, otp) => {
  return axios.post("api/Authen/VerifyOtp", {
    email,
    otp,
  });
};

const postLogout = () => {
  return axios.post("api/Authen/logout");
};

export {
  postCheckEmail,
  postLogin,
  postRegister,
  postSendOTP,
  postVerifyOtp,
  postLogout,
};
