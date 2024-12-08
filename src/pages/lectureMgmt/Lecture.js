
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useLocation } from "react-router-dom";
import "../../assets/css/LectureView.css";
import { APIStatus, Role } from "../../constants/constants";
import { calculateRelativeTime, parseRelativeTime } from "../../functions/function";
import { getCourseContentStructure, getExerciseOfLectureViaStudent, getLectureDetail } from "../../services/courseService";
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

    const idRole = +localStorage.getItem("idRole");
    const idUser = +localStorage.getItem("idUser");

    const [idCourse, setIdCourse] = useState(null);
    const [idSection, setIdSection] = useState(null);
    const [idLecture, setIdLecture] = useState(null);

    const fetchLectureDetail = async (idLecture, idStudent) => {
        setLoading({ ...loading, lectureDetail: true });
        try {
            let response = await getLectureDetail(idLecture);
            if (response.status === APIStatus.success) {
                setLectureDetail({ ...response.data, timestamp: parseRelativeTime(response.data.relativeTime) });

                let exercises = await getExerciseOfLectureViaStudent(idLecture, idStudent);
                if (exercises.status === APIStatus.success) {
                    setLectureDetail((prevDetail) => ({
                        ...prevDetail, // Keep previous lecture details
                        exercises: exercises.data,
                    }));
                } else {
                    console.error("Fetching exercises: ", exercises.data);
                }
            } else {
                console.error("Fetching lecture detail: ", response.data)
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading({ ...loading, lectureDetail: false })
        }
    }

    const fetchCourseContentStructure = async (idCourse, idStudent) => {
        setLoading((prev) => ({ ...prev, sectionList: true })); // Safe state update
        try {
            const response = await getCourseContentStructure(idCourse, idStudent);

            if (response.status === APIStatus.success) {
                if (response.data) {
                    setSectionList(response.data); // Only update if data exists
                } else {
                    console.warn("Received empty data for course content structure.");
                }
            } else {
                console.error("Failed to fetch course content structure:", response.data);
            }
        } catch (error) {
            console.error("Error fetching course content structure:", error);
        } finally {
            setLoading((prev) => ({ ...prev, sectionList: false })); // Safe state update
        }
    };

    useEffect(() => {
        const state = location.state;

        if (state && state.idCourse && state.idSection && state.idLecture) {
            setIdCourse(state.idCourse);
            setIdSection(state.idSection);
            setIdLecture(state.idLecture);

            fetchLectureDetail(idLecture, idUser);
            if (idRole === Role.student) {
                fetchCourseContentStructure(state.idCourse, idUser);
            } else {
                fetchCourseContentStructure(state.idCourse);
            }
        }
    }, [location.state])

    useEffect(() => {
        fetchLectureDetail(idLecture, idUser);
    }, [idLecture])

    useEffect(() => {
        if (idRole === Role.student) {
            fetchCourseContentStructure(idCourse, idUser);
        } else {
            fetchCourseContentStructure(idCourse);
        }
    }, [idCourse])

    useEffect(() => {
        const interval = setInterval(() => {
            setLectureDetail((prevDetail) => ({
                ...prevDetail,
                relativeTime: calculateRelativeTime(prevDetail.timestamp),
            }));
        }, 60000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

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
                            <SectionView
                                idUser={idUser}
                                idSection={idSection}
                                idLecture={idLecture}
                                sectionList={sectionList}
                                setIdSection={setIdSection}
                                setIdLecture={setIdLecture}
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Lecture;