import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BsGenderTrans } from "react-icons/bs";
import { IoMdOpen } from "react-icons/io";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuGlobe2, LuMail, LuPhone } from "react-icons/lu";
import { RiChat3Line } from "react-icons/ri";
import "../../assets/css/Detail.css";
import default_ava from "../../assets/img/default_ava.png";
import Carousel from "../../components/Carousel";
import {
  getAllCourseCardsByIdStudent,
  getIsChatAvailable,
} from "../../services/courseService";
import { APIStatus, Object, Role } from "../../constants/constants";
import { getPI, getStudentDetail } from "../../services/userService";
import { ImSpinner2 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../functions/function";

const StudentDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});

  const idUser = Number(localStorage.getItem("idUser"));
  const idRole = +localStorage.getItem("idRole");
  const [idStudent, setIdStudent] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [isChatAvailable, setIsChatAvailable] = useState(false);

  const fetchStudentDetail = async (idStudent, idCourse) => {
    setLoading(true);
    try {
      let response = await getStudentDetail(idStudent, idCourse);
      if (response.status === APIStatus.success) {
        setStudentInfo(response.data);
      } else {
        console.warn("Error fetching data: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentPI = async (idStudent) => {
    setLoading(true);
    try {
      let response = await getPI(idStudent);
      if (response.status === APIStatus.success) {
        let courselist = await getAllCourseCardsByIdStudent(idStudent);
        if (courselist.status === APIStatus.success) {
          setStudentInfo({ ...response.data, courses: courselist.data });
        } else {
          console.warn("Error fetching data: ", courselist.data);
        }
      } else {
        console.warn("Error fetching data: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIsChatAvailable = async (idStudent) => {
    setLoading(true);
    try {
      let responseCanChat = await getIsChatAvailable(idStudent, idUser);
      if (responseCanChat.status === APIStatus.success) {
        setIsChatAvailable(responseCanChat.data);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const state = location.state;

    if (state && state.idCourse && state.idStudent && state.courseTitle) {
      setCourseTitle(state.courseTitle);
      fetchStudentDetail(state.idStudent, state.idCourse);
      setIdStudent(state.idStudent);
      if (idRole === Role.teacher) {
        fetchIsChatAvailable(state.idStudent);
      }
    } else if (state && state.idStudent) {
      fetchStudentPI(state.idStudent);
    }
  }, [location.state]);

  console.log("Data: ", studentInfo);

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="detail-container">
      <div className="left-container slide-to-right">
        <div className="block-container">
          <img
            className="biography-ava teacher"
            src={studentInfo.avatarPath || studentInfo.avatar || default_ava}
            alt="avatar"
          />
          <div className="biography-block">
            <span className="biography-name">
              {studentInfo.fullName || " "}
            </span>
          </div>
        </div>

        <div className="block-container">
          {/* <span className="block-container-title">Information</span> */}
          <div className="block-container-col">
            <div className="info-line">
              <LuMail />
              <span>{studentInfo.email || "(Email)"}</span>
            </div>
            <div className="info-line">
              <LuPhone />
              <span>
                {studentInfo.phoneNumber?.replace(
                  /(\d{4})(\d{3})(\d{3})/,
                  "$1 $2 $3"
                ) || "(Phone number)"}
              </span>
            </div>
            <div className="info-line">
              <BsGenderTrans />
              <span>{studentInfo.gender || "(Gender)"}</span>
            </div>
            <div className="info-line">
              <LiaBirthdayCakeSolid />
              <span>
                {studentInfo.dob ? formatDate(studentInfo.dob) : "(Birthday)"}
              </span>
            </div>
            <div className="info-line">
              <LuGlobe2 />
              <span>{studentInfo.nationality || "(Nationality)"}</span>
            </div>
          </div>
        </div>

        {idRole === Role.teacher && isChatAvailable ? (
          <button
            className="contact-block"
            onClick={() =>
              navigate("/chat", {
                state: {
                  selectedSender: {
                    userId: idStudent,
                    name: studentInfo.fullName,
                    avatar: studentInfo.avatarPath || studentInfo.avatar,
                  },
                },
              })
            }
          >
            Chat <RiChat3Line />
          </button>
        ) : null}
      </div>

      <div className="right-container slide-to-left">
        {idRole === Role.teacher ? (
          <div className="block-container">
            <span className="block-container-title">{courseTitle}</span>
            <div className="block-container-row">
              <div className="progress-section">
                <div className="progress-container">
                  <CircularProgressbar
                    strokeWidth={12}
                    value={`${
                      studentInfo.lectureTotal > 0
                        ? (studentInfo.lectureProgress /
                            studentInfo.lectureTotal) *
                          100
                        : 0
                    }`}
                    text={`${studentInfo.lectureProgress} / ${studentInfo.lectureTotal}`}
                  />
                </div>

                <label>Lecture</label>
              </div>

              <div className="progress-section">
                <div className="progress-container">
                  <CircularProgressbar
                    strokeWidth={12}
                    value={`${
                      studentInfo.exerciseTotal + studentInfo.testTotal > 0
                        ? ((studentInfo.exerciseProgress +
                            studentInfo.testProgress) /
                            (studentInfo.exerciseTotal +
                              studentInfo.testTotal)) *
                          100
                        : 0
                    }`}
                    text={`${
                      studentInfo.exerciseProgress + studentInfo.testProgress
                    } / ${studentInfo.exerciseTotal + studentInfo.testTotal}`}
                  />
                </div>
                <label>Assignment</label>
              </div>
            </div>
          </div>
        ) : null}

        <div className="block-container" style={{ height: "29.2rem" }}>
          <div className="carousel-block">
            <div className="carousel-header">
              <span>Courses</span>
              <button
                disabled={studentInfo.courses?.length < 1}
                onClick={() =>
                  navigate("/viewAll", {
                    state: {
                      object: Object.course,
                      listContent: studentInfo.courses,
                    },
                  })
                }
              >
                View more <IoMdOpen />
              </button>
            </div>
            {studentInfo.courses?.length > 0 && (
              <Carousel
                object={1} //course
                totalTracks={
                  studentInfo.courses.length > 6
                    ? 6
                    : Math.floor(studentInfo.courses?.length / 2)
                }
                itemsPerTrack={2}
                listInfo={studentInfo.courses}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
