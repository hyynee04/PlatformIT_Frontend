import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/LectureView.css";

const LectureView = (props) => {
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
                                <button className="active">Content</button>
                                <button>Exercise</button>
                                <button>Comment</button>
                            </div>
                            <div className="menu-part">
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