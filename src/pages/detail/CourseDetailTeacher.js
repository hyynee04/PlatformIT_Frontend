import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ImSpinner2 } from "react-icons/im";
import {
    LuCalendar,
    LuCheck,
    LuCheckSquare,
    LuClock,
    LuFileEdit,
    LuMail,
    LuMinus,
    LuPenLine,
    LuPlus,
    LuTrash2,
    LuX
} from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import "../../assets/css/Detail.css";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import default_ava from "../../assets/img/default_ava.png";
import { APIStatus } from "../../constants/constants";
import { getCourseProgress, postAddBoardNotificationForCourse, postAddSection } from "../../services/courseService";


const CourseDetailTeacher = (props) => {
    const { courseInfo, idUser, fetchCourseDetail, notificationBoard, setAddedNotification } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState();

    const [notificationContent, setNotificationContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSection, setNewSection] = useState("");
    const [attendanceList, setAttendanceList] = useState([]);

    const [popupAdd, setPopupAdd] = useState(false);
    const [addSection, setAddSection] = useState(false);

    const [menuIndex, setMenuIndex] = useState(1);
    useEffect(() => {
        const savedMenuIndex = localStorage.getItem("menuIndex");
        if (savedMenuIndex) {
            setMenuIndex(Number(savedMenuIndex)); // Restore the value if it exists
        }
    }, []);

    // Update localStorage whenever menuIndex changes
    useEffect(() => {
        localStorage.setItem("menuIndex", menuIndex);
    }, [menuIndex]);

    const menuItems = [
        { label: "Main content", index: 1 },
        { label: "Notification", index: 2 },
        { label: "Attendance", index: 3 },
    ]

    const [showedSections, setShowedSections] = useState({});
    const [isEdit, setIsEdit] = useState({});

    // Number of lectures
    const numberOfLectures = courseInfo.sectionsWithCourses
        ? courseInfo.sectionsWithCourses.reduce((total, section) => {
            return total + (section.lectures ? section.lectures.length : 0);
        }, 0)
        : 0;

    const addNotificationBoard = async (idCourse, content, idCreatedBy) => {
        if (!content) {
            setErrorMessage("Something is missing...!");
            return;
        }
        setLoading(true);
        try {
            let response = await postAddBoardNotificationForCourse(idCourse, content, idCreatedBy);
            if (response.status === APIStatus.success) {
                setPopupAdd(false);
                setAddedNotification(true);
            } else {
                setErrorMessage(response.data);
            }
        } catch (error) {
            console.error("Error posting data:", error);
        } finally {
            setLoading(true)
        }
    }

    const addNewSection = async (sectionTitle) => {
        try {
            let response = await postAddSection(sectionTitle, courseInfo.idCourse, idUser)
            if (response.status === APIStatus.success) {
                fetchCourseDetail(courseInfo.idCourse);
            }
            else console.log(response.data);
        } catch (error) {
            console.error("Error posting data:", error);
        }
    }

    const fetchCourseProgress = async (idCourse) => {
        setLoading(true)
        try {
            let response = await getCourseProgress(idCourse);
            if (response.status === APIStatus.success) {
                setAttendanceList(response.data);
            } else {
                console.log(response.data)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchCourseProgress(courseInfo.idCourse);
    }, [])

    return (
        <>
            <div className="teacher-menu">
                {menuItems.map(({ label, index }) => (
                    <button
                        key={index}
                        className={`teacher-menu-btn ${menuIndex === index ? "active" : ""}`}
                        onClick={() => {
                            setMenuIndex(index);
                            localStorage.setItem("menuIndex", index)
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Teacher View: Main Content */}
            {menuIndex === 1 ? (
                <>
                    <div className="block-container">

                        <div className="block-container-header">
                            <span className="block-container-title">Course Content</span>
                            <span className="block-container-sub-title">
                                {courseInfo.sectionsWithCourses
                                    ? `${courseInfo.sectionsWithCourses.length} ${courseInfo.sectionsWithCourses.length === 1
                                        ? "section"
                                        : "sections"
                                    }`
                                    : "0 section"}{" "}
                                -{" "}
                                {`${numberOfLectures} ${numberOfLectures >= 1 ? "lecture" : "lectures"
                                    }`}
                            </span>
                        </div>
                        {courseInfo.sectionsWithCourses && courseInfo.sectionsWithCourses.length > 0 && (
                            <div className="block-container-col">
                                {courseInfo.sectionsWithCourses.map((section, index) => (
                                    <div key={index} className="lecture">
                                        <div
                                            className={`lecture-header ${showedSections[index] ? "" : "change-border-radius"
                                                } `}
                                        >
                                            {!isEdit[index] ? (
                                                <>
                                                    <span className="section-name">
                                                        <button
                                                            onClick={() => setIsEdit({ ...isEdit, [index]: !isEdit[index] })}
                                                        ><LuPenLine /></button>
                                                        {section.sectionName}
                                                    </span>
                                                    <div className="section-info">
                                                        <span>
                                                            {section.lectures
                                                                ? `${section.lectures.length} ${section.lectures.length > 1
                                                                    ? "lectures"
                                                                    : "lecture"
                                                                }`
                                                                : "0 lecture"}
                                                        </span>
                                                        <button
                                                            className="showhide-button"
                                                            onClick={() => setShowedSections({ ...showedSections, [index]: !showedSections[index] })}
                                                        >
                                                            {showedSections[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="edit-section-container">
                                                    <input
                                                        className="edit-section"
                                                        value={newSectionTitle}
                                                        type="text"
                                                        placeholder={section.sectionName}
                                                        onChange={(e) => setNewSectionTitle(e.target.value)}
                                                    />
                                                    <div className="edit-button-container">
                                                        <button><LuCheck /></button>
                                                        <button
                                                            onClick={() => {
                                                                setNewSectionTitle("");
                                                                setIsEdit({ ...isEdit, [index]: !isEdit[index] })
                                                            }}
                                                        ><LuX /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {section.lectures && (
                                            <div
                                                key={index}
                                                className={`lecture-block ${showedSections[index] ? "" : "adjust-lecture-block"
                                                    }`}
                                            >
                                                {section.lectures.map((lecture, index) => (
                                                    <div
                                                        key={index}
                                                        className="lecture-content"
                                                    >
                                                        <div className="lecture-name">
                                                            <span className="lecture-title">
                                                                {lecture.lectureTitle}
                                                            </span>
                                                            <span className="lecture-exercise-num">
                                                                {`${lecture.exerciseCount} ${lecture.exerciseCount > 1
                                                                    ? "exercises"
                                                                    : "exercise"
                                                                    }`}
                                                            </span>
                                                        </div>
                                                        <span className="lecture-description">
                                                            {lecture.lectureIntroduction}
                                                        </span>
                                                    </div>
                                                ))}

                                                <div
                                                    className={`lecture-content nohover`}
                                                >
                                                    <div className="option-container">
                                                        <button
                                                            className="add-lecture"
                                                            onClick={() =>
                                                                navigate("/addNewLecture", {
                                                                    state: {
                                                                        idCourse: courseInfo.idCourse,
                                                                        idSection: section.idSection,
                                                                        idCreatedBy: idUser,
                                                                        courseTitle: courseInfo.courseTitle,
                                                                        sectionName: section.sectionName
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <span className="icon"><LuPlus /></span>
                                                            <span className="text">Add new lecture</span>
                                                        </button>
                                                        <button className="remove-section">
                                                            <span className="icon"><LuTrash2 /></span>
                                                            <span className="text">Remove this section</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {addSection ?
                            (
                                <div>
                                    <div className="add-section-container change-border-radius">
                                        <div className="edit-section-container">
                                            <input
                                                className="edit-section"
                                                value={newSection}
                                                type="text"
                                                placeholder="Section Name"
                                                onChange={(e) => setNewSection(e.target.value)}
                                            />
                                            <div className="edit-button-container">
                                                <button
                                                    disabled={!newSection}
                                                    onClick={() => addNewSection(newSection)}
                                                ><LuCheck /></button>
                                                <button
                                                    onClick={() => {
                                                        setNewSectionTitle("");
                                                        setAddSection(!addSection);
                                                    }}
                                                ><LuX /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                            :
                            (
                                <button
                                    className="add-section-btn"
                                    onClick={() => setAddSection(!addSection)}
                                >
                                    <LuPlus /> Add new section
                                </button>
                            )
                        }
                    </div>

                    <div className="block-container">
                        <span className="block-container-title">Test</span>
                        <div className="block-container-col">
                            <div className="qualification test">
                                <div className="qualification-body">
                                    <div className="test-header">
                                        <span className="test-name teacher-view">Title</span>
                                    </div>

                                    <div className="test-description">
                                        <span>
                                            <LuFileEdit /> Manual
                                        </span>
                                        <span>
                                            <LuClock /> 45 mins
                                        </span>
                                        <span>
                                            <LuCheckSquare /> 40 marks
                                        </span>
                                        <span>
                                            <LuCalendar />
                                            Due date: 11/20/2025
                                        </span>
                                    </div>
                                </div>

                                <div className="test-status">
                                    <span>4/15 <RiGroupLine /></span>
                                    <div className="test-status-text">Unpublish</div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="add-section-btn"
                            onClick={() => {
                                navigate("/addAssignment", {
                                    state: {
                                        selectedCourse: courseInfo,
                                    },
                                });
                            }}
                        >
                            <LuPlus /> Add new test
                        </button>
                    </div>
                </>
            ) : null}

            {/* Teacher View: Notification Board*/}
            {menuIndex === 2 ? (
                <div className="block-container">
                    <span className="block-container-title">Notification Board</span>
                    {notificationBoard && notificationBoard.length > 0 && (
                        <div className="block-container-col noti-size">
                            {notificationBoard.map((notification, index) => (
                                <div
                                    key={index}
                                    className="notification">
                                    <div className="delete-button">
                                        <button>
                                            <LuMinus />
                                        </button>
                                    </div>
                                    <div className="notification-body">
                                        <span className="notification-content">
                                            {notification.content}
                                        </span>
                                        <span className="noti-time">{notification.relativeTime}</span>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                    <button
                        className="add-notification-button"
                        onClick={() => setPopupAdd(!popupAdd)}
                    >
                        <LuPlus />
                    </button>
                    <div
                        className={`add-notification-popup ${popupAdd ? "active" : ""}`}
                    >
                        <span className="popup-title">Add new notification</span>
                        <textarea
                            value={notificationContent}
                            placeholder="Write your notification content here..."
                            onChange={(e) => {
                                setErrorMessage("");
                                setNotificationContent(e.target.value);
                            }}
                        ></textarea>
                        {errorMessage && (
                            <span className="add-noti-error">{errorMessage}</span>
                        )}
                        <div className="post-button-container">
                            <button
                                className="post-notification-button cancel"
                                onClick={() => {
                                    setPopupAdd(!popupAdd);
                                    setNotificationContent("");
                                    setErrorMessage("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="post-notification-button post"
                                onClick={() => {
                                    addNotificationBoard(courseInfo.idCourse, notificationContent, idUser);
                                    fetchCourseDetail(courseInfo.idCourse);
                                }}
                            >
                                {loading && (<ImSpinner2 className="icon-spin" />)} Post
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Teacher View: Attendance */}
            {menuIndex === 3 ? (
                <div className="block-container course-teacher-attendance">
                    {attendanceList.courseStudentProgress && attendanceList.courseStudentProgress.length > 0
                        && attendanceList.courseStudentProgress.map((attendance, index) => (
                            <div key={index} className="attendance-progress-container">
                                <div className="attendance-progress-content">
                                    <div className="attendance-ava">
                                        <img src={attendance.avatarPath || default_ava} />
                                    </div>
                                    <div className="attendance-progress-body">
                                        <span className="attendance-name">{attendance.fullName}</span>
                                        <span className="attendance-mail">
                                            <LuMail color="#003B57" /> {attendance.email}
                                        </span>
                                        <div className="attendance-progress">
                                            <label>Lectures</label>
                                            <div className="progress-line">
                                                <div
                                                    className="progress-line-inner"
                                                    style={{
                                                        width: `${attendanceList.lectureCount > 0
                                                            ? (attendance.finishedLectureCount / attendanceList.lectureCount) * 100
                                                            : 0
                                                            }%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="proportion-number">
                                                {attendance.finishedLectureCount}/{attendanceList.lectureCount}
                                            </span>
                                        </div>
                                        <div className="attendance-progress">
                                            <label>Assignments</label>
                                            <div className="progress-line">
                                                <div
                                                    className="progress-line-inner"
                                                    style={{
                                                        width: `${attendanceList.assignmentCount > 0
                                                            ? (attendance.finishedAssignmentCount / attendanceList.assignmentCount) * 100
                                                            : 0
                                                            }%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="proportion-number">
                                                {attendance.finishedAssignmentCount}/{attendanceList.assignmentCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            ) : null}
        </>
    )


}

export default CourseDetailTeacher;