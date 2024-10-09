import { useEffect, useState } from "react";
import {
  LuCreditCard,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuPenTool,
  LuUser,
  LuBuilding2
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../assets/scss/Register.css";
import { postRegister } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [TIN, setTIN] = useState("");
  const [centerName, setCenterName] = useState("");

  const [isShowedP, setIsShowedP] = useState(false);
  const [isShowedCP, setIsShowedCP] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const [isCoincided, setIsCoincided] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(true);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = async () => {
    const isValidEmail = validateEmail(email);

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

    if (!isValidEmail) {
      setIsValid(false);
      return;
    }

    if (confirmPassword && confirmPassword !== password) {
      setIsConfirmed(false);
      return;
    }

    // if(confirmPassword !== password) {
    //     toast.error("Invalid confirmPassword!")
    //     return
    // }

    //submit api
    let data = await postRegister(fullName, email, username, password, TIN);
    console.log(">>> Check register: ", data);
    if (data > 0) {
      navigate("/login");
    } else {
      alert("failed");
    }
  };

  return (
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
                }}
              />
            </div>
            {!isValid && (
              <div className="mb-3">
                <span className="error-noti">Invalid Email!</span>
              </div>
            )}
            {/* {isCoincided && (
                            <div className="mb-3">
                                <span className="error-noti">Email has already existed!</span>
                            </div>
                        )} */}

            <div className={`mb-3 ${isCoincided ? "marginbottom-5px" : ""}`}>
              <LuUser color="#757575" className="icon-head" />
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setIsError(false);
                }}
              />
            </div>
            {/* {isCoincided && (
                            <div className="mb-3">
                                <span className="error-noti">Username has already existed!</span>
                            </div>
                        )} */}

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
                onChange={(event) => setIsChecked(event.target.checked)}
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
                    }}
                  />
                </div>
                {TIN && TIN.length > 13 && (
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
          </div>
          <div className="mainpart-content">
            <button
              className="register-button"
              onClick={() => handleRegister()}
              disabled={!(!isError && isValid && isConfirmed)}
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
  );
};

export default Register;
