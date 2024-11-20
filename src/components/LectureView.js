import default_image from "../assets/img/default_image.png";
import "../assets/scss/LectureView.css";

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
                            <span>Lecture Title: ...</span>
                            <span>13 hr. ago</span>
                        </div>
                    </div>
                    <div className="course-content-section"></div>
                </div>
            </div>

        </div>
    )
}

export default LectureView;