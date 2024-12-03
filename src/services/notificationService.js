import axios from "../utils/axiosCustomize";

const getAllNotificationOfUser = (idUser) => {
    return axios.get("api/Notification/GetAllNotificationOfUser", {
        params: {
            idUser: idUser,
        },
    });
}

const postChangeReadStatus = (idNotification, idUpdatedBy) => {
    return axios.post(`api/Notification/ChangeReadStatus`, null, {
        params: {
            idNotification: idNotification,
            idUpdatedBy: idUpdatedBy,
        },
    })
}

export { getAllNotificationOfUser, postChangeReadStatus };

