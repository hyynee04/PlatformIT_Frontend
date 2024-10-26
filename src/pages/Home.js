import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPlait from "../assets/img/logoPlait.png";
import "../assets/scss/Home.css";

import { getAllCenter } from "../services/centerService";
import CourseCard from "../components/Card/CourseCard";
import TeacherCard from "../components/Card/TeacherCard";
import CenterCard from "../components/Card/CenterCard";
import Carousel from "../components/Carousel";

const Home = () => {
  const navigate = useNavigate();
  const [listInfo, setListInfo] = useState([])

  const getListCenter = async () => {
    let data = await getAllCenter();
    //let usersWithRole = data.filter((user) => user.idRole === Role.teacher);
    console.log(data);
    // setListUser(usersWithRole);

  };

  useEffect(() => {
    //getListCenter();
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
            <img className="rotate " src={logoPlait} />
          </div>
        </div>
        <div className="carousel-container">
          <Carousel 
            object={1} //course
            totalTracks={3}
            itemsPerTrack={4}
            header={"Top Course"}
          />
        </div>
        <div className="carousel-container">
          <Carousel 
            object={2} //teacher
            totalTracks={3}
            itemsPerTrack={4}
            header={"Top Teacher"}
          />
        </div>
        <div className="carousel-container">
          <Carousel 
            object={3} //center
            totalTracks={3}
            itemsPerTrack={4}
            header={"Top Center"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
