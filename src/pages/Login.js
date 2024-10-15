import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { FaGooglePlusG } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuMail, LuUser } from "react-icons/lu";
import { RiFacebookFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import {
  useLocation,
  useNavigate
} from "react-router-dom";
import "../assets/scss/Login.css";
import { Role, Status } from "../constants/constants";
import {
  postLogin
} from "../services/authService";
import { postForgotPassword } from "../services/userService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowed, setIsShowed] = useState(false);

  const [isFailed, setIsFailed] = useState(false);
  const [isValid, setIsValid] = useState(true)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    const isValidEmail = validateEmail(username);
    if (isValidEmail) {
      setEmail(username)
    }
    setShow(true);
  }

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);

    // Step 1: Check if there is state from the previous navigation
    const state = location.state;
    if (state && state.idUser && state.idRole) {
      // Automatically log in the user
      handleAutoLogin(state.idUser, state.idRole);
    }
  }, [location.state]);


  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleAutoLogin = async (idUser, idRole) => {
    // Step 2: Simulate a login action based on the received idUser and idRole
    localStorage.setItem("idRole", idRole);
    localStorage.setItem("idUser", idUser);
    //console.log(localStorage.getItem("idRole"))
    // Navigate to the appropriate page based on role
    let roleBasesPath = "/";
    switch (parseInt(idRole)) {
      case Role.platformAdmin:
        roleBasesPath = "/platformAdDashboard";
        break;
      case Role.centerAdmin:
        roleBasesPath = "/centerAdDashboard";
        break;
      case Role.teacher:
        roleBasesPath = "/teacherHome";
        break;
      case Role.student:
        roleBasesPath = "/studentHome";
        break;
      default:
        break;
    }
    navigate(roleBasesPath, {
      state: { idUser: idUser, idRole: idRole },
    });
  };

  const handleLogin = async () => {
    let data = await postLogin(username, password);
    if (data && data.idUser > Status.inactive) {
      localStorage.setItem("idRole", data.idRole);
      localStorage.setItem("idUser", data.idUser);
      if (data.idCenter !== null) {
        localStorage.setItem("idCenter", data.idCenter);
      }
      let roleBasesPath = "/";
      switch (data.idRole) {
        case Role.platformAdmin:
          roleBasesPath = "/platformAdDashboard";
          break;
        case Role.centerAdmin:
          roleBasesPath = "/centerAdDashboard";
          break;
        case Role.teacher:
          roleBasesPath = "/teacherHome";
          break;
        case Role.student:
          roleBasesPath = "/studentHome";
          break;
        default:
          break;
      }

      navigate(roleBasesPath, {
        state: { idUser: data.idUser, idRole: data.idRole },
      });
    } else {
      setIsFailed(true);
    }
  };

  const handleForgotPassword = async () => {
    // validate email
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setIsValid(false);
      return;
    }

    // submit email
    let data = await postForgotPassword(email)
    console.log(">>> Check register: ", data);
    if (data === 'Internal Server Error.') {
      setIsValid(false);
      return
    } else {
      handleClose()
    }
  }

  const handleLoginGoogle = async () => {
    // await getLoginGoogle()
    // console.log(loginGoogle)
    window.location.href = "http://localhost:5251/api/Authen/login-google"

    // // Set up an event listener for messages from the new window (e.g., the OAuth response)
    // window.addEventListener("message", (event) => {
    //   // Make sure the message is from your own app (check origin)
    //   if (event.origin === "http://localhost:5251/api/Authen/GoogleResponse") {
    //     const { data } = event;

    //     // Handle the response data (e.g., store tokens, update UI)
    //     console.log("Received OAuth response:", data);

    //     // Optionally, close the new window after processing
    //     newWindow.close();
    //   }
    // });
  }

  return (
    <>
      <div className={`login-container ${isVisible ? "slide-in" : ""}`}>
        <div className="sidepart-container">
          <div className="sidepart-header">
            <div className="header">
              <span>Learn IT </span>
              <span>Easily and Effectively!</span>
            </div>
            <div className="image"></div>
            <span className="small-text">Don't have an account yet?</span>
            <div className="but-container">
              <button
                className="register-button"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
        <div className="mainpart-container">
          <div className="holder">
            <div className="mainpart-content">
              <sp className="header-text">Sign in</sp>
            </div>

            <div className="mainpart-content">
              <div className="mb-3">
                <LuUser color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="form-control"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setIsFailed(false);
                  }}
                  tabIndex={1}
                  required
                />
              </div>

              <div className="mb-3 marginbottom-5px">
                <LuLock color="#757575" className="icon-head" />
                <input
                  type={isShowed ? "text" : "password"}
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setIsFailed(false);
                  }}
                  tabIndex={2}
                  required
                />
                {isShowed ? (
                  <LuEye
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowed(!isShowed)}
                  />
                ) : (
                  <LuEyeOff
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowed(!isShowed)}
                  />
                )}
              </div>

              <div className={`mb-3 ${isFailed ? "marginbottom-5px" : ""}`}>
                <span className="forgot-pw" onClick={handleShow}>
                  Forgot your password?
                </span>
              </div>

              {isFailed && (
                <div className="mb-3">
                  <span className="error-noti">
                    Username or Password is incorrect!
                  </span>
                </div>
              )}
            </div>

            <div className="mainpart-content">
              <button
                className="signin-button"
                onClick={() => handleLogin()}
                disabled={isFailed}
              >
                Sign in
              </button>
            </div>
            <div className="mainpart-content">
              <div className="sep">
                <hr />
                <span>Student can sign in with</span>
                <hr />
              </div>
            </div>
            <div className="mainpart-content">
              <div className="sep">
                <RiFacebookFill color="#1E1E1E" />
                <FaGooglePlusG
                  color="#1E1E1E"
                  onClick={() => handleLoginGoogle()}
                />
                <TbBrandGithubFilled color="#1E1E1E" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 justify-margin">
            <LuMail color="#757575" className="icon-head" />
            <input
              type="text"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setIsValid(true);
              }}
              tabIndex={1}
              required
            />
          </div>
          {!isValid && (
            <div className="mb-3 justify-margin">
              <span className="error-noti">Invalid Email!</span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="footer-btn send-btn"
            onClick={() => handleForgotPassword()}
            disabled={!isValid}
          >Send</button>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
