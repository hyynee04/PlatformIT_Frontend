
import { useEffect, useRef, useState } from "react";
import { IoMdCheckmark, IoMdOpen } from "react-icons/io";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../assets/css/Notification.css";
import default_ava from "../assets/img/default_ava.png";
import { APIStatus } from "../constants/constants";
import { handleNotificationNavigate } from "../functions/function";
import { postChangeReadStatus } from "../services/notificationService";


const Notification = (props) => {
    const { idUser, isOpen, onClose, notiButtonRef, notifications, fetchUserNotification } = props;
    const navigate = useNavigate();

    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const optionBoxRef = useRef(null);
    const optionButtonRef = useRef(null);
    const notiBoxRef = useRef(null);

    // This state will help with the delay before removing the notification from the DOM
    const [isExiting, setIsExiting] = useState(false);

    const changeReadStatus = async (idNotification, idUpdatedBy) => {
        let response = await postChangeReadStatus(idNotification, idUpdatedBy)
        if (response.status === APIStatus.success) {
            fetchUserNotification();
        } else {
            console.log(response.data);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setIsExiting(true);

            const timer = setTimeout(() => {
                setIsExiting(false);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutsideOptionBox = (event) => {
            if (
                optionBoxRef.current &&
                !optionBoxRef.current.contains(event.target) &&
                !optionButtonRef.current.contains(event.target)
            )
                setIsOptionOpen(false);
        }

        const handleClickOutsideNotificationBox = (event) => {
            if (
                notiBoxRef.current &&
                !notiBoxRef.current.contains(event.target) &&
                (!notiButtonRef.current || (
                    notiButtonRef.current.style.display !== 'none' &&
                    notiButtonRef.current.style.visibility !== 'hidden' &&
                    !notiButtonRef.current.contains(event.target)
                ))
            ) {
                onClose();
            }
        }
        // Attach both event listeners
        document.addEventListener("mousedown", handleClickOutsideOptionBox);
        document.addEventListener("mousedown", handleClickOutsideNotificationBox);
        // Cleanup both event listeners on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideOptionBox);
            document.removeEventListener("mousedown", handleClickOutsideNotificationBox);
        };
    }, []);

    if (!isOpen && isExiting) {
        return null;
    }
    return (
        <>
            <div
                ref={notiBoxRef}
                className={`notification-container ${isOpen || isExiting ? "active" : ""}`}
            >
                <div className="container-header">
                    <div className="header-content">
                        <span className="container-title">Notifications</span>
                        <button
                            ref={optionButtonRef}
                            onClick={() => setIsOptionOpen(!isOptionOpen)}
                        ><IoEllipsisHorizontal /></button>
                    </div>
                    <hr />
                </div>
                {notifications && notifications.length > 0 && (
                    <div className="notification-list">
                        {notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`notification-item ${notification.isRead ? "" : "unread"}`}
                                onClick={() => {
                                    changeReadStatus(notification.idNotification, idUser);
                                    handleNotificationNavigate(notification, navigate);
                                    onClose();
                                }}
                            >
                                <div className="noti-ava-container">
                                    <img src={notification.senderAvatar || default_ava} alt="ava" />
                                </div>
                                <div className="noti-body">
                                    <span className="noti-content">{notification.content}</span>
                                    <span className="noti-time">{notification.relativeTime}</span>
                                </div>
                            </div>
                        ))}

                    </div>
                )}


                <div
                    ref={optionBoxRef}
                    className={`notification-option ${isOptionOpen ? "active" : ""}`}
                >
                    <button><IoMdCheckmark />Mark all as read</button>
                    <button><IoMdOpen />See all</button>
                </div>
            </div>
        </>
    )
}
export default Notification;