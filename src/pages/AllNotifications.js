import { useRef } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import "../assets/css/Notification.css";

const AllNotifications = () => {
    const optionButtonRef = useRef(null);
    return (
        <div className="all-notification-container">
            <div className="notification-display-block">
                <div className="container-header">
                    <div className="header-content">
                        <span className="container-title">Notifications</span>
                        <button
                            ref={optionButtonRef}
                        // onClick={() => setIsOptionOpen(!isOptionOpen)}
                        ><IoEllipsisHorizontal /></button>
                    </div>
                </div>
                <div className="notification-display-body"></div>
            </div>
        </div>
    )
}
export default AllNotifications;