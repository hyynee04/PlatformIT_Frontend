import { useState, useEffect } from "react";
import { LuCreditCard, LuEye, LuEyeOff, LuLock, LuMail, LuPenTool, LuUser } from "react-icons/lu";
import './Register.scss';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isShowedP, setIsShowedP] = useState(false);
    const [isShowedCP, setIsShowedCP] = useState(false);
    const [TIN, setTIN] = useState("");

    const [isChecked, setIsChecked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      setIsVisible(true);
    }, []);

    return (
        <div className={`register-container ${isVisible ? 'slide-in' : ''}`}>
            <div className='mainpart-container'>
                <div className="holder">
                    <div className='mainpart-content'>
                        <sp className='header-text'>Register</sp>
                    </div>
                    <div className='mainpart-content'>

                        <div className="mb-3">
                            <LuPenTool color='#757575' className='icon-head rotate-icon' />
                            <input
                                type="text"
                                placeholder="Name"
                                className='form-control'
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <LuMail color='#757575' className='icon-head' />
                            <input
                                type="text"
                                placeholder="Email"
                                className='form-control'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <LuUser color='#757575' className='icon-head' />
                            <input
                                type="text"
                                placeholder="Username"
                                className='form-control'
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <LuLock color='#757575' className='icon-head' />
                            <input
                                type={isShowedP ? "text" : "password"}
                                placeholder="Password"
                                className='form-control'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                            {isShowedP ?
                                <LuEye
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowedP(!isShowedP)}
                                />
                                :
                                <LuEyeOff
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowedP(!isShowedP)}
                                />
                            }
                        </div>

                        <div className="mb-3 marginbottom-5px">
                            <LuLock color='#757575' className='icon-head' />
                            <input
                                type={isShowedCP ? "text" : "password"}
                                placeholder="Confirm password"
                                className='form-control'
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                required
                            />
                            {isShowedCP ?
                                <LuEye
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowedCP(!isShowedCP)}
                                />
                                :
                                <LuEyeOff
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowedCP(!isShowedCP)}
                                />
                            }
                        </div>
                        {confirmPassword && (confirmPassword != password) && (
                            <div className="mb-3">
                                <span className="error-noti">Password not right!</span>
                            </div>
                        )}

                        <div className="mb-3 margintop-1rem">
                            <input
                                type="checkbox"
                                className="AC-check"
                                checked={isChecked}
                                onChange={(event) => setIsChecked(event.target.checked)}
                            />Register as Admin Center
                        </div>
                        {isChecked && (
                            <>
                                <div className="mb-3 marginbottom-5px">
                                    <LuCreditCard color='#757575' className='icon-head' />
                                    <input
                                        type="number"
                                        placeholder="TIN"
                                        className='form-control'
                                        value={TIN}
                                        onChange={(event) => setTIN(event.target.value)}
                                        maxLength={13}
                                        required
                                    />
                                </div>
                                {TIN && (TIN.length > 13) && (
                                    <div className="mb-3">
                                        <span className="error-noti">TIN has 10 or 13 numbers!</span>
                                    </div>
                                )}
                            </>
                            )
                        }
                    </div>
                    <div className="mainpart-content">
                        <button
                            className='register-button'
                        >Register</button>
                    </div>
                </div>
            </div>

            <div className='sidepart-container'>
                <div className='sidepart-header'>
                    <div className='header'>
                        <span>Learn IT </span>
                        <span>Easily and Effectively!</span>
                    </div>
                    <div className='image'></div>
                    <span className='small-text'>Already have an account?</span>
                    <div className='but-container'>
                        <button
                            className='signin-button'
                            onClick={() => navigate('/login')}
                        >Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register