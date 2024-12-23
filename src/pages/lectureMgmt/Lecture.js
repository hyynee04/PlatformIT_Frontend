import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useLocation } from "react-router-dom";
import "../../assets/css/LectureView.css";
import { APIStatus, Role } from "../../constants/constants";
import {
  calculateRelativeTime,
  parseRelativeTime,
  processCommentList,
} from "../../functions/function";
import {
  getCourseContentStructure,
  getExerciseOfLecture,
  getLectureDetail,
} from "../../services/courseService";
import LectureView from "./LectureView";
import SectionView from "./SectionView";
import DiagDeleteConfirmation from "../../components/diag/DiagDeleteConfirmation";
import { getAllCommentOfLecture } from "../../services/commentService";
import FetchDataUpdated from "../../functions/FetchDataUpdated";

const Lecture = (props) => {
  const location = useLocation();

  const [loading, setLoading] = useState({
    lectureDetail: false,
    sectionList: false,
  });

  const [lectureDetail, setLectureDetail] = useState({});
  const [sectionList, setSectionList] = useState([]);
  const [mainCommentList, setMainCommentList] = useState([]);
  const [replyCommentList, setReplyCommentList] = useState({});
  const [updatedCommentList, setUpdatedCommentList] = useState([]);

  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");

  const [idCourse, setIdCourse] = useState(null);
  const [idSection, setIdSection] = useState(null);
  const [idLecture, setIdLecture] = useState(null);
  const [idTeacher, setIdTeacher] = useState(null);
  const [idComment, setIdComment] = useState(null);
  const [idSectionRemoved, setIdSectionRemoved] = useState(null);

  const [isRemoved, setIsRemoved] = useState(false);

  const fetchLectureDetail = async (idLecture, idStudent) => {
    setLoading({ ...loading, lectureDetail: true });
    try {
      let response = await getLectureDetail(idLecture);
      if (response.status === APIStatus.success) {
        setLectureDetail({
          ...response.data,
          timestamp: parseRelativeTime(response.data.relativeTime),
        });

        let exercises = await getExerciseOfLecture(idLecture, idStudent);
        if (exercises.status === APIStatus.success) {
          setLectureDetail((prevDetail) => ({
            ...prevDetail, // Keep previous lecture details
            exercises: exercises.data,
          }));
        } else {
          console.error("Fetching exercises: ", exercises.data);
        }
      } else {
        console.error("Fetching lecture detail: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading({ ...loading, lectureDetail: false });
    }
  };

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
        console.error(
          "Failed to fetch course content structure:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching course content structure:", error);
    } finally {
      setLoading((prev) => ({ ...prev, sectionList: false })); // Safe state update
    }
  };

  const fetchAllCommentOfLecture = async (idLecture) => {
    try {
      let respone = await getAllCommentOfLecture(idLecture);
      if (respone.status === APIStatus.success) {
        let processedData = processCommentList(respone.data);
        setMainCommentList(processedData.main);
        setReplyCommentList(processedData.reply);
      } else console.error(respone.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const state = location.state;
    setLoading({ ...loading, lectureDetail: true });
    if (
      state &&
      state.idCourse &&
      state.idSection &&
      state.idLecture &&
      state.idTeacher
    ) {
      setIdCourse(state.idCourse);
      setIdSection(state.idSection);
      setIdLecture(state.idLecture);
      setIdTeacher(state.idTeacher);

      fetchLectureDetail(state.idLecture);
      if (idRole === Role.student) {
        fetchCourseContentStructure(state.idCourse, idUser);
      } else {
        fetchCourseContentStructure(state.idCourse);
      }
      fetchAllCommentOfLecture(state.idLecture);
    }
    setLoading({ ...loading, lectureDetail: false });
  }, [location.state]);

  useEffect(() => {
    setLoading({ ...loading, lectureDetail: true });
    const reFetchData = async () => {
      await fetchLectureDetail(idLecture);
      await fetchAllCommentOfLecture(idLecture);
      setLoading({ ...loading, lectureDetail: false });
    };
    reFetchData();
  }, [idLecture]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLectureDetail((prevDetail) => ({
        ...prevDetail,
        relativeTime: calculateRelativeTime(prevDetail.timestamp),
      }));

      setMainCommentList((prevMain) =>
        prevMain.map((main) => ({
          ...main,
          relativeTime: calculateRelativeTime(main.timestamp),
        }))
      );

      setReplyCommentList((prevListSubCmt) => {
        const updatedListSubCmt = {};
        Object.keys(prevListSubCmt).forEach((key) => {
          updatedListSubCmt[key] = prevListSubCmt[key].map((prevSub) => ({
            ...prevSub,
            relativeTime: calculateRelativeTime(prevSub.timestamp),
          }));
        });
        return updatedListSubCmt;
      });
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const processedData = processCommentList(updatedCommentList);
    setMainCommentList(processedData.main);
    setReplyCommentList(processedData.reply);
  }, [updatedCommentList]);

  return (
    <div className="lecture-container">
      <div className="lecture-content">
        <span className="course-name">{lectureDetail.courseTitle}</span>
        <div className="lecture-detail">
          <div className="lecture-content-section">
            {loading.lectureDetail ? (
              <div className="loading-page component">
                <ImSpinner2 color="#397979" />
              </div>
            ) : (
              <LectureView
                lectureDetail={lectureDetail}
                idLecture={lectureDetail.idLecture}
                idTeacher={idTeacher}
                setIsRemoved={setIsRemoved}
                setIdComment={setIdComment}
                mainCommentList={mainCommentList}
                replyCommentList={replyCommentList}
                fetchAllCommentOfLecture={fetchAllCommentOfLecture}
                setUpdatedCommentList={setUpdatedCommentList}
              />
            )}
          </div>

          <div className="course-content-section">
            {loading.sectionList ? (
              <div className="loading-page component">
                <ImSpinner2 color="#397979" />
              </div>
            ) : (
              <SectionView
                idCourse={idCourse}
                idSection={idSection}
                idLecture={idLecture}
                sectionList={sectionList}
                fetchSectionList={() => fetchCourseContentStructure(idCourse)}
                setIdSection={setIdSection}
                setIdLecture={setIdLecture}
                courseTitle={lectureDetail.courseTitle}
                setIsRemoved={setIsRemoved}
                setIdSectionRemoved={setIdSectionRemoved}
              />
            )}
          </div>
        </div>
      </div>
      <DiagDeleteConfirmation
        isOpen={isRemoved}
        onClose={() => {
          setIsRemoved(false);
          if (idComment) setIdComment(null);
          if (idSectionRemoved) setIdSectionRemoved(null);
        }}
        object={
          idComment
            ? {
                id: idComment,
                name: "comment",
                message: "Are you sure to delete this comment?",
              }
            : idSectionRemoved
            ? {
                id: idSectionRemoved,
                name: "section",
                message: "Are you sure to delete this section?",
              }
            : {
                id: lectureDetail.idLecture,
                name: "lecture",
                message: "Are you sure to delete this lecture?",
              }
        }
        fetchData={
          idComment
            ? () => fetchAllCommentOfLecture(idLecture)
            : idSectionRemoved
            ? () => fetchCourseContentStructure(idCourse)
            : undefined
        }
      />
    </div>
  );
};

export default Lecture;
