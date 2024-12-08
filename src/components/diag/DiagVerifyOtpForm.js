import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { LuMail, LuX } from "react-icons/lu";
import { APIStatus } from "../../constants/constants";
import { postVerifyOtp } from "../../services/authService";

const DiagVerifyOtpForm = (props) => {
    const { isOpen, onClose, handleRegister, formData } = props;

    const [loading, setLoading] = useState(false);
    const [countDownTime, setCountDownTime] = useState({ minutes: 2, seconds: 0 })
    const [OTP, setOTP] = useState("");
    const [verifyMessage, setVerifyMessage] = useState("OTP has been sent to your email.");

    const handleVerify = async (email, OTP) => {
        if (!OTP) {
            setVerifyMessage("Missing OTP!");
            return;
        }
        setLoading(true);
        try {
            let response = await postVerifyOtp(email, OTP);
            if (response.status === APIStatus.success) {
                localStorage.setItem('verifiedEmail', email);
                onClose();
                handleRegister(formData);
            }
            else {
                setVerifyMessage("OTP is invalid! Please try again.");
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error posting data: ", error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let timerId;
        let closeTimeout;

        if (isOpen) {
            timerId = setInterval(() => {
                setCountDownTime((prevTime) => {
                    const { minutes, seconds } = prevTime;
                    if (minutes === 0 && seconds === 0) {
                        setVerifyMessage("OTP expired!")
                        clearInterval(timerId); // Stop the timer
                        closeTimeout = setTimeout(() => {
                            onClose(); // Trigger onClose after 5 seconds
                        }, 5000); // Wait for 5 seconds
                        return prevTime;
                    }
                    if (seconds > 0) {
                        return { ...prevTime, seconds: seconds - 1 };
                    }
                    if (minutes > 0) {
                        return { minutes: minutes - 1, seconds: 59 };
                    }
                    return prevTime;
                });
            }, 1000);
        }

        return () => clearInterval(timerId); // Cleanup
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setCountDownTime({ minutes: 2, seconds: 0 }); // Reset countdown when closed
        }
    }, [isOpen]);

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    if (!isOpen) return null
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container slide-to-bottom" onClick={(e) => e.stopPropagation()}>
                <div className="diag-header">
                    <div className="container-title">
                        <LuMail className="diag-icon" />
                        <span className="diag-title">Verify OTP</span>
                    </div>
                    <button>
                        <LuX className="diag-icon" onClick={onClose} />
                    </button>
                </div>
                <div className="diag-body">
                    <div className="verify-otp-container">
                        <input
                            type="number"
                            placeholder="Enter OTP here..."
                            value={OTP}
                            onChange={(event) => {
                                setVerifyMessage("")
                                const inputOTP = event.target.value;
                                if (inputOTP.length <= 6) {
                                    setOTP(inputOTP);
                                }
                            }}
                        />
                    </div>
                    <div className="error-message-container">
                        <span className="error-noti">{verifyMessage} &nbsp;</span>
                        <span>Time remaining {formatTime(countDownTime.minutes)}:{formatTime(countDownTime.seconds)}</span>
                    </div>
                    <div className="str-btns">
                        <div className="act-btns">
                            <button
                                className="btn diag-btn signout"
                                onClick={() => {
                                    handleVerify(formData.email, OTP)
                                }}
                                disabled={!(OTP.length === 6)}
                            >
                                {loading && (
                                    <ImSpinner2 className="icon-spin" />
                                )}
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiagVerifyOtpForm;