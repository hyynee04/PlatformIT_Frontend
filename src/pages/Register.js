import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  LuBuilding2,
  LuCreditCard,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuPenTool,
  LuUser
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../assets/scss/Register.css";
import {
  postCheckEmail,
  postRegister,
  postSendOTP,
  postVerifyOtp,
} from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [TIN, setTIN] = useState("");
  const [centerName, setCenterName] = useState("");
  const [OTP, setOTP] = useState("");

  const [isShowedP, setIsShowedP] = useState(false);
  const [isShowedCP, setIsShowedCP] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [show, setShow] = useState(false);

  const [error, setError] = useState(0);
  const [coincidedInform, setCoincidedInform] = useState("");

  const [errorVerify, setErrorVerify] = useState("")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setIsVisible(true);
    localStorage.setItem("verifiedEmail", "");
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkInput = () => {
    const isValidEmail = validateEmail(email);
    // Check all inputs are filled
    if (
      fullName === "" ||
      email === "" ||
      username === "" ||
      password === "" ||
      confirmPassword === "" ||
      (isChecked && TIN === "") ||
      (isChecked && centerName === "")
    ) {
      setError(1);
      return;
    }

    // Check email vaild
    if (!isValidEmail) {
      setError(2);
      return;
    }

    if (password.length < 5) {
      setError(3);
      return;
    }

    // Check confirm password
    if (confirmPassword && confirmPassword !== password) {
      setError(4);
      return;
    }

    // Check TIN length
    if (TIN && (TIN.length !== 10 && TIN.length !== 13)) {
      setError(5);
      return;
    }

    setError(0);
    return true;
  }

  const handleSendOTP = async () => {
    const isValid = checkInput()
    if (!isValid) return;

    let checkEmail = await postCheckEmail(email)
    if (checkEmail !== "Email already exists.") {
      await postSendOTP(email);
      handleShow();
      setErrorVerify("OTP has been sent to your email. It will expire in 2 minutes!");
    }
    else {
      setCoincidedInform(checkEmail)
      return
    }

  };

  const handleVerify = async () => {
    let verifyOTP = await postVerifyOtp(email, OTP)
    if (verifyOTP === "OTP verified successfully! You can now proceed with the registration.") {
      localStorage.setItem('verifiedEmail', email);
      handleClose();
      handleRegister();
    }
    else {
      setErrorVerify(verifyOTP)
    }

  }

  const handleRegister = async () => {
    //submit api
    let data = await postRegister(fullName, email, username, password, centerName, TIN);
    if (Number.isInteger(data)) {
      localStorage.removeItem('verifiedEmail');
      navigate("/login");
    } else {
      setCoincidedInform(data)
      return
    }
  }

  const getErrorMessage = (error) => {
    switch (error) {
      case 1:
        return 'Fill all information!';
      case 2:
        return 'Invalid email address!';
      case 3:
        return 'Password must be at least 5 characters!';
      case 4:
        return 'Confirm password is not right!';
      case 5:
        return 'TIN must be 10 or 13 characters!';
      default:
        return '';
    }
  }

  return (
    <>
      <div className={`register-container ${isVisible ? "slide-in" : ""}`}>
        <div className="mainpart-container">
          <div className="holder">
            <div className="mainpart-content">
              <sp className="header-text">Register</sp>
            </div>
            <div className="mainpart-content">

              <div className="mb-3">
                <LuPenTool color="#757575" className="icon-head rotate-icon" />
                <input
                  type="text"
                  placeholder="Name (*)"
                  className="form-control"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <LuMail color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Email (*)"
                  className="form-control"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(0);
                    setCoincidedInform("");
                  }}
                />
              </div>

              <div className="mb-3">
                <LuUser color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Username (*)"
                  className="form-control"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setError(0);
                    setCoincidedInform("");
                  }}
                />
              </div>

              <div className="mb-3">
                <LuLock color="#757575" className="icon-head" />
                <input
                  type={isShowedP ? "text" : "password"}
                  placeholder="Password (*)"
                  className="form-control"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(0);
                  }}
                />
                {isShowedP ? (
                  <LuEye
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowedP(!isShowedP)}
                  />
                ) : (
                  <LuEyeOff
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowedP(!isShowedP)}
                  />
                )}
              </div>

              <div className="mb-3 marginbottom-5px">
                <LuLock color="#757575" className="icon-head" />
                <input
                  type={isShowedCP ? "text" : "password"}
                  placeholder="Confirm password (*)"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError(0);
                  }}
                />
                {isShowedCP ? (
                  <LuEye
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowedCP(!isShowedCP)}
                  />
                ) : (
                  <LuEyeOff
                    color="#757575"
                    className="icon-eye"
                    onClick={() => setIsShowedCP(!isShowedCP)}
                  />
                )}
              </div>

              <div className="mb-3 margintop-1rem">
                <input
                  type="checkbox"
                  className="AC-check"
                  checked={isChecked}
                  onChange={(event) => {
                    setIsChecked(event.target.checked)
                    setCoincidedInform("");
                    setError(0);
                  }}
                />
                Register as Admin Center
              </div>
              {isChecked && (
                <>
                  <div className="mb-3">
                    <LuBuilding2 color="#757575" className="icon-head" />
                    <input
                      type="text"
                      placeholder="Center Name (*)"
                      className="form-control"
                      value={centerName}
                      onChange={(event) => {
                        setCenterName(event.target.value);
                        setError(0);
                      }}
                    />
                  </div>
                  <div className="mb-3 marginbottom-5px">
                    <LuCreditCard color="#757575" className="icon-head" />
                    <input
                      type="number"
                      placeholder="TIN (*)"
                      className="form-control"
                      value={TIN}
                      onChange={(event) => {
                        setTIN(event.target.value);
                        setError(0);
                        setCoincidedInform("");
                      }}
                    />
                  </div>
                </>
              )}

              {error !== 0 && (
                <div className="mb-3">
                  <span className="error-noti">{getErrorMessage(error)}</span>
                </div>
              )}
              {coincidedInform !== "" && (
                <div className="mb-3">
                  <span className="error-noti">{coincidedInform}</span>
                </div>
              )}
            </div>

            <div className="mainpart-content">
              <button
                className="register-button"
                onClick={() => {
                  if (localStorage.getItem('verifiedEmail') === email) {
                    handleRegister();
                    return
                  }
                  handleSendOTP();
                }}
                disabled={!(error === 0 && coincidedInform === "")}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        <div className="sidepart-container">
          <div className="sidepart-header">
            <div className="header">
              <span>Learn IT </span>
              <span>Easily and Effectively!</span>
            </div>
            <div className="image"></div>
            <span className="small-text">Already have an account?</span>
            <div className="but-container">
              <button
                className="signin-button"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 justify-margin">
            <LuMail color="#757575" className="icon-head" />
            <input
              type="number"
              placeholder="OTP"
              className="form-control"
              value={OTP}
              onChange={(event) => {
                setErrorVerify("")
                const inputOTP = event.target.value;
                if (inputOTP.length <= 6) {
                  setOTP(inputOTP);
                }
              }}
              tabIndex={1}
              required
            />
          </div>
          {errorVerify && (
            <div className="mb-3 justify-margin">
              <span className="error-noti">
                {errorVerify}
              </span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="footer-btn send-btn"
            onClick={() => {
              handleVerify()
            }}
            disabled={!(OTP.length === 6 && errorVerify === "")}
          >Verify</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Register;
