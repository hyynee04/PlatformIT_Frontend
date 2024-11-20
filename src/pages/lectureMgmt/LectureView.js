import { useEffect, useRef, useState } from "react";
import {
    LuCheckSquare,
    LuClock,
    LuFileEdit
} from "react-icons/lu";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/LectureView.css";

const LectureView = (props) => {
    const [index, setIndex] = useState(1);
    const menuItems = [
        { label: "Content", index: 1 },
        { label: "Exercise", index: 2 },
        { label: "Comment", index: 3 }
    ];

    const [value, setValue] = useState("");
    const [textAreaHeight, setTextAreaHeight] = useState(30)
    const textareaRef = useRef(null);

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
    return (
        <div className="lecture-container ">
            <div className="lecture-content">
                <span className="course-name">Course Name</span>
                <div className="lecture-detail">
                    <div className="lecture-content-section">
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
                                                                <LuCheckSquare color="#003B57" /> 40 marks
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
                                                                <LuCheckSquare color="#003B57" /> 40 marks
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
                                                                <LuCheckSquare color="#003B57" /> 40 marks
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
                                        </>)
                                    )}

                            </div>
                        </div>

                    </div>
                    <div className="course-content-section"></div>
                </div>
            </div>

        </div>
    )
}

export default LectureView;