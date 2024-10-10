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
const postInactiveUser = (idUserInactive, idUserUpdatedBy) => {
  console.log(idUserInactive);
  console.log(idUserUpdatedBy);

  return axios.post("api/User/InactiveUser", null, {
    params: {
      idUserInactive: idUserInactive,
      idUserUpdatedBy: idUserUpdatedBy,
    },
  });
};

export { getPI, getAllUser, postInactiveUser };
