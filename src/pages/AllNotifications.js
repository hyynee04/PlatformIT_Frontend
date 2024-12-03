import { useEffect, useRef, useState } from "react";
import { IoMdCheckmark, IoMdOpen } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../assets/css/Notification.css";
import { APIStatus } from "../constants/constants";
import { formatDate, handleNotificationNavigate, setAvaNotification } from "../functions/function";
import { getAllNotificationOfUser, postChangeReadStatus } from "../services/notificationService";

const AllNotifications = () => {
    const navigate = useNavigate();

    const idUser = +localStorage.getItem("idUser")
    const optionBoxRef = useRef(null);
    const optionButtonRef = useRef(null);
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notificationGrouped, setNotificationGrouped] = useState([]);

    const groupNotificationsByDate = (notifications) => {
        // Formatter for day of the week
        const dayOfWeekFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

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
                acc[date].notificationList.push(notification);
                return acc;
            }, {})
        );
    }

    const changeReadStatus = async (idNotification, idUpdatedBy) => {
        let response = await postChangeReadStatus(idNotification, idUpdatedBy)
        if (response.status !== APIStatus.success) {
            console.log(response.data);
        }
    }

    const fetchUserNotification = async (idUser) => {
        setLoading(true);
        try {
            let response = await getAllNotificationOfUser(idUser)
            if (response.status === APIStatus.success) {
                const processedData = groupNotificationsByDate(response.data).map((item) => ({
                    ...item, // Preserve the date field
                    notificationList: item.notificationList.map((notification) => ({
                        ...notification,
                        timestamp: parseRelativeTime(notification.relativeTime), // Add timestamp to each notification
                    })),
                }));
                setNotificationGrouped(processedData)
            }
        } catch (error) {
            console.log("Error fetching data: ", error)
        } finally {
            setLoading(false);
        }
    }

    const parseRelativeTime = (relativeTime) => {
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

    const calculateRelativeTime = (timestamp) => {
        const now = new Date();
        const difference = Math.floor((now - timestamp) / 1000); // Difference in seconds

        if (difference === 0) return "just now"; // Handle 0 seconds
        if (difference < 60) return `${difference} ${difference > 1 ? "seconds" : "second"} ago`;
        if (difference < 3600) return `${Math.floor(difference / 60)} ${Math.floor(difference / 60) > 1 ? "minutes" : "minute"} ago`;
        if (difference < 86400) return `${Math.floor(difference / 3600)} ${Math.floor(difference / 3600) > 1 ? "hours" : "hour"} ago`;
        return `${Math.floor(difference / 86400)} ${Math.floor(difference / 86400) > 1 ? "days" : "day"} ago`;
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
                    }))
                })),
            );
        }, 60000);// Update every minute

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        console.log(notificationGrouped)
    }, [notificationGrouped])


    useEffect(() => {
        const handleClickOutsideOptionBox = (event) => {
            if (
                optionBoxRef.current &&
                !optionBoxRef.current.contains(event.target) &&
                !optionButtonRef.current.contains(event.target)
            )
                setIsOptionOpen(false);
        }
        // Attach both event listeners
        document.addEventListener("mousedown", handleClickOutsideOptionBox);
        // Cleanup both event listeners on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideOptionBox);
        };
    }, []);

    return (
        <div className="all-notification-container">
            <div className="notification-display-block">
                <div className="container-header">
                    <div className="header-content">
                        <span className="container-title">Notifications</span>
                        <button
                            ref={optionButtonRef}
                            onClick={() => setIsOptionOpen(!isOptionOpen)}
                        ><IoEllipsisHorizontal /></button>
                    </div>
                </div>
                <div className="notification-display-body">
                    {notificationGrouped && notificationGrouped.map((item, index) => (
                        <div key={index} className="notification-day">
                            <span>{item.dayOfWeek}, {formatDate(item.date)}</span>
                            <div className="notifications">
                                {item.notificationList && item.notificationList.length > 0 &&
                                    item.notificationList.map((notification, index) => (
                                        <div
                                            key={index}
                                            className={`notification-item ${notification.isRead ? "" : "unread"}`}
                                            onClick={() => {
                                                handleNotificationNavigate(notification, navigate);
                                                changeReadStatus(notification.idNotification, idUser)
                                            }}
                                        >
                                            <div className="noti-ava-container">
                                                <img src={setAvaNotification(notification)} alt="ava" />
                                            </div>
                                            <div className="noti-body">
                                                <span className="noti-content">{notification.content}</span>
                                                <span className="noti-time">{notification.relativeTime}</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

                </div>
                <div
                    ref={optionBoxRef}
                    className={`all-notification-option ${isOptionOpen ? "active" : ""}`}
                >
                    <button><IoMdCheckmark />Mark all as read</button>
                    <button><IoMdOpen />See all</button>
                </div>
            </div>
        </div>
    )
}
export default AllNotifications;