import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  LuBuilding2,
  LuCreditCard,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
  LuPenLine,
  LuPenTool,
  LuUser,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.css";
import DiagPolicy from "../components/diag/DiagPolicy";
import DiagVerifyOtpForm from "../components/diag/DiagVerifyOtpForm";
import { APIStatus } from "../constants/constants";
import {
  postCheckEmail,
  postRegister,
  postSendOTP,
} from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    TIN: "",
    centerName: "",
    centerDescription: "",
    isChecked: false,
    isCheckedPolicy: false,
  });
  const formDataRef = useRef(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(formDataRef.current);
      if (event.key === "Enter") {
        if (
          localStorage.getItem("verifiedEmail") === formDataRef.current.email
        ) {
          handleRegister(formDataRef.current);
          return;
        }
        handleSendOTP(formDataRef.current);
      }
    };

    // Add the event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [isShowedP, setIsShowedP] = useState(false);
  const [isShowedCP, setIsShowedCP] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const [error, setError] = useState(0);
  const [coincidedInform, setCoincidedInform] = useState("");

  useEffect(() => {
    setIsVisible(true);
    localStorage.setItem("verifiedEmail", "email");
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkInput = (formData) => {
    const isValidEmail = validateEmail(formData.email);
    // Check all inputs are filled
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      (formData.isChecked && !formData.TIN) ||
      (formData.isChecked && !formData.centerName) ||
      (formData.isChecked && !formData.centerDescription)
    ) {
      setError(1);
      return;
    }

    // Check email vaild
    if (!isValidEmail) {
      setError(2);
      return;
    }

    if (formData.password.length < 5) {
      setError(3);
      return;
    }

    // Check confirm password
    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      setError(4);
      return;
    }

    // Check TIN length
    if (
      formData.TIN &&
      formData.TIN.length !== 10 &&
      formData.TIN.length !== 13
    ) {
      setError(5);
      return;
    }

    //Agree with policy
    if (formData.isChecked && !formData.isCheckedPolicy) {
      setError(6);
      return;
    }

    setError(0);
    return true;
  };

  const handleSendOTP = async (formData) => {
    const isValid = checkInput(formData);
    if (!isValid) return;
    setLoading(true);
    try {
      let response = await postCheckEmail(formData.email);
      let checkEmail = response.data;
      if (response.status === APIStatus.success) {
        await postSendOTP(formData.email);
        setShowVerifyEmail(true);
      } else {
        setCoincidedInform(checkEmail);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    let response;
    try {
      if (formData.isChecked) {
        response = await postRegister(
          formData.fullName,
          formData.email,
          formData.username,
          formData.password,
          formData.centerName,
          formData.centerDescription,
          formData.TIN
        );
      } else {
        response = await postRegister(
          formData.fullName,
          formData.email,
          formData.username,
          formData.password,
          "",
          "",
          ""
        );
      }

      let data = response.data;
      if (response.status === APIStatus.success) {
        localStorage.removeItem("verifiedEmail");
        navigate("/login");
      } else {
        setCoincidedInform(data);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case 1:
        return "Fill all information!";
      case 2:
        return "Invalid email address!";
      case 3:
        return "Password must be at least 5 characters!";
      case 4:
        return "Confirm password is not right!";
      case 5:
        return "TIN must be 10 or 13 characters!";
      case 6:
        return "Agree with our policy to register!";
      default:
        return "";
    }
  };

  return (
    <>
      <div className={`register-container ${isVisible ? "slide-to-left" : ""}`}>
        <div className="mainpart-container">
          <div className="holder">
            <div className="mainpart-content">
              <sp className="header-text">Register</sp>
            </div>
            <div className="mainpart-content">
              <div className="mb-3 ">
                <LuPenTool color="#757575" className="icon-head rotate-icon" />
                <input
                  type="text"
                  placeholder="Name (*)"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(event) => {
                    setError(0);
                    setFormData({ ...formData, fullName: event.target.value });
                  }}
                />
              </div>

              <div className="mb-3">
                <LuMail color="#757575" className="icon-head" />
                <input
                  type="text"
                  placeholder="Email (*)"
                  className="form-control"
                  value={formData.email}
                  onChange={(event) => {
                    setFormData({ ...formData, email: event.target.value });
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
                  value={formData.username}
                  onChange={(event) => {
                    setFormData({ ...formData, username: event.target.value });
                    setError(0);
                    setCoincidedInform("");
                  }}
                />
              </div>
              <div className="password-container">
                <div className="mb-3 marginbottom-5px">
                  <LuLock color="#757575" className="icon-head" />
                  <input
                    type={isShowedP ? "text" : "password"}
                    placeholder="Password (*)"
                    className="form-control"
                    value={formData.password}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        password: event.target.value,
                      });
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
                    value={formData.confirmPassword}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        confirmPassword: event.target.value,
                      });
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
              </div>

              <div className="mb-3 margintop-1rem">
                <input
                  type="checkbox"
                  className="AC-check"
                  checked={formData.isChecked}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      isChecked: event.target.checked,
                    });
                    setCoincidedInform("");
                    setError(0);
                  }}
                />
                Register as Admin Center
              </div>
              {formData.isChecked && (
                <>
                  <div className="mb-3">
                    <LuBuilding2 color="#757575" className="icon-head" />
                    <input
                      type="text"
                      placeholder="Center Name (*)"
                      className="form-control"
                      value={formData.centerName}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          centerName: event.target.value,
                        });
                        setError(0);
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <LuCreditCard color="#757575" className="icon-head" />
                    <input
                      type="number"
                      placeholder="TIN (*)"
                      className="form-control"
                      value={formData.TIN}
                      onChange={(event) => {
                        setFormData({ ...formData, TIN: event.target.value });
                        setError(0);
                        setCoincidedInform("");
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <LuPenLine color="#757575" className="icon-head penline" />
                    <textarea
                      type="number"
                      placeholder="Introduce your center (*)"
                      className="introduce-center form-control"
                      value={formData.centerDescription}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          centerDescription: event.target.value,
                        });
                        setError(0);
                        setCoincidedInform("");
                      }}
                    />
                  </div>
                  <div className="mb-3 margintop-1rem  marginbottom-5px">
                    <input
                      type="checkbox"
                      className="AC-check"
                      checked={formData.isCheckedPolicy}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          isCheckedPolicy: event.target.checked,
                        });
                        setCoincidedInform("");
                        setError(0);
                      }}
                    />
                    I agree with&nbsp;
                    <b
                      className="style-text"
                      onClick={() => setShowPolicy(true)}
                    >
                      Plait Policy
                    </b>
                  </div>
                </>
              )}

              {error !== 0 && (
                <div className="mb-3 marginbottom-5px">
                  <span className="error-noti">{getErrorMessage(error)}</span>
                </div>
              )}
              {coincidedInform !== "" && (
                <div className="mb-3 marginbottom-5px">
                  <span className="error-noti">{coincidedInform}</span>
                </div>
              )}
            </div>

            <div className="mainpart-content">
              <button
                className="register-button"
                onClick={() => {
                  if (
                    localStorage.getItem("verifiedEmail") === formData.email
                  ) {
                    handleRegister(formData);
                    return;
                  }
                  handleSendOTP(formData);
                }}
                disabled={!(error === 0 && coincidedInform === "")}
              >
                {loading && <ImSpinner2 className="icon-spin" />}
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

      {/* Policy Popup */}
      <DiagPolicy
        isOpen={showPolicy}
        onClose={() => setShowPolicy(false)}
        formData={formData}
        setFormData={setFormData}
      />

      <DiagVerifyOtpForm
        isOpen={showVerifyEmail}
        onClose={() => setShowVerifyEmail(false)}
        handleRegister={handleRegister}
        formData={formData}
      />

      {/* <Modal show={showVerifyEmail} onHide={() => setShowVerifyEmail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 change-mb3 justify-margin">
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
            <div className="mb-3 change-mb3 justify-margin">
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
      </Modal> */}
    </>
  );
};

export default Register;
