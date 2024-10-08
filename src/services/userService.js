import axios from "../utils/axiosCustomize";

const postForgotPassword = (email) => {
  return axios.post('api/User/ForgotPassword', null, {
    params: {
      email
    }
  })
}

const getPI = (idUser) => {
  return axios.get("api/User/showPI", {
    params: {
      id: idUser,
    },
  });
};

const getAllUser = () => {
  return axios.post("api/User/getAllUser");
};


export {
  getAllUser, getPI, postForgotPassword
};

