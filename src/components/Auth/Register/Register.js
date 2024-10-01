import { useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { LuEye, LuEyeOff, LuLock, LuUser, LuPenTool } from "react-icons/lu";
import { RiFacebookFill } from "react-icons/ri";
import { TbBrandGithubFilled } from "react-icons/tb";
import './Register.scss';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isShowedP, setIsShowedP] = useState(false)
    const [isShowedCP, setIsShowedCP] = useState(false)

    return (
        <div className='register-container'>
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
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <LuUser color='#757575' className='icon-head' />
                            <input
                                type="text"
                                placeholder="Email"
                                className='form-control'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <LuUser color='#757575' className='icon-head' />
                            <input
                                type="text"
                                placeholder="Username"
                                className='form-control'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
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
                        <div className="mb-3">
                            <LuLock color='#757575' className='icon-head' />
                            <input
                                type={isShowedCP ? "text" : "password"}
                                placeholder="Confirm password"
                                className='form-control'
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
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
                        <div className="mb-3">
                            <input type="checkbox"/>
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

            {/* <div className='sidepart-container'>
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
            </div> */}
        </div>
    )
}

export default Register