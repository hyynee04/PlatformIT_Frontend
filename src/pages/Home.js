import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoMdOpen } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "../assets/css/Home.css";
import logoPlait from "../assets/img/logoPlait.png";
import Carousel from "../components/Carousel";
import { Object, Role } from "../constants/constants";
import { getAllCenterCards } from "../services/centerService";
import { getAllCourseCards } from "../services/courseService";
import { getAllTeacherCards } from "../services/userService";

const Home = (props) => {
  const [loading, setLoading] = useState(false);
  const { role } = props;
  const navigate = useNavigate();

  const [listTeacher, setListTeacher] = useState([]);
  const [totalTeacherTracks, setTotalTeacherTracks] = useState(0);

  const [listCenter, setListCenter] = useState([]);
  const [totalCenterTracks, setTotalCenterTracks] = useState(0);

  const [listCourse, setListCourse] = useState([]);
  const [totalCourseTracks, setTotalCourseTracks] = useState(0);

  const getTeacherCards = async () => {
    setLoading(true);
    try {
      let response = await getAllTeacherCards();
      let teachers = response.data;
      teachers.sort((a, b) => b.coursesCount - a.coursesCount);
      if (teachers.length > 12) {
        setTotalTeacherTracks(3);
      } else setTotalTeacherTracks(Math.ceil(teachers.length / 4));
      setListTeacher(teachers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const getCenterCards = async () => {
    setLoading(true);
    try {
      let response = await getAllCenterCards();
      let centers = response.data;
      centers.sort((a, b) => b.studentsCount - a.studentsCount);
      if (centers.length > 12) {
        setTotalCenterTracks(3);
      } else setTotalCenterTracks(Math.ceil(centers.length / 4));
      setListCenter(centers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const getCourseCards = async () => {
    setLoading(true);
    const idStudent = +localStorage.getItem("idUser")
    try {
      let response = await getAllCourseCards(idStudent);
      let courses = response.data;
      //courses.sort((a, b) => new Date(b.courseStartDate) - new Date(a.courseStartDate));
      if (courses.length > 12) {
        setTotalCourseTracks(3);
      } else setTotalCourseTracks(Math.ceil(courses.length / 4));
      setListCourse(courses);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      try {
        await getTeacherCards();
        await getCenterCards();
        await getCourseCards();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };
    fetchAllCards();
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div>
      <div className="home-main-container">
        {role && (role === Role.guest || role === Role.student) && (
          <div className="introduction-container slide-to-bottom">
            <div className="left-introduction">
              <span className="introduction-brand-title">
                WELCOME TO <b>PLAIT</b>
              </span>
              <span className="introduction-brand-name">
                Platform for IT Learning
              </span>
              {role === Role.guest && (
                <div className="introduction-register">
                  <span>Join us now</span>
                  <button onClick={() => navigate("/register")}>
                    Register
                  </button>
                </div>
              )}
            </div>
            <div className="right-introduction">
              <img className="rotate " src={logoPlait} alt="logo Plait" />
            </div>
          </div>
        )}
        <div className="carousel-container slide-to-right">
          <div className="carousel-header">
            <span>Newest Courses</span>
            <button
              onClick={() =>
                navigate("/viewAll", {
                  state: {
                    object: Object.course,
                  },
                })
              }
            >
              View more <IoMdOpen />
            </button>
          </div>
          <Carousel
            object={Object.course} //course
            totalTracks={totalCourseTracks}
            itemsPerTrack={4}
            header={"Newest Courses"}
            listInfo={listCourse}
          />
        </div>
        <div className="carousel-container slide-to-right">
          <div className="carousel-header">
            <span>Top Teachers</span>
            <button
              onClick={() =>
                navigate("/viewAll", {
                  state: {
                    object: Object.teacher,
                  },
                })
              }
            >
              View more <IoMdOpen />
            </button>
          </div>
          <Carousel
            object={Object.teacher} //teacher
            totalTracks={totalTeacherTracks}
            itemsPerTrack={4}
            header={"Top Teachers"}
            listInfo={listTeacher}
          />
        </div>
        <div className="carousel-container slide-to-left">
          <div className="carousel-header">
            <span>Top Centers</span>
            <button
              onClick={() =>
                navigate("/viewAll", {
                  state: {
                    object: Object.center,
                  },
                })
              }
            >
              View more <IoMdOpen />
            </button>
          </div>
          <Carousel
            object={Object.center} //center
            totalTracks={totalCenterTracks}
            itemsPerTrack={4}
            header={"Top Centers"}
            listInfo={listCenter}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
