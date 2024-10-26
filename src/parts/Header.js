import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuMessageCircle, LuClipboard } from "react-icons/lu";
import { Role } from "../constants/constants";
import { useEffect, useState } from "react";
import HeaderAvatarOption from "../components/HeaderAvatarOption";
import default_ava from "../assets/img/default_ava.png";

import "../assets/scss/Header.css";
import { getAvaImg } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../store/profileUserSlice";
const Header = () => {
  const dispatch = useDispatch();
  const avaImg = useSelector((state) => state.profileUser.avaImg);
  const [showOptionAva, setShowOptionAva] = useState(false);
  const location = useLocation();
  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");
  const navigate = useNavigate();
  const currentPath = location.pathname; //current path
  const [activeButton, setActiveButton] = useState(null);
  // const [avaImg, setAvaImg] = useState(null);
  useEffect(() => {
    if (idRole === Role.platformAdmin && currentPath === "/") {
      navigate("/platformAdDashboard");
    } else if (idRole === Role.centerAdmin && currentPath === "/") {
      navigate("/centerAdDashboard");
    } else if (idRole === Role.teacher && currentPath === "/") {
      navigate("/teacherHome");
    } else if (idRole === Role.student && currentPath === "/") {
      navigate("/studentHome");
    }
  }, [idRole, currentPath, navigate]);
  useEffect(() => {
    const fetchAvatar = async () => {
      if (idUser) {
        const response = await getAvaImg(idUser);
        if (response !== "This user has not set up avatar yet!")
          dispatch(setAvatar(response));
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
      { title: "Course Management", path: "/centerAdCourse" },
      { title: "User Management", path: "/centerAdUser" },
      { title: "Center Management", path: "/centerAdCenter" },
    ],
    [Role.teacher]: [
      { title: "Home", path: "/teacherHome" },
      { title: "Course Management", path: "/teacherCourse" },
      { title: "Lecture Management", path: "/teacherLecture" },
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
  const links = navLinks[idRole] || navLinks.default;

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
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "clipboard") {
      navigate("/centerAdPendingTask");
    } else if (buttonName === "avatar") {
      toggleVisibility();
    }
  };

  const toggleVisibility = () => {
    setShowOptionAva(!showOptionAva);
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
                        activeButton === "clipboard" ? "clicked" : ""
                      }`}
                      onClick={() => handleButtonClick("clipboard")}
                    >
                      <LuClipboard className="header-icon" />
                    </button>
                  )}
                  <button
                    className={`circle-buts ${
                      activeButton === "bell" ? "clicked" : ""
                    }`}
                    onClick={() => handleButtonClick("bell")}
                  >
                    <LuBell className="header-icon" />
                  </button>
                  <button
                    className={`circle-buts ${
                      activeButton === "avatar" ? "clicked" : ""
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
    </>
  );
};

export default Header;
