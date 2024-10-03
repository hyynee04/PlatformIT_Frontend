import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuBell, LuMessageCircle } from "react-icons/lu";
import { Role } from "../constants/constants";

import "../assets/scss/Header.scss";

const Header = ({ idRole, idUser }) => {
  console.log(idRole);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname; //current path
  console.log(currentPath);

  const navLinks = {
    [Role.platformAdmin]: [
      { title: "Dashboard", path: "/platformAdminDashboard" },
      { title: "User", path: "/platformAdminUser" },
      { title: "Center", path: "/platformAdminCenter" },
      { title: "Course", path: "/platformAdminCourse" },
    ],
    [Role.centerAdmin]: [
      { title: "Dashboard", path: "/centerAdminDashboard" },
      { title: "Course", path: "/centerAdminCourse" },
      { title: "User", path: "/centerAdminUser" },
      { title: "Center", path: "/centerAdminCenter" },
    ],
    [Role.teacher]: [
      { title: "Home", path: "/teacherHome" },
      { title: "My Course", path: "/teacherCourse" },
      { title: "My Lecture", path: "/teacherLecture" },
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
    console.log(idRole);
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
  return (
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
                  onClick={() => {
                    (idRole === Role.teacher && navigate("./teacherPI")) ||
                      (idRole === Role.student && navigate("./studentPI"));
                  }}
                >
                  <div className="ava-img" />
                </button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
