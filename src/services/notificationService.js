import axios from "../utils/axiosCustomize";

const getAllNotificationOfUser = (idUser) => {
    return axios.get("api/Notification/GetAllNotificationOfUser", {
        params: {
            idUser: idUser,
        },
    });
}

export { getAllNotificationOfUser };

