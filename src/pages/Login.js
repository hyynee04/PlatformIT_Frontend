import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";

import { FaGooglePlusG } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuMail, LuUser } from "react-icons/lu";
import { TbBrandGithubFilled } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Login.css";
import DiagLoginMessageForm from "../components/diag/DiagLoginMessageForm";
import { APIStatus, Role, UserStatus } from "../constants/constants";
import { postLogin } from "../services/authService";
import { postForgotPassword } from "../services/userService";
import { ImSpinner2 } from "react-icons/im";
import DiagForgotPassword from "../components/diag/DiagForgotPassword";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowed, setIsShowed] = useState(false);

  const [isFailed, setIsFailed] = useState(false);
  const [errorStr, setErrorString] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const closeLoginNotification = () => {
    setShowAlert(false);
    navigate("/login");
  };

  const [message, setMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setIsVisible(true);
    //setShowAlert(false);
    const state = location.state;
    // Automatically log in the user if idUser and idRole are available
    if (state && state.idUser && state.idRole) {
      handleAutoLogin(state.idUser, state.idRole);
    }
    // Alert the message if it exists
    else if (state && state.message) {
      // alert(state.message);
      setMessage(state.message);
      setShowAlert(true);
    }
  }, [location.state]);

  const handleAutoLogin = async (idUser, idRole) => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Login failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      let response = await postLogin(username, password);
      let data = response.data;
      if (data && data.idUser) {
        if (data.status === UserStatus.active) {
          localStorage.setItem("idRole", data.idRole);
          localStorage.setItem("idUser", data.idUser);
          localStorage.setItem("idAccount", data.idAccount);
          let roleBasesPath = "/";
          switch (data.idRole) {
            case Role.platformAdmin:
              roleBasesPath = "/platformAdDashboard";
              break;
            case Role.centerAdmin:
              localStorage.setItem("idCenter", data.idCenter);
              roleBasesPath = "/centerAdDashboard";
              break;
            case Role.teacher:
              localStorage.setItem("idCenter", data.idCenter);
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
        } else if (
          data.status === UserStatus.pending &&
          data.idRole === Role.centerAdmin
        ) {
          localStorage.setItem("idUser", data.idUser);
          localStorage.setItem("idRole", data.idRole);
          localStorage.setItem("isPendingCenter", data.status);
          navigate("/pendingCenter");
        } else if (data.status === UserStatus.inactive) {
          setErrorString("Your account had been inactive.");
          setIsFailed(true);
        }
      } else {
        setErrorString("Username or Password is incorrect!");
        setIsFailed(true);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginThirdParty = async (base) => {
    if (base === "Google")
      window.location.href =
        "https://myidvndut.id.vn:5000/api/Authen/login-google";
    else
      window.location.href =
        "https://myidvndut.id.vn:5000/api/Authen/login-github";
  };

  const usernameRef = useRef(username);
  const passwordRef = useRef(password);

  useEffect(() => {
    usernameRef.current = username;
    passwordRef.current = password;
  }, [username, password]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleLogin(usernameRef.current, passwordRef.current); // Access refs instead of state
      }
    };

    // Add the event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={`login-container ${isVisible ? "slide-to-left" : ""}`}>
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
                  placeholder="Username"
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
                <span className="forgot-pw" onClick={() => handleShow()}>
                  Forgot your password?
                </span>
              </div>

              {isFailed && (
                <div className="mb-3">
                  <span className="error-noti">{errorStr}</span>
                </div>
              )}
            </div>

            <div className="mainpart-content">
              <button
                className="signin-button"
                onClick={() => handleLogin(username, password)}
                disabled={isFailed}
              >
                {loading && <ImSpinner2 className="icon-spin" />} Sign in
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
                <FaGooglePlusG
                  color="#1E1E1E"
                  onClick={() => handleLoginThirdParty("Google")}
                />
                <TbBrandGithubFilled
                  color="#1E1E1E"
                  onClick={() => handleLoginThirdParty("Github")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAlert && (
        <DiagLoginMessageForm
          isOpen={showAlert}
          onClose={closeLoginNotification}
          message={message}
        />
      )}

      <DiagForgotPassword isOpen={show} onClose={() => setShow(false)} />
    </>
  );
};

export default Login;
