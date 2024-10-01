import { useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuUser } from "react-icons/lu";
import { RiFacebookFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import './Login.scss';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [isShowed, setIsShowed] = useState(false)

    return (
        <div className='login-container'>
            <div className='sidepart-container'>
                <div className='sidepart-header'>
                    <div className='header'>
                        <span>Learn IT </span>
                        <span>Easily and Effectively!</span>
                    </div>
                    <div className='image'></div>
                    <span className='small-text'>Do you have an account yet?</span>
                    <div className='but-container'>
                        <button
                            className='register-button'
                        >Register</button>
                    </div>
                </div>
            </div>
            <div className='mainpart-container'>
                <div className="holder">
                    <div className='mainpart-content'>
                        <sp className='header-text'>Sign in</sp>
                    </div>
                    <div className='mainpart-content'>
                        <div className="mb-3">
                            <LuUser color='#757575' className='icon-head' />
                            <input
                                type="text"
                                placeholder="Username or Email"
                                className='form-control'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="mb-3 remove-marginbottom">
                            <LuLock color='#757575' className='icon-head' />
                            <input
                                type={isShowed ? "text" : "password"}
                                placeholder="Password"
                                className='form-control'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            {isShowed ?
                                <LuEye
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowed(!isShowed)}
                                />
                                :
                                <LuEyeOff
                                    color='#757575'
                                    className='icon-eye'
                                    onClick={() => setIsShowed(!isShowed)}
                                />
                            }
                        </div>
                        <div className="mb-3">
                            <span className="forgot-pw">Forgot your password?</span>
                        </div>
                    </div>
                    <div className="mainpart-content">
                        <button
                            className='signin-button'
                        >Sign in</button>
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
    )
}

export default Login