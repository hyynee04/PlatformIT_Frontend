import axios from "../utils/axiosCustomize";

const getAllUserConversations = async () => {
  return await axios.get("api/Message/GetAllUserConversations", {
    params: {
      IdCurrentUser: Number(localStorage.getItem("idUser")),
    },
  });
};
const getConversation = async (idSender) => {
  return await axios.get("api/Message/GetConversation", {
    params: {
      idSender: idSender,
      idReceiver: Number(localStorage.getItem("idUser")),
    },
  });
};
const postUpdateReadStatus = async (idUser, idCurrentUser) => {
  return await axios.post("api/Message/UpdateReadStatus", null, {
    params: {
      idUser: idUser,
      idCurrentUser: idCurrentUser,
    },
  });
};
const postSendMessage = async (requestData) => {
  return await axios.post("api/Message/SendMessage", requestData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export {
  getAllUserConversations,
  getConversation,
  postUpdateReadStatus,
  postSendMessage,
};
