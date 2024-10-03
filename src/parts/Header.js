import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { LuBell, LuMessageCircle } from "react-icons/lu";
import { Role } from "../constants/constants";

import "../assets/scss/Header.scss";

const Header = ({ idRole, idUser }) => {
  console.log(idRole);
  const navigate = useNavigate();
  const renderNavLinksByRole = () => {
    console.log(idRole);
    switch (idRole) {
      case Role.platformAdmin: //PlatformAdmin
        return (
          <>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/">User</Nav.Link>
            <Nav.Link href="/">Center</Nav.Link>
            <Nav.Link href="/">Course</Nav.Link>
          </>
        );
      case Role.centerAdmin:
        return (
          <>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/">Course</Nav.Link>
            <Nav.Link href="/">User</Nav.Link>
            <Nav.Link href="/">Center</Nav.Link>
          </>
        );
      case Role.teacher:
        return (
          <>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">My Course</Nav.Link>
            <Nav.Link href="/">My Lecture</Nav.Link>
          </>
        );
      case 3:
        return (
          <>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">My Course</Nav.Link>
            <Nav.Link href="/">Assignment</Nav.Link>
          </>
        );
      default:
        return (
          <>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">About Us</Nav.Link>
          </>
        );
    }
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
                  onClick={() => navigate("/pi_teacher")}
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
