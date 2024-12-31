import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import {
  APIStatus,
  LectureStatus,
  NotificationType,
} from "../constants/constants";
import { getLectureInfoForCmtNoti } from "../services/courseService";

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
export const formatDateTimeWithTimeZone = (dateString) => {
  const formattedDateString = dateString.split(".")[0] + "Z";
  const date = new Date(formattedDateString);
  const now = new Date();

  // So sánh thời gian chính xác (bao gồm giờ, phút, giây)
  const isSameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  // Kiểm tra xem ngày có phải là cùng tuần không
  const currentDayOfWeek = now.getDay();

  const isSameWeek =
    now.getDate() - currentDayOfWeek <= date.getDate() &&
    date.getDate() <= now.getDate() - currentDayOfWeek + 6;

  if (isSameDay) {
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (isSameWeek) {
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else {
    console.log("different year");
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
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
export const handleNotificationNavigate = async (notification, navigate) => {
  let idCourse;
  let sectionName = "";
  if (
    notification.notificationType === NotificationType.comment ||
    notification.notificationType === NotificationType.lecture
  ) {
    try {
      const respone = await getLectureInfoForCmtNoti(notification.idLecture);
      if (respone.status === APIStatus.success) {
        idCourse = respone.data.idCourse;
        sectionName = respone.data.nameSection;
      } else {
        console.error(Response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
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
  } else if (notification.notificationType === NotificationType.comment) {
    navigate("/viewLecture", {
      state: {
        idLecture: notification.idLecture,
        idCourse: idCourse,
        idComment: notification.idComment,
      },
    });
  } else if (notification.notificationType === NotificationType.lecture) {
    if (notification.content.toLowerCase().includes("approved")) {
      navigate("/viewLecture", {
        state: {
          idLecture: notification.idLecture,
          idCourse: notification.idCourse,
        },
      });
    } else {
      navigate("/addNewLecture", {
        state: {
          idLecture: notification.idLecture,
          lectureStatus: LectureStatus.rejected,
          sectionName: sectionName,
          from: "notification",
        },
      });
    }
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

  if (difference === 0) return "Just now"; // Handle 0 seconds
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

export const processCommentList = (commentList) => {
  const mainList = [];
  const replyObject = {};

  // Step 1: Categorize comments
  commentList.forEach((comment) => {
    if (!comment.idCommentRef) {
      // Main comment
      mainList.push({
        ...comment,
        timestamp: parseRelativeTime(comment.relativeTime),
      });
      if (!replyObject[comment.idComment]) {
        replyObject[comment.idComment] = [];
      }
    } else {
      // Reply comment
      if (replyObject[comment.idCommentRef]) {
        const refComment = mainList.find(
          (item) => item.idComment === comment.idCommentRef
        );
        replyObject[comment.idCommentRef].push({
          ...comment,
          commentRefName: "",
          timestamp: parseRelativeTime(comment.relativeTime),
        });
      } else {
        // Handle nested replies
        Object.keys(replyObject).forEach((key) => {
          const nestedReply = replyObject[key].find(
            (item) => item.idComment === comment.idCommentRef
          );
          if (nestedReply) {
            replyObject[key].push({
              ...comment,
              // nameRep:
              //   nestedReply.idUser !== comment.idUser
              //     ? nestedReply.fullName
              //     : "",
              timestamp: parseRelativeTime(comment.relativeTime),
            });
          }
        });
      }
    }
  });

  // Step 2: Sort mainList and replies
  mainList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

  Object.keys(replyObject).forEach((key) => {
    replyObject[key].sort(
      (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );
  });

  return { main: mainList, reply: replyObject };
};

export const convertToVietnamTime = (date) => {
  // Cắt bỏ phần micro giây để giữ lại mili giây
  console.log(date);

  const validDate = new Date(date.split(".")[0]); // Cắt phần sau dấu '.'
  if (isNaN(validDate)) {
    throw new Error("Invalid time value");
  }

  const options = {
    timeZone: "Asia/Ho_Chi_Minh",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Để hiển thị định dạng 12 giờ
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(validDate);
};
