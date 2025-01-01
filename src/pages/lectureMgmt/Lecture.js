import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
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
  postFinishLecture,
} from "../../services/courseService";
import LectureView from "./LectureView";
import SectionView from "./SectionView";
import DiagDeleteConfirmation from "../../components/diag/DiagDeleteConfirmation";
import { getAllCommentOfLecture } from "../../services/commentService";
import FetchDataUpdated from "../../functions/FetchDataUpdated";
import DiagUpdateConfirmation from "../../components/diag/DiagUpdateConfirmation";

const Lecture = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(1);

  const [loading, setLoading] = useState({
    lectureDetail: false,
    sectionList: false,
    comment: false,
    exercise: false,
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

  const [idLectureChange, setIdLectureChange] = useState(null);
  const [idSectionChange, setIdSectionChange] = useState(null);

  const [isRemoved, setIsRemoved] = useState(false);
  const [isEditLecture, setIsEditLecture] = useState(false);
  const [isFinishedLecture, setIsFinishedLecture] = useState(null);
  const [isFromNotification, setIsFromNotification] = useState(false);

  const fetchLectureDetail = async (idLecture, idUser) => {
    setLoading((prev) => ({ ...prev, lectureDetail: true }));
    try {
      let response = await getLectureDetail(idLecture);
      if (response.status === APIStatus.success) {
        setLectureDetail({
          ...response.data,
          timestamp: parseRelativeTime(response.data.relativeTime),
        });
        setIdSection(response.data.idSection);

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
      setLoading((prev) => ({ ...prev, lectureDetail: false }));
    }
  };

  const fetchExerciseOfLecture = async (idLecture, idUser) => {
    let exercises = await getExerciseOfLecture(idLecture, idUser);
    if (exercises.status === APIStatus.success) {
      setLectureDetail((prevDetail) => ({
        ...prevDetail, // Keep previous lecture details
        exercises: exercises.data,
      }));
    } else {
      console.error("Fetching exercises: ", exercises.data);
    }
  };

  const fetchCourseContentStructure = async (
    idCourse,
    idStudent,
    idLecture
  ) => {
    setLoading((prev) => ({ ...prev, sectionList: true }));
    try {
      const response = await getCourseContentStructure(idCourse, idStudent);

      if (response.status === APIStatus.success) {
        if (response.data) {
          setSectionList(response.data);
          setIdTeacher(response.data.idTeacher);
          console.log();
          getIsFinishedLectureOfStudent(response.data, idLecture);
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
      setLoading((prev) => ({ ...prev, sectionList: false }));
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
      Title: lectureDetail.lectureTitle || "",
      Introduction: lectureDetail.lectureIntroduction || "",
      LectureVideo: lectureDetail.videoMaterial || "",
      MainMaterials: lectureDetail.mainMaterials[0] || "",
      SupportMaterials: lectureDetail.supportMaterials || [],
    });
  };

  const getIsFinishedLectureOfStudent = (sectionList, idLecture) => {
    const lecture = sectionList.sectionStructures
      ?.flatMap((section) => section.lectureStructures) // Gộp tất cả bài giảng từ các section
      ?.find((lec) => lec.idLecture === idLecture); // Tìm bài giảng theo idLecture
    setIsFinishedLecture(lecture ? lecture.isFinishedLecture : null);
  };

  const finishLecture = async (idLecture, idStudent) => {
    try {
      let response = await postFinishLecture(idLecture, idStudent);
      if (response.status === APIStatus.success) {
        fetchCourseContentStructure(idCourse, idStudent, idLecture);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const state = location.state;
    if (state && state.idLecture && state.idCourse) {
      setIdCourse(state.idCourse);
      setIdLecture(state.idLecture);
      setIdLectureChange(state.idLecture);

      if (state.idComment) {
        setIndex(4);
      }

      if (idRole === Role.student) {
        fetchCourseContentStructure(state.idCourse, idUser, state.idLecture);
      } else {
        fetchCourseContentStructure(state.idCourse);
      }
      const FetchData = async () => {
        await fetchLectureDetail(state.idLecture, idUser);
        fetchAllCommentOfLecture(state.idLecture);
        fetchExerciseOfLecture(state.idLecture, idUser);
      };

      FetchData();
    }
  }, [location.state]);

  useEffect(() => {
    const FetchData = async (idLecture) => {
      await fetchLectureDetail(idLecture, idUser);
      fetchAllCommentOfLecture(idLecture);
      fetchExerciseOfLecture(idLecture, idUser);
    };
    if (idLecture !== idLectureChange) {
      setIdLecture(idLectureChange);
      setIdSection(idSectionChange);
      getIsFinishedLectureOfStudent(sectionList, idLectureChange);
      FetchData(idLectureChange);
    }
  }, [idLectureChange, idSectionChange]);

  useEffect(() => {
    if (idRole === Role.student && isFinishedLecture) {
      finishLecture(idLecture, idUser);
    }
  }, [isFinishedLecture]);

  useEffect(() => {
    //
  }, [sectionList, idSection, idLecture]);

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
        <span
          className="course-name"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/courseDetail", {
              state: {
                idCourse: idCourse,
                idUser: localStorage.getItem("idUser"),
                idRole: localStorage.getItem("idRole"),
                idSection: idSection,
              },
            });
          }}
        >
          {lectureDetail.courseTitle}
        </span>
        <div className="lecture-detail">
          <div className="lecture-content-section">
            {loading.lectureDetail ||
            Object.keys(lectureDetail).length === 0 ? (
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
                setDefaultToEditLecture={() =>
                  setDefaultToEditLecture(lectureDetail)
                }
                setEditLecture={setEditLecture}
                setIsEditLecture={setIsEditLecture}
                index={index}
                setIndex={setIndex}
                isFinishedLecture={isFinishedLecture}
                setIsFinishedLecture={setIsFinishedLecture}
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
                setIdSectionChange={setIdSectionChange}
                setIdLectureChange={setIdLectureChange}
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
        idList={idList}
        editLecture={editLecture}
        fetchData={() => fetchLectureDetail(idLecture, idUser)}
      />
    </div>
  );
};

export default Lecture;
