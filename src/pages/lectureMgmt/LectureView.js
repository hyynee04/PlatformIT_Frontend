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
import default_image from "../../assets/img/default_image.png";

const LectureView = (props) => {
    const [index, setIndex] = useState(1);
    const menuItems = [
        { label: "Content", index: 1 },
        { label: "Exercise", index: 2 },
        { label: "Comment", index: 3 }
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
            <div className="course-background">
                <img src={default_image} alt="course background" />
            </div>
            <div className="lecture-header">
                <span className="lecture-title">Lecture Title: ...</span>
                <span className="time-created">13 hr. ago</span>
            </div>
            <div className="lecture-main">
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
                    {index === 1 ?
                        (<>

                            <div className="part-item">
                                <span className="item-title">Introduction</span>
                                <span className="intro-content">
                                    Body text for whatever you’d like to say.
                                    Add main takeaway points,quotes, anecdotes, or even a very very short story.
                                </span>
                            </div>
                            <div className="part-item">
                                <span className="item-title">Materials</span>
                                <span className="intro-content">
                                    Body text for whatever you’d like to say.
                                    Add main takeaway points,quotes, anecdotes, or even a very very short story.
                                </span>
                            </div>
                            <div className="part-item">
                                <span className="item-title">Supporting Materials</span>
                                <span className="intro-content">
                                    Body text for whatever you’d like to say.
                                    Add main takeaway points,quotes, anecdotes, or even a very very short story.
                                </span>
                            </div>

                        </>)
                        :
                        (index === 2 ?
                            (<>
                                <div className="part-item">
                                    <div className="exercise-display">
                                        <div className="exercise-body">
                                            <span className="item-title">Title</span>
                                            <div className="exercise-description">
                                                <span>
                                                    <LuFileEdit color="#003B57" /> Manual
                                                </span>
                                                <span>
                                                    <LuClock color="#003B57" /> 45 mins
                                                </span>
                                                <span>
                                                    <LuFileQuestion color="#003B57" /> 40 questions
                                                </span>
                                            </div>
                                        </div>
                                        <div className="exercise-sideinfo">
                                            <span className="inform">Due: 12/09/2025, 23:59</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="part-item">
                                    <div className="exercise-display">
                                        <div className="exercise-body">
                                            <span className="item-title">Title</span>
                                            <div className="exercise-description">
                                                <span>
                                                    <LuFileEdit color="#003B57" /> Manual
                                                </span>
                                                <span>
                                                    <LuClock color="#003B57" /> 45 mins
                                                </span>
                                                <span>
                                                    <LuFileQuestion color="#003B57" /> 40 questions
                                                </span>
                                            </div>
                                        </div>
                                        <div className="exercise-sideinfo">
                                            <span className="complete">Complete <LuCheckSquare /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="part-item">
                                    <div className="exercise-display">
                                        <div className="exercise-body">
                                            <span className="item-title">Title</span>
                                            <div className="exercise-description">
                                                <span>
                                                    <LuFileEdit color="#003B57" /> Manual
                                                </span>
                                                <span>
                                                    <LuClock color="#003B57" /> 45 mins
                                                </span>
                                                <span>
                                                    <LuFileQuestion color="#003B57" /> 40 questions
                                                </span>
                                            </div>
                                        </div>
                                        <div className="exercise-sideinfo">
                                            <span className="pastdue">Past due</span>
                                        </div>
                                    </div>
                                </div>
                            </>)
                            :
                            (<>
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
                            </>)
                        )}

                </div>
            </div>
        </>
    )
}

export default LectureView;

