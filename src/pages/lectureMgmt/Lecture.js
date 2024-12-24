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
import DiagUpdateConfirmation from "../../components/diag/DiagUpdateConfirmation";

const Lecture = (props) => {
  const location = useLocation();

  const [loading, setLoading] = useState({
    lectureDetail: false,
    sectionList: false,
  });

  const [lectureDetail, setLectureDetail] = useState({});
  const [editLecture, setEditLecture] = useState({});
  const [sectionList, setSectionList] = useState([]);
  const [mainCommentList, setMainCommentList] = useState([]);
  const [replyCommentList, setReplyCommentList] = useState({});
  const [updatedCommentList, setUpdatedCommentList] = useState([]);

  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");

  const [idList, setIdList] = useState({});
  const [idCourse, setIdCourse] = useState(null);
  const [idSection, setIdSection] = useState(null);
  const [idLecture, setIdLecture] = useState(null);
  const [idTeacher, setIdTeacher] = useState(null);
  const [idComment, setIdComment] = useState(null);
  const [idSectionRemoved, setIdSectionRemoved] = useState(null);

  const [isRemoved, setIsRemoved] = useState(false);
  const [isEditLecture, setIsEditLecture] = useState(true);
  const [lectureStatus, setLectureStatus] = useState(null);

  const fetchLectureDetail = async (idLecture, idStudent) => {
    setLoading({ ...loading, lectureDetail: true });
    try {
      let response = await getLectureDetail(idLecture);
      if (response.status === APIStatus.success) {
        setLectureDetail({
          ...response.data,
          timestamp: parseRelativeTime(response.data.relativeTime),
        });
        setIdCourse(response.data.idCourse);
        setIdSection(response.data.idSection);
        let exercises = await getExerciseOfLecture(idLecture, idStudent);
        if (exercises.status === APIStatus.success) {
          setLectureDetail((prevDetail) => ({
            ...prevDetail, // Keep previous lecture details
            exercises: exercises.data,
          }));
        } else {
          console.error("Fetching exercises: ", exercises.data);
        }
        if (idRole === Role.teacher) {
          setDefaultToEditLecture(response.data);
          setIdList({
            idCourse: response.data.idCourse,
            idSection: response.data.idSection,
            idLecture: idLecture,
            idCreatedBy: idUser,
          });
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
          setSectionList(response.data);
          setIdTeacher(response.data.idTeacher);

          const section = response.data.sectionStructures.find(
            (sec) => sec.idSection === idSection
          );
          if (section) {
            const lecture = section.lectureStructures.find(
              (lec) => lec.idLecture === idLecture
            );
            setLectureStatus(lecture ? lecture.lectureStatus : null);
          } else {
            setLectureStatus(null); // Section not found
          }
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

  const setDefaultToEditLecture = (lectureDetail) => {
    setEditLecture({
      Title: lectureDetail.lectureTitle,
      Introduction: lectureDetail.lectureIntroduction,
      LectureVideo: lectureDetail.videoMaterial,
      MainMaterials: lectureDetail.mainMaterials,
      SupportMaterials: lectureDetail.supportMaterials,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const state = location.state;
    setLoading({ ...loading, lectureDetail: true });
    if (state && state.idLecture) {
      const fetchData = async () => {
        await setIdLecture(state.idLecture);
        await fetchLectureDetail(state.idLecture);
        if (idRole === Role.student) {
          fetchCourseContentStructure(idCourse, idUser);
        } else {
          fetchCourseContentStructure(idCourse);
        }
        fetchAllCommentOfLecture(state.idLecture);
      };
      fetchData();
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
    if (idRole === Role.student) {
      fetchCourseContentStructure(idCourse, idUser);
    } else {
      fetchCourseContentStructure(idCourse);
    }
  }, [idCourse]);

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
                editLecture={editLecture}
                idLecture={idLecture}
                idTeacher={idTeacher}
                setIsRemoved={setIsRemoved}
                setIdComment={setIdComment}
                mainCommentList={mainCommentList}
                replyCommentList={replyCommentList}
                fetchAllCommentOfLecture={fetchAllCommentOfLecture}
                setUpdatedCommentList={setUpdatedCommentList}
                lectureStatus={lectureStatus}
                setDefaultToEditLecture={() =>
                  setDefaultToEditLecture(lectureDetail)
                }
                setEditLecture={setEditLecture}
                setIsEditLecture={setIsEditLecture}
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
                fetchSectionList={fetchCourseContentStructure}
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
      <DiagUpdateConfirmation
        isOpen={isEditLecture}
        onClose={() => setIsEditLecture(false)}
        message={"Are you sure to save these changes?"}
      />
    </div>
  );
};

export default Lecture;
