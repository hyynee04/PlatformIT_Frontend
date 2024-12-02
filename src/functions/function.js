import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import { NotificationType } from '../constants/constants';

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
    });
};

export const handleNotificationNavigate = (notification, navigate) => {
    if (notification.notificationType === NotificationType.qualification) {
        navigate("/pi", {
            state: { action: "specializedPI" }
        });
    } else if (notification.notificationType === NotificationType.assignedTeacher && notification.idCourse) {
        navigate("/courseDetail", {
            state: {
                idCourse: notification.idCourse,
                idUser: localStorage.getItem("idUser"),
                idRole: localStorage.getItem("idRole"),
            }
        });
    } else if (notification.notificationType === NotificationType.assignedTeacher && notification.idCourse) {
        navigate("/courseDetail", {
            state: {
                idCourse: notification.idCourse,
                idUser: localStorage.getItem("idUser"),
                idRole: localStorage.getItem("idRole"),
            }
        });
    }
}

export const setAvaNotification = (notification) => {
    if (notification.senderAvatar) {
        return notification.senderAvatar;
    } else if (notification.notificationType === NotificationType.qualification ||
        notification.notificationType === NotificationType.assignedTeacher) {
        return default_image;
    }
    return default_ava;  // or some other fallback if needed
};