import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LuBell,
  LuMessageCircle,
  LuClipboardCheck,
  LuLogOut,
} from "react-icons/lu";
import { APIStatus, Role } from "../constants/constants";
import { useEffect, useState } from "react";
import HeaderAvatarOption from "../components/HeaderAvatarOption";
import default_ava from "../assets/img/default_ava.png";

import "../assets/scss/Header.css";
import { getAvaImg } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../store/profileUserSlice";
import DiagSignOutForm from "../components/diag/DiagSignOutForm";

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
        navigate("/teacherHome");
      } else if (idRole === Role.student && currentPath === "/") {
        navigate("/studentHome");
      }
    }
  }, [idRole, currentPath, navigate]);
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
  }, [dispatch, idUser]);
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
      { title: "Assignment", path: "/studentAssignment" },
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
    bell: "/notifications",
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
            <div className="auth-buttons">
              {!idRole ? (
                <>
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
                </>
              ) : isPendingCenter ? (
                <>
                  <button
                    className="circle-buts"
                    onClick={() => openSignoutModal()}
                  >
                    <LuLogOut className="header-icon" />
                  </button>
                </>
              ) : (
                <>
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
                  )}
                  <button
                    className={`circle-buts ${
                      location.pathname === buttonPaths["bell"] ? "clicked" : ""
                    }`}
                    onClick={() => handleButtonClick("bell")}
                  >
                    <LuBell className="header-icon" />
                  </button>

                  <button
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
                </>
              )}
            </div>
            {showOptionAva && <HeaderAvatarOption />}
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
