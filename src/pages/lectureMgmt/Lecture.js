
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useLocation } from "react-router-dom";
import "../../assets/css/LectureView.css";
import { APIStatus } from "../../constants/constants";
import { calculateRelativeTime, parseRelativeTime } from "../../functions/function";
import { getLectureDetail } from "../../services/courseService";
import LectureView from "./LectureView";
import SectionView from "./SectionView";

const Lecture = (props) => {
    const location = useLocation();

    const [loading, setLoading] = useState({
        lectureDetail: false,
        sectionList: false,
    });

    const [lectureDetail, setLectureDetail] = useState({});
    const [sectionList, setSectionList] = useState([]);

    const fetchLectureDetail = async (idLecture) => {
        setLoading({ ...loading, lectureDetail: true });
        try {
            const response = await getLectureDetail(idLecture);
            if (response.status === APIStatus.success) {
                setLectureDetail({ ...response.data, timestamp: parseRelativeTime(response.data.relativeTime) });
            } else {
                console.error(response.data)
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
        } finally {
            setLoading({ ...loading, lectureDetail: false })
        }
    }

    useEffect(() => {
        const state = location.state;
        if (state && state.idLecture && state.idCourse) {
            fetchLectureDetail(state.idLecture);
        }

        const interval = setInterval(() => {
            setLectureDetail({ ...lectureDetail, relativeTime: calculateRelativeTime(lectureDetail.timestamp), })
        }, 6000);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="lecture-container">
            <div className="lecture-content">
                <span className="course-name">{lectureDetail.courseTitle}</span>
                <div className="lecture-detail">

                    <div className="lecture-content-section">
                        {loading.lectureDetail ?
                            <div className="loading-page component">
                                <ImSpinner2 color="#397979" />
                            </div>
                            :
                            <LectureView
                                lectureDetail={lectureDetail}
                            />
                        }
                    </div>

                    <div className="course-content-section">
                        {loading.sectionList ?
                            <div className="loading-page component">
                                <ImSpinner2 color="#397979" />
                            </div>
                            :
                            <SectionView />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Lecture;