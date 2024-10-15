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
  const [OTP, setOTP] = useState("")

  const [isShowedP, setIsShowedP] = useState(false);
  const [isShowedCP, setIsShowedCP] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [coincidedInform, setCoincidedInform] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isValidTIN, setIsValidTIN] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [isSent, setIsSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false);
  const [checkVerify, setCheckVerify] = useState("")


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    setIsVisible(true);
    localStorage.setItem('verifiedEmail', "");
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendOTP = async () => {
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
      setIsError(true);
      return;
    }

    // Check email vaild
    if (!isValidEmail) {
      setIsValid(false);
      return;
    }

    // Check confirm password
    if (confirmPassword && confirmPassword !== password) {
      setIsConfirmed(false);
      return;
    }

    // Check TIN length
    if (TIN && (TIN.length !== 10 && TIN.length !== 13)) {
      setIsValidTIN(false)
      return;
    }

    if (localStorage.getItem('verifiedEmail') !== email) {
      let checkEmail = await postCheckEmail(email)
      if (checkEmail !== "Email already exists.") {
        await postSendOTP(email);
        handleShow();
        setIsSent(true);
      }
      else {
        setCoincidedInform(checkEmail)
        return
      }
    }
  };

  const handleVerify = async () => {
    let verifyOTP = await postVerifyOtp(email, OTP)
    if (verifyOTP === "OTP verified successfully! You can now proceed with the registration.") {
      localStorage.setItem('verifiedEmail', email);
      setIsSent(false);
      setIsVerified(true)
      handleClose()
    }
    else {
      setCheckVerify(verifyOTP)
    }
    
  }

  const handleRegister = async () => {
    console.log(">>>", isVerified, localStorage.getItem('verifiedEmail') === email)
    //submit api
    let data = await postRegister(fullName, email, username, password, centerName, TIN);
    // console.log(">>> Check register: ", data);
    if (Number.isInteger(data)) {
      localStorage.removeItem('verifiedEmail');
      navigate("/login");
    } else {
      setCoincidedInform(data)
      return
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
                  placeholder="Name"
                  className="form-control"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setIsError(false);
                  }}
                />
              </div>

              <div className={`mb-3 ${!isValid ? "marginbottom-5px" : ""}`}>
                <LuMail color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Email"
                  className="form-control"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsError(false);
                    setIsValid(true);
                    setCoincidedInform("");
                  }}
                />
              </div>
              {!isValid && (
                <div className="mb-3">
                  <span className="error-noti">Invalid Email!</span>
                </div>
              )}

              <div className="mb-3">
                <LuUser color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Username"
                  className="form-control"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setIsError(false);
                    setCoincidedInform("");
                  }}
                />
              </div>

              <div className="mb-3">
                <LuLock color="#757575" className="icon-head" />
                <input
                  type={isShowedP ? "text" : "password"}
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setIsError(false);
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
                  placeholder="Confirm password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setIsError(false);
                    setIsConfirmed(true);
                  }}
                  required
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
              {!isConfirmed && (
                <div className="mb-3">
                  <span className="error-noti">
                    Confirm password is not right!
                  </span>
                </div>
              )}

              <div className="mb-3 margintop-1rem">
                <input
                  type="checkbox"
                  className="AC-check"
                  checked={isChecked}
                  onChange={(event) => {
                    setCoincidedInform("");
                    setIsChecked(event.target.checked)
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
                      placeholder="Center Name"
                      className="form-control"
                      value={centerName}
                      onChange={(event) => {
                        setCenterName(event.target.value);
                        setIsError(false);
                        setCoincidedInform("");
                      }}
                    />
                  </div>
                  <div className="mb-3 marginbottom-5px">
                    <LuCreditCard color="#757575" className="icon-head" />
                    <input
                      type="number"
                      placeholder="TIN"
                      className="form-control"
                      value={TIN}
                      onChange={(event) => {
                        setTIN(event.target.value);
                        setIsError(false);
                        setCoincidedInform("");
                        setIsValidTIN(true);
                      }}
                    />
                  </div>
                  {!isValidTIN && (
                    <div className="mb-3">
                      <span className="error-noti">
                        TIN has 10 or 13 numbers!
                      </span>
                    </div>
                  )}

                </>
              )}
              {isError && (
                <div className="mb-3">
                  <span className="error-noti">Fill all information!</span>
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
                  if(isVerified && localStorage.getItem('verifiedEmail') === email) {
                    handleRegister();
                    setIsVerified(false);
                    return
                  }
                  handleSendOTP();
                }}
                disabled={!(!isError && isValid && isConfirmed && isValidTIN && coincidedInform === "")}
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
                const inputOTP = event.target.value;
                if (inputOTP.length <= 6) {
                  setOTP(inputOTP);
                }
              }}
              tabIndex={1}
              required
            />
          </div>
          {isSent && (
            <div className="mb-3 justify-margin">
              <span className="error-noti">
                {checkVerify === "" ? 'OTP has been sent to your email. It will expire in 2 minutes!' : checkVerify}
              </span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="footer-btn send-btn"
            onClick={() => {
              if(isSent) handleVerify()
            }}
            disabled={OTP.length < 6}
          >Verify</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Register;
