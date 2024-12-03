import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import { NotificationType } from "../constants/constants";

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Hiển thị giờ theo định dạng 24h
  });
};
export const handleNotificationNavigate = (notification, navigate) => {
  if (notification.notificationType === NotificationType.qualification) {
    navigate("/pi", {
      state: { action: "specializedPI" },
    });
  } else if (
    notification.notificationType === NotificationType.assignedTeacher &&
    notification.idCourse
  ) {
    navigate("/courseDetail", {
      state: {
        idCourse: notification.idCourse,
        idUser: localStorage.getItem("idUser"),
        idRole: localStorage.getItem("idRole"),
      },
    });
  } else if (
    notification.notificationType === NotificationType.assignedTeacher &&
    notification.idCourse
  ) {
    navigate("/courseDetail", {
      state: {
        idCourse: notification.idCourse,
        idUser: localStorage.getItem("idUser"),
        idRole: localStorage.getItem("idRole"),
      },
    });
  }
};

export const setAvaNotification = (notification) => {
  if (notification.senderAvatar) {
    return notification.senderAvatar;
  } else if (
    notification.notificationType === NotificationType.qualification ||
    notification.notificationType === NotificationType.assignedTeacher
  ) {
    return default_image;
  }
  return default_ava; // or some other fallback if needed
};

// Helper to calculate relative time
export const calculateRelativeTime = (timestamp) => {
  const now = new Date();
  const difference = Math.floor((now - timestamp) / 1000); // Difference in seconds

  if (difference === 0) return "just now"; // Handle 0 seconds
  if (difference < 60)
    return `${difference} ${difference > 1 ? "seconds" : "second"} ago`;
  if (difference < 3600)
    return `${Math.floor(difference / 60)} ${
      Math.floor(difference / 60) > 1 ? "minutes" : "minute"
    } ago`;
  if (difference < 86400)
    return `${Math.floor(difference / 3600)} ${
      Math.floor(difference / 3600) > 1 ? "hours" : "hour"
    } ago`;
  return `${Math.floor(difference / 86400)} ${
    Math.floor(difference / 86400) > 1 ? "days" : "day"
  } ago`;
};

// Helper to parse "relativeTime" into a timestamp
export const parseRelativeTime = (relativeTime) => {
  const now = new Date();
  const parts = relativeTime.split(" ");

  if (parts.includes("seconds")) {
    return new Date(now.getTime() - parseInt(parts[0], 10) * 1000);
  } else if (parts.includes("minutes")) {
    return new Date(now.getTime() - parseInt(parts[0], 10) * 60 * 1000);
  } else if (parts.includes("hours")) {
    return new Date(now.getTime() - parseInt(parts[0], 10) * 3600 * 1000);
  } else if (parts.includes("days")) {
    return new Date(now.getTime() - parseInt(parts[0], 10) * 86400 * 1000);
  }
  return now; // Default to current time if unrecognized format
};
