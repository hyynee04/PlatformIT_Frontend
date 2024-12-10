import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  LuBell,
  LuClipboardCheck,
  LuLogOut,
  LuMessageCircle,
} from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import default_ava from "../assets/img/default_ava.png";
import HeaderAvatarOption from "../components/HeaderAvatarOption";
import { APIStatus, Role } from "../constants/constants";

import { useDispatch, useSelector } from "react-redux";
import "../assets/css/Header.css";
import DiagSignOutForm from "../components/diag/DiagSignOutForm";
import Notification from "../components/Notification";
import FetchDataUpdated from "../functions/FetchDataUpdated";
import {
  calculateRelativeTime,
  parseRelativeTime,
} from "../functions/function";
import { getAllNotificationOfUser } from "../services/notificationService";
import { getAvaImg } from "../services/userService";
import { setAvatar } from "../store/profileUserSlice";
import { countTaskOfCenterAd } from "../store/listTaskOfCenterAd";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const avaImg = useSelector((state) => state.profileUser.avaImg);
  const [showOptionAva, setShowOptionAva] = useState(false);
  const isAvatarPage = location.pathname === "/pi";
  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");
  const isPendingCenter = localStorage.getItem("isPendingCenter");
  const navigate = useNavigate();
  const currentPath = location.pathname; //current path
  const [activeButton, setActiveButton] = useState(null);
  const [isModalSignoutOpen, setIsModalSignoutOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(null);
  const { updatedNotifications, updatedUnreadCount } = FetchDataUpdated(idUser);

  const openSignoutModal = () => setIsModalSignoutOpen(true);
  const closeSignoutModal = () => setIsModalSignoutOpen(false);
  // const [avaImg, setAvaImg] = useState(null);
  useEffect(() => {
    if (isPendingCenter) {
      navigate("/pendingCenter");
    } else {
      if (idRole === Role.platformAdmin && currentPath === "/") {
        navigate("/platformAdDashboard");
      } else if (idRole === Role.centerAdmin && currentPath === "/") {
        navigate("/centerAdDashboard");
      } else if (idRole === Role.teacher && currentPath === "/") {
        console.log("zo day");

        navigate("/teacherHome");
      } else if (idRole === Role.student && currentPath === "/") {
        navigate("/studentHome");
      }
    }
  }, [idRole, currentPath, navigate]);

  const fetchUserNotification = async (idUser) => {
    let response = await getAllNotificationOfUser(idUser);
    if (response.status === APIStatus.success) {
      const processedData = response.data.map((notification) => ({
        ...notification,
        timestamp: parseRelativeTime(notification.relativeTime),
      }));
      let unread = processedData.filter(
        (notification) => notification.isRead === 0
      ).length;
      setUnreadCount(unread > 99 ? "99+" : unread);
      setNotifications(processedData);
    } else {
      console.log(response.data);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (idUser) {
        const response = await getAvaImg(idUser);
        if (response.status === APIStatus.success) {
          dispatch(setAvatar(response.data));
        } else {
          dispatch(setAvatar(null));
        }
      }
    };
    fetchAvatar();
    fetchUserNotification(idUser);
    const interval = setInterval(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          relativeTime: calculateRelativeTime(notification.timestamp),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dispatch, idUser]);

  useEffect(() => {
    if (Array.isArray(updatedNotifications)) {
      // Ensure it's a valid array
      const processedData = updatedNotifications.map((notification) => ({
        ...notification,
        timestamp: parseRelativeTime(notification.relativeTime),
      }));
      setUnreadCount(updatedUnreadCount > 99 ? "99+" : updatedUnreadCount);
      setNotifications(processedData);
    } else {
      console.warn(
        "updatedNotifications is not an array or is undefined:",
        updatedNotifications
      );
    }
  }, [updatedNotifications, updatedUnreadCount]);
  useEffect(() => {
    dispatch(countTaskOfCenterAd("qualification"));
  }, [dispatch]);

  // useEffect(() => {
  //   if (taskOfCenterAd) {
  //     setListTask(taskOfCenterAd);
  //   }
  // }, [taskOfCenterAd]);

  const navLinks = {
    [Role.platformAdmin]: [
      { title: "Dashboard", path: "/platformAdDashboard" },
      { title: "User Management", path: "/platformAdUser" },
      { title: "Center Management", path: "/platformAdCenter" },
      { title: "Course Management", path: "/platformAdCourse" },
    ],
    [Role.centerAdmin]: [
      { title: "Dashboard", path: "/centerAdDashboard" },
      { title: "Course Management", path: "/centerAdCourse" }, //centerAdCourse
      { title: "User Management", path: "/centerAdUser" },
      { title: "Center Management", path: "/centerAdCenter" },
    ],
    [Role.teacher]: [
      { title: "Home", path: "/teacherHome" },
      { title: "Course Management", path: "/teacherCourse" },
      { title: "Assignment Management", path: "/teacherAssignment" },
    ],
    [Role.student]: [
      { title: "Home", path: "/studentHome" },
      { title: "My Course", path: "/studentCourse" },
      { title: "My Test", path: "/studentTest" },
    ],
    default: [
      { title: "Home", path: "/" },
      { title: "About Us", path: "/aboutUs" },
    ],
  };
  // const links = navLinks[idRole] || isPendingCenter ||  navLinks.default;
  const links = isPendingCenter ? [] : navLinks[idRole] || navLinks.default;

  const renderNavLinksByRole = () => {
    return links.map(({ title, path }, index) => (
      <Nav.Link
        key={index}
        href={path}
        className={currentPath === path ? "active" : ""}
      >
        {title}
      </Nav.Link>
    ));
  };
  const buttonPaths = {
    clipboard: "/centerAdPendingTask",
    bell: "/allNotifications",
  };
  const toggleVisibility = () => {
    setShowOptionAva(!showOptionAva);
  };
  const handleButtonClick = (buttonName) => {
    if (buttonName === "avatar") {
      if (!isAvatarPage) {
        setShowOptionAva(!showOptionAva);
      } else {
        navigate("/pi");
        toggleVisibility();
      }
    } else {
      navigate(buttonPaths[buttonName]);
      setShowOptionAva(false);
    }
  };

  const optionButtonRef = useRef(null);
  const notiButtonRef = useRef(null);
  // console.log(notifications)
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <NavLink to="/" className="navbar-brand">
            <div className="logo-container">
              <span className="name-brand">PLAIT</span>
            </div>
          </NavLink>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{renderNavLinksByRole()}</Nav>

            {!idRole ? (
              <div className="auth-buttons">
                <button
                  className="buts sign-in"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
                <button
                  className="buts register"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            ) : isPendingCenter ? (
              <div className="auth-buttons">
                <button
                  className="circle-buts"
                  onClick={() => openSignoutModal()}
                >
                  <LuLogOut className="header-icon" />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                {(idRole === Role.student || idRole === Role.teacher) && (
                  <button
                    className={`circle-buts ${
                      activeButton === "message" ? "clicked" : ""
                    }`}
                    onClick={() => handleButtonClick("message")}
                  >
                    <LuMessageCircle className="header-icon" />
                  </button>
                )}
                {idRole === Role.centerAdmin && (
                  <>
                    <button
                      className={`circle-buts ${
                        location.pathname === buttonPaths["clipboard"]
                          ? "clicked"
                          : ""
                      }`}
                      onClick={() => handleButtonClick("clipboard")}
                    >
                      <LuClipboardCheck className="header-icon" />
                    </button>
                    {unreadCount ? (
                      <div className="number-unseen">{unreadCount}</div>
                    ) : null}
                  </>
                )}
                <button
                  ref={notiButtonRef}
                  disabled={location.pathname === buttonPaths["bell"]}
                  className={`circle-buts ${
                    location.pathname === buttonPaths["bell"] ? "clicked" : ""
                  }`}
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                  }}
                >
                  <LuBell className="header-icon" />
                </button>
                {unreadCount ? (
                  <div className="number-unseen">{unreadCount}</div>
                ) : null}
                <Notification
                  idUser={idUser}
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notiButtonRef={notiButtonRef}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  fetchUserNotification={() => fetchUserNotification(idUser)}
                />
                <button
                  ref={optionButtonRef}
                  className={`circle-buts ${
                    isAvatarPage || showOptionAva ? "clicked" : ""
                  }`}
                  onClick={() => handleButtonClick("avatar")}
                >
                  <img
                    src={avaImg || default_ava}
                    alt=""
                    className="header-avatar"
                  />
                </button>
              </div>
            )}
            <HeaderAvatarOption
              optionButtonRef={optionButtonRef}
              isOpen={showOptionAva}
              onClose={() => setShowOptionAva(false)}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {isModalSignoutOpen && (
        <div>
          <DiagSignOutForm
            isOpen={isModalSignoutOpen}
            onClose={closeSignoutModal}
          />
        </div>
      )}
    </>
  );
};

export default Header;
