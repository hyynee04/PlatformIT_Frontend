import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
    LuCheckSquare,
    LuClock,
    LuFileEdit,
    LuFileQuestion
} from "react-icons/lu";
import "../../assets/css/LectureView.css";
import default_ava from "../../assets/img/default_ava.png";
import { AssignmentType } from "../../constants/constants";
import { formatDateTime, getVideoType, isPastDateTime } from "../../functions/function";

const LectureView = ({ lectureDetail }) => {
    const [index, setIndex] = useState(1);
    console.log(lectureDetail);
    const menuItems = [
        { label: "Introduction", index: 1 },
        { label: "Support Materials", index: 2 },
        { label: "Exercise", index: 3 },
        { label: "Comment", index: 4 }
    ];

    const [value, setValue] = useState("");
    const [textAreaHeight, setTextAreaHeight] = useState(30)
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLongContent, setIsLongContent] = useState(false);

    const textareaRef = useRef(null);
    const contentRef = useRef(null);

    const toggleComment = () => {
        setIsExpanded(!isExpanded);
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const lineHeight = 25;
            const minHeight = 30;
            const maxHeight = 150;
            // Calculate the number of lines and the desired new height
            const lines = textarea.value.split("\n").length;
            const newHeight = Math.max(lines * lineHeight, minHeight);
            setTextAreaHeight(newHeight)
            if (newHeight > maxHeight) {
                // If the new height exceeds the maxHeight, restrict to maxHeight and enable scrollbar
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = "auto"; // Show scrollbar
            } else {
                // Adjust height dynamically and hide scrollbar
                textarea.style.height = `${newHeight}px`;
                textarea.style.overflowY = "hidden"; // Hide scrollbar
            }
        }
    };

    useEffect(() => {
        adjustHeight(); // Adjust on mount or when content changes
    }, [value]);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const containerHeight = contentRef.current.clientHeight;
            console.log(contentHeight, containerHeight)

            // Show "View More" button only if content exceeds the max height of the container
            setIsLongContent(contentHeight > containerHeight);
        }
    }, [isExpanded]);

    return (
        <>
            <div className="lecture-header slide-to-bottom">
                <span className="lecture-title">{lectureDetail.lectureTitle}</span>
                <span className="time-created">{lectureDetail.relativeTime}</span>
            </div>
            {lectureDetail.videoMaterial ? (
                <div className={`video-container slide-to-bottom ${lectureDetail.videoMaterial ? "" : "no-video"}`}>
                    <video className="video-player" controls>
                        {lectureDetail?.videoMaterial?.path ? (
                            <source
                                src={lectureDetail.videoMaterial.path}
                                type={getVideoType(lectureDetail.videoMaterial.path)}
                            />
                        ) : (
                            <p>Error: Invalid file</p>
                        )}
                        Your browser does not support the video tag.
                    </video>
                </div>
            ) : null}
            {lectureDetail.mainMaterials && lectureDetail.mainMaterials.length > 0 && (
                <div className="main-material slide-to-right slide-to-bottom">
                    <span className="title">Main Material</span>
                    <span className="material-content">
                        <div
                            onClick={() => window.open(lectureDetail.mainMaterials[0].path)}
                            className="content-file"
                        >
                            <span>{lectureDetail.mainMaterials[0].fileName}</span>
                        </div>
                    </span>
                </div>
            )}


            <div className="lecture-main slide-to-bottom">
                <div className="lecture-main-menu">
                    {menuItems.map(item => (
                        <button
                            key={item.index}
                            className={`${index === item.index ? "active" : ""}`}
                            onClick={() => {
                                setIndex((item.index))
                            }}
                        >{item.label}</button>
                    ))}
                </div>
                <div className="menu-part">
                    {index === 1 && (
                        <div className="part-item">
                            {lectureDetail.lectureIntroduction && (
                                <span className="intro-content">
                                    {lectureDetail.lectureIntroduction}
                                </span>
                            )}
                        </div>
                    )}
                    {index === 2 && (
                        <div className="part-item">
                            {lectureDetail.supportMaterials && lectureDetail.supportMaterials.length > 0 && (
                                <span className="intro-content">
                                    {lectureDetail.supportMaterials.map((material, index) => (
                                        <div
                                            key={index}
                                            className="content-file"
                                            onClick={() => window.open(material.path)}>
                                            <span>{material.fileName}</span>
                                        </div>
                                    ))}
                                </span>
                            )}
                        </div>
                    )}
                    {index === 3 && (
                        <>
                            {lectureDetail.exercises && lectureDetail.exercises.length > 0
                                && lectureDetail.exercises.map((exercise, index) => (
                                    <div key={index} className="part-item exercise">
                                        <div className="exercise-display">
                                            <div className="exercise-body">
                                                <span className="item-title">{exercise.title}</span>
                                                <div className="exercise-description">
                                                    {exercise.assignmentType && (
                                                        <span>
                                                            <LuFileEdit color="#003B57" />&nbsp;
                                                            {exercise.assignmentType === AssignmentType.manual ?
                                                                "MANUAL"
                                                                :
                                                                (exercise.assignmentType === AssignmentType.code ? "CODE" : "QUIZ")}
                                                        </span>
                                                    )}
                                                    {exercise.duration && (
                                                        <span>
                                                            <LuClock color="#003B57" />&nbsp;
                                                            {`${exercise.duration} ${exercise.duration > 1 ? "mins" : "min"}`}
                                                        </span>
                                                    )}
                                                    {exercise.questionQuantity && (
                                                        <span>
                                                            <LuFileQuestion color="#003B57" />&nbsp;
                                                            {`${exercise.questionQuantity} ${exercise.questionQuantity > 1 ? "questions" : "question"}`}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {exercise.isSubmitted ?
                                                (
                                                    <div className="exercise-sideinfo">
                                                        <span className="complete">Complete <LuCheckSquare /></span>
                                                    </div>
                                                )
                                                :
                                                (isPastDateTime(exercise.dueDate, "2024-12-05T17:05:07.972126") ? (
                                                    <div className="exercise-sideinfo">
                                                        <span className="pastdue">Past due</span>
                                                    </div>
                                                )
                                                    :
                                                    (
                                                        <div className="exercise-sideinfo">
                                                            <span className="inform">{formatDateTime(exercise.dueDate)}</span>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                    {index === 4 && (
                        <>
                            <div className="part-item">
                                <div className="comment-display">
                                    <div className="ava-holder">
                                        <img src={default_ava} />
                                    </div>
                                    <div className="comment-content">
                                        <textarea
                                            ref={textareaRef}
                                            style={{ height: `${textAreaHeight}px` }}
                                            placeholder="Write your comment..."
                                            className="comment-entering"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                        >
                                        </textarea>
                                        <div className="button-container">
                                            <button className="cancel">Cancel</button>
                                            <button className="comment">Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="part-item">
                                <div className="comment-display">
                                    <div className="ava-holder">
                                        <img src={default_ava} />
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="commentator-name">Commentator name</span>
                                            <span className="comment-time">13 hr. ago</span>
                                        </div>
                                        <div
                                            ref={contentRef}
                                            className={`comment-body ${isExpanded ? "expanded" : ""}`}
                                        >
                                            <span>
                                                Today's lecture was incredibly insightful!
                                                The explanation was clear and well-structured, especially the examples that tied theory to practical applications.
                                            </span>
                                            <div className={`blur-bottom ${(isLongContent && !isExpanded) ? "show" : ""}`}></div>
                                        </div>
                                        {isLongContent && (
                                            <div className="view-more-container">
                                                <hr className="line-1" />
                                                <button
                                                    className="view-more-comment"
                                                    onClick={() => toggleComment()}
                                                >
                                                    {isExpanded ?
                                                        (<>View Less <IoIosArrowUp /></>) : (<>View More <IoIosArrowDown /></>)
                                                    }
                                                </button>
                                                <hr className="line-2" />
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <div className="comment-responses-container">
                                    <div className="more-responses">
                                        <button><IoIosArrowDown /> 3 replies</button>
                                    </div>
                                    <div className="comment-response">
                                        <div className="ava-holder">
                                            <img src={default_ava} />
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="commentator-name">Commentator name</span>
                                                <span className="comment-time">13 hr. ago</span>
                                            </div>
                                            <div
                                                // ref={contentRef}
                                                className={`comment-body ${isExpanded ? "expanded" : ""}`}
                                            >
                                                <span>
                                                    Today's lecture was incredibly insightful!
                                                    The explanation was clear and well-structured, especially the examples that tied theory to practical applications.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="comment-response">
                                        <div className="ava-holder">
                                            <img src={default_ava} />
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-content">
                                                <textarea
                                                    ref={textareaRef}
                                                    style={{ height: `${textAreaHeight}px` }}
                                                    placeholder="Write your comment..."
                                                    className="comment-entering"
                                                    value={value}
                                                    onChange={(e) => setValue(e.target.value)}
                                                >
                                                </textarea>
                                                <div className="button-container">
                                                    <button className="cancel">Cancel</button>
                                                    <button className="comment">Comment</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default LectureView;

