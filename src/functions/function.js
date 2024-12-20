import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import { NotificationType } from "../constants/constants";

export const getPagination = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    // Show all pages if there are 5 or fewer
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  } else {
    // Logic for more than 5 pages
    if (currentPage <= 3) {
      // Show first few pages if current page is near the start
      return [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      // Show last few pages if current page is near the end
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      // Show current page in the middle with surrounding pages
      return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  }
};
export const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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
    hour12: false,
  });
};
export const isPastDateTime = (dateTimeString) => {
  let inputDateTime;
  // Parse the input date-time string into a Date object
  inputDateTime = new Date(dateTimeString);
  // Get the current date and time
  const now = new Date();
  // Compare the dates
  return inputDateTime < now;
};
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Đảm bảo định dạng luôn 2 chữ số với padding
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
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

export const getVideoType = (fileName) => {
  // Check if the file name ends with a specific extension
  if (fileName.endsWith(".mp4")) {
    return "video/mp4";
  } else if (fileName.endsWith(".webm")) {
    return "video/webm";
  } else if (fileName.endsWith(".ogg")) {
    return "video/ogg";
  } else {
    return ""; // If the type is not recognized
  }
};

export const handleKeyDown = (event, handler) => {
  console.log(event.key);
  if (event.key === "Enter") {
    handler(); // Trigger passed handler function on Enter key press
  }
};
