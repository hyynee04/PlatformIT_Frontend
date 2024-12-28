import axios from "../utils/axiosCustomize";

const getAllNotificationOfUser = (idUser) => {
  return axios.get("api/Notification/GetAllNotificationOfUser", {
    params: {
      idUser: idUser,
    },
  });
};

const postChangeReadStatus = (idNotification, idUpdatedBy) => {
  return axios.post(`api/Notification/ChangeReadStatus`, null, {
    params: {
      idNotification: idNotification,
      idUpdatedBy: idUpdatedBy,
    },
  });
};

const postReadAllNotification = (idUpdatedBy) => {
  return axios.post(`api/Notification/ReadAllNotification`, null, {
    params: {
      idUpdatedBy: idUpdatedBy,
    },
  });
};

const getNotificationBoardOfCourse = (idCourse) => {
  return axios.get("api/Notification/GetNotificationBoardOfCourse", {
    params: {
      idCourse: idCourse,
    },
  });
};

const postAddBoardNotificationForCourse = (idCourse, content, idCreatedBy) => {
  return axios.post(`api/Notification/AddBoardNotificationForCourse`, null, {
    params: {
      idCourse: idCourse,
      content: content,
      idCreatedBy: idCreatedBy,
    },
  });
};

const postDeleteNotificationBoard = (idNotification, idCreatedBy) => {
  return axios.post(`api/Notification/DeleteNotificationBoard`, null, {
    params: {
      idNotification: idNotification,
      idCreatedBy: idCreatedBy,
    },
  });
};
const postReadNotificationBoard = (idCourse, idUser) => {
  return axios.post(`api/Notification/ReadNotificationBoard`, null, {
    params: {
      idCourse: idCourse,
      idUser: idUser,
    },
  });
};

export {
  getAllNotificationOfUser,
  postChangeReadStatus,
  postReadAllNotification,
  getNotificationBoardOfCourse,
  postAddBoardNotificationForCourse,
  postDeleteNotificationBoard,
  postReadNotificationBoard,
};
