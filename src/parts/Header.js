import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuMessageCircle } from "react-icons/lu";
import { Role } from "../constants/constants";
import { useState } from "react";
import HeaderAvatarOption from "../components/HeaderAvatarOption";
import default_ava from "../assets/img/default_ava.png";

import "../assets/scss/Header.css";
const Header = () => {
  const [showOptionAva, setShowOptionAva] = useState(false);
  const location = useLocation();
  const idRole = location.state?.idRole || localStorage.getItem("idRole");
  const navigate = useNavigate();
  const currentPath = location.pathname; //current path

  const navLinks = {
    [Role.platformAdmin]: [
      { title: "Dashboard", path: "/platformAdminDashboard" },
      { title: "User", path: "/platformAdminUser" },
      { title: "Center", path: "/platformAdminCenter" },
      { title: "Course", path: "/platformAdminCourse" },
    ],
    [Role.centerAdmin]: [
      { title: "Dashboard", path: "/centerAdminDashboard" },
      { title: "Course Management", path: "/centerAdminCourse" },
      { title: "User Management", path: "/centerAdminUser" },
      { title: "Center Management", path: "/centerAdminCenter" },
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
                  {(idRole === Role.student || Role.teacher) && (
                    <button className="circle-buts">
                      <LuMessageCircle className="header-icon" />
                    </button>
                  )}
                  <button className="circle-buts">
                    <LuBell className="header-icon" />
                  </button>
                  <button
                    className="circle-buts pi "
                    onClick={toggleVisibility}
                  >
                    <img src={default_ava} alt="" className="header-avatar" />
                  </button>
                </>
              )}
            </div>
            {showOptionAva && (
              <HeaderAvatarOption setShowOptionAva={setShowOptionAva} />
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
