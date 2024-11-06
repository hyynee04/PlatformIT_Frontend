import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPlait from "../assets/img/logoPlait.png";
import "../assets/scss/Home.css";

import { getAllCenterCards} from "../services/centerService";
import { getAllTeacherCards } from "../services/userService";
import { getAllCourseCards } from "../services/courseService";
import Carousel from "../components/Carousel";

const Home = () => {
  const navigate = useNavigate();

  const [listTeacher, setListTeacher] = useState([])
  const [totalTeacherTracks, setTotalTeacherTracks] = useState(0)

  const [listCenter, setListCenter] = useState([])
  const [totalCenterTracks, setTotalCenterTracks] = useState(0)
  
  const [listCourse, setListCourse] = useState([])
  const [totalCourseTracks, setTotalCourseTracks] = useState(0)

  const getTeacherCards = async () => {
    let teachers = await getAllTeacherCards();
    teachers.sort((a, b) => b.coursesCount - a.coursesCount);
    if(teachers.length > 12) {
      setTotalTeacherTracks(3);
    }
    else 
      setTotalTeacherTracks(Math.ceil(teachers.length / 4))
    setListTeacher(teachers)
  };

  const getCenterCards = async () => {
    let centers = await getAllCenterCards();
    centers.sort((a, b) => b.studentsCount - a.studentsCount);
    if(centers.length > 12) {
      setTotalCenterTracks(3);
    }
    else 
      setTotalCenterTracks(Math.ceil(centers.length / 4))
    setListCenter(centers)
  };

  const getCourseCards = async () => {
    let courses = await getAllCourseCards();
    //courses.sort((a, b) => new Date(b.courseStartDate) - new Date(a.courseStartDate));
    if(courses.length > 12) {
      setTotalCourseTracks(3);
    }
    else 
      setTotalCourseTracks(Math.ceil(courses.length / 4))
    setListCourse(courses)
  };

  useEffect(() => {
    getTeacherCards();
    getCenterCards();
    getCourseCards();
  }, []);

  return (
    <div>
      <div className="home-main-container">
        <div className="introduction-container">
          <div className="left-introduction">
            <span className="introduction-brand-title">WELCOME TO <b>PLAIT</b></span>
            <span className="introduction-brand-name">Platform for IT Learning</span>
            <div className="introduction-register">
              <span>Join us now</span>
              <button
                onClick={() => navigate('/register')}
              >Register</button>
            </div>
          </div>
          <div className="right-introduction">
            <img className="rotate " src={logoPlait} alt="logo Plait"/>
          </div>
        </div>
        <div className="carousel-container">
          <Carousel 
            object={1} //course
            totalTracks={totalCourseTracks}
            itemsPerTrack={4}
            header={"Newest Courses"}
            listInfo={listCourse}
          />
        </div>
        <div className="carousel-container">
          <Carousel 
            object={2} //teacher
            totalTracks={totalTeacherTracks}
            itemsPerTrack={4}
            header={"Top Teachers"}
            listInfo={listTeacher}
          />
        </div>
        <div className="carousel-container">
          <Carousel 
            object={3} //center
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
