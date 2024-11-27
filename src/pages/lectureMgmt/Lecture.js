
import "../../assets/scss/LectureView.css";
import LectureView from "./LectureView";
import SectionView from "./SectionView";

const Lecture = (props) => {

    return (
        <div className="lecture-container ">
            <div className="lecture-content">
                <span className="course-name">Course Name</span>
                <div className="lecture-detail">
                    <div className="lecture-content-section">
                        <LectureView />
                    </div>
                    <div className="course-content-section">
                        <SectionView />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Lecture;