import axios from "../utils/axiosCustomize";

const postRegister = (fullName, email, username, password, centername, tin) => {
  return axios.post("api/Authentication/signup", {
    fullName: fullName,
    email: email,
    username: username,
    password: password,
    centername: centername,
    tin: tin,
  });
};

const postLogin = (username, password) => {
  return axios.post("api/Authentication/SignInByPassword", {
    username,
    password,
  });
};



export { postRegister, postLogin };
