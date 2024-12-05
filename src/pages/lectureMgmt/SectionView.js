import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuCheckCircle, LuPlus } from "react-icons/lu";
import "../../assets/css/LectureView.css";
import { Role } from "../../constants/constants";
const SectionView = (props) => {
    const [isShowed, setIsShowed] = useState(false)
    const idRole = localStorage.getItem("idRole")
    return (
        <div className="section-view-container slide-to-bottom">
            <div className="section-header">
                <span className="header-title">Course Content</span>
                <span className="header-info">4 sections - 10 lectures</span>
            </div>
            <div className="section-display">
                <div className="each-section">
                    <div className={`each-section-header ${isShowed ? "active" : ""}`}>
                        <span className="each-section-name">Section 1</span>
                        <div className="each-section-info">
                            <span className="lecture-number">13 lectures</span>
                            <button
                                onClick={() => setIsShowed(!isShowed)}
                                className="dropdown-button"
                            >
                                {isShowed ? (<IoIosArrowUp />) : (<IoIosArrowDown />)}
                            </button>
                        </div>
                    </div>
                    <div className={`section-lectures ${isShowed ? "" : "deactive"}`}>
                        <div className="lecture-item">
                            <div className="lecture-info">
                                <span className="lecture-title">Lecture 1</span>
                                <span className="exercise-num">0 exercise</span>
                            </div>
                            <LuCheckCircle />
                        </div>
                        <div className="lecture-item">
                            <div className="lecture-info">
                                <span className="lecture-title active">Lecture 2</span>
                                <span className="exercise-num">1 exercise</span>
                            </div>
                        </div>
                        {idRole && idRole === Role.teacher && (
                            <div className="lecture-item contain-button">
                                <button><LuPlus /> Add new lecture</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="each-section">
                    <div className="each-section-header">
                        <span className="each-section-name">Section 2</span>
                        <div className="each-section-info">
                            <span className="lecture-number">2 lectures</span>
                            <button className="dropdown-button"><IoIosArrowDown /></button>
                        </div>
                    </div>
                </div>
                {idRole && idRole === Role.teacher && (
                    <div className="add-section">
                        <button><LuPlus /> Add new section</button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SectionView;