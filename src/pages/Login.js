import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCookies } from "react-cookie";
import { FaGooglePlusG } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuUser } from "react-icons/lu";
import { RiFacebookFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../services/authService";
import { Role, Status } from "../constants/constants";
import "../assets/scss/Login.scss";

const Login = () => {
  const navigate = useNavigate();

  //const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowed, setIsShowed] = useState(false);

  const [isFailed, setIsFailed] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [cookies, setCookie, removeCookie] = useCookies(["user"]); //khai báo hook useCookies
  const handleLogin = async () => {
    // submit login
    let data = await postLogin(username, password);
    console.log(">>> Check register: ", data);
    if (data && data.idUser > Status.inactive) {
      setCookie("idRole", data.idRole, { path: "/" });
      setCookie("idUser", data.idUser, { path: "/" });
      let roleBasesPath = "/";
      switch (data.idRole) {
        case Role.platformAdmin: {
          roleBasesPath = "/platformAdminDashboard";
          break;
        }
        case Role.centerAdmin: {
          roleBasesPath = "/centerAdminDashboard";
          break;
        }
        case Role.teacher: {
          roleBasesPath = "/teacherHome";
          break;
        }
        case Role.student: {
          roleBasesPath = "/studentHome";
          break;
        }
        default: {
          break;
        }
      }

      navigate(roleBasesPath, {
        state: { idUser: data.idUser, idRole: data.idRole },
      });
    } else {
      setIsFailed(true);
    }
  };

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
                <FaGooglePlusG color="#1E1E1E" />
                <TbBrandGithubFilled color="#1E1E1E" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
