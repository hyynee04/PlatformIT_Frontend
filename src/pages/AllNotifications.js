import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoMdCheckmark } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../assets/css/Notification.css";
import { APIStatus } from "../constants/constants";
import FetchDataUpdated from "../functions/FetchDataUpdated";
import {
  calculateRelativeTime,
  formatDate,
  handleNotificationNavigate,
  parseRelativeTime,
  setAvaNotification,
} from "../functions/function";
import {
  getAllNotificationOfUser,
  postChangeReadStatus,
  postReadAllNotification,
} from "../services/notificationService";

const AllNotifications = () => {
  const navigate = useNavigate();

  const idUser = +localStorage.getItem("idUser");
  const optionBoxRef = useRef(null);
  const optionButtonRef = useRef(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationGrouped, setNotificationGrouped] = useState([]);
  const [unreadCount, setUnreadCount] = useState(null);
  const { updatedNotifications, updatedUnreadCount } = FetchDataUpdated(
    idUser,
    null,
    "notification"
  );

  const groupNotificationsByDate = (notifications) => {
    // Formatter for day of the week
    const dayOfWeekFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    });

    return Object.values(
      // acc is the array result
      notifications.reduce((acc, notification) => {
        // Extract the date in YYYY-MM-DD format
        const dateObject = new Date(notification.createdDate);
        const date = dateObject.toISOString().split("T")[0];
        const dayOfWeek = dayOfWeekFormatter.format(dateObject);
        // Initialize an entry if the date does not exist
        if (!acc[date]) {
          acc[date] = { date, dayOfWeek, notificationList: [] };
        }
        // Add the notification to the corresponding date's list
        acc[date].notificationList.push({
          ...notification,
          timestamp: parseRelativeTime(notification.relativeTime),
        });
        return acc;
      }, {})
    );
  };

  const changeReadStatus = async (idNotification, idUpdatedBy) => {
    let response = await postChangeReadStatus(idNotification, idUpdatedBy);
    if (response.status !== APIStatus.success) {
      console.log(response.data);
    }
  };

  const markAllAsRead = async (idUpdatedBy) => {
    let response = await postReadAllNotification(idUpdatedBy);
    if (response.status === APIStatus.success) {
      fetchUserNotification(idUser);
    } else {
      console.error("Error posting data: ", response.data);
    }
  };

  const fetchUserNotification = async (idUser) => {
    setLoading(true);
    try {
      let response = await getAllNotificationOfUser(idUser);
      if (response.status === APIStatus.success) {
        setUnreadCount(
          response.data.filter((notification) => notification.isRead === 0)
            .length
        );
        setNotificationGrouped(groupNotificationsByDate(response.data));
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNotification(idUser);
    const interval = setInterval(() => {
      setNotificationGrouped((prevNotificationGrouped) =>
        prevNotificationGrouped.map((item) => ({
          ...item,
          notificationList: item.notificationList.map((notification) => ({
            ...notification,
            relativeTime: calculateRelativeTime(notification.timestamp),
          })),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Array.isArray(updatedNotifications)) {
      // Ensure it's a valid array
      setNotificationGrouped(groupNotificationsByDate(updatedNotifications));
      setUnreadCount(updatedUnreadCount > 99 ? "99+" : updatedUnreadCount);
    } else {
      console.warn(
        "updatedNotifications is not an array or is undefined:",
        updatedNotifications
      );
    }
  }, [updatedNotifications, updatedUnreadCount]);

  useEffect(() => {
    const handleClickOutsideOptionBox = (event) => {
      if (
        optionBoxRef.current &&
        !optionBoxRef.current.contains(event.target) &&
        !optionButtonRef.current.contains(event.target)
      )
        setIsOptionOpen(false);
    };
    // Attach both event listeners
    document.addEventListener("mousedown", handleClickOutsideOptionBox);
    // Cleanup both event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptionBox);
    };
  }, []);

  return (
    <div className="all-notification-container">
      {loading ? (
        <div className="loading-page">
          <ImSpinner2 color="#397979" />
        </div>
      ) : (
        <div
          className={`notification-display-block ${
            !loading ? "slide-to-left" : ""
          }`}
        >
          <div className="container-header">
            <div className="header-content">
              <span className="container-title">Notifications</span>
              <button
                ref={optionButtonRef}
                onClick={() => setIsOptionOpen(!isOptionOpen)}
              >
                <IoEllipsisHorizontal />
              </button>
            </div>
          </div>
          <div className="notification-display-body">
            {notificationGrouped &&
              notificationGrouped.map((item, index) => (
                <div key={index} className="notification-day">
                  <span>
                    {item.dayOfWeek}, {formatDate(item.date)}
                  </span>
                  <div className="notifications">
                    {item.notificationList &&
                      item.notificationList.length > 0 &&
                      item.notificationList.map((notification, index) => (
                        <div
                          key={index}
                          className={`notification-item ${
                            notification.isRead ? "" : "unread"
                          }`}
                          onClick={() => {
                            handleNotificationNavigate(notification, navigate);
                            changeReadStatus(
                              notification.idNotification,
                              idUser
                            );
                          }}
                        >
                          <div className="noti-ava-container">
                            <img
                              src={setAvaNotification(notification)}
                              alt="ava"
                            />
                          </div>
                          <div className="noti-body">
                            <span className="noti-content">
                              {notification.content}
                            </span>
                            <span className="noti-time">
                              {notification.relativeTime}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <div
            ref={optionBoxRef}
            className={`all-notification-option ${
              isOptionOpen ? "active" : ""
            }`}
          >
            <button
              disabled={!unreadCount}
              onClick={() => markAllAsRead(idUser)}
            >
              <IoMdCheckmark />
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllNotifications;
