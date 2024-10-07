import axios from "../utils/axiosCustomize";

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
export { getPI, getAllUser };
