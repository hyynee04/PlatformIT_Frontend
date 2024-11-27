import React from "react";
import { PiBuildingOffice, PiStudentFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import '../assets/css/AboutUs.css';
import diverse_courses from "../assets/img/diverse_courses.png";
import flexible_learning from "../assets/img/flexible_learning.png";
import interaction from "../assets/img/interaction.png";
import logoPlait from "../assets/img/logoPlait.png";
import logoPlait2 from "../assets/img/logoPlait2.png";


const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="logo-aboutus-container">
        <img className="fade-effect" src={logoPlait} />
        <img className="" src={logoPlait2} />
      </div>
      <div className="horizontal-line">
        <span className="white-shadow-effect">WELCOME TO <span className="second-main-color-text white-shadow-effect">PLAIT</span> </span>
      </div>
      <div className="frame">
        <span className="quote-sentence">An information technology learning platform that connects students and businesses for growth.</span>
        <span className="quote-sentence">We are committed to providing high-quality courses that enhance skills and knowledge in the IT field.</span>
      </div>
      <div className="frame padding-64-px margin-bottom-32-px">
        <span className="target-group-title">Target Group</span>

        <div className="group-container">
          <div className="group">
            <div className="group-header">
              <PiStudentFill color="#003B57" />
              <span className="header-content-text">Student</span>
            </div>
            <span className="group-content">
              Discover a wide range of IT courses,
              from beginner to advanced levels,
              designed to cater to all skill sets.
            </span>
            <span className="group-content">
              Whether you are just starting your journey in technology or
              looking to deepen your expertise,
              sign up today to join courses that align with your interests and learning goals.
            </span>
          </div>

          <div className="group">
            <div className="group-header">
              <PiBuildingOffice color="#003B57" />
              <span className="header-content-text">Business</span>
            </div>
            <span className="group-content">
              Sign up to create paid courses and
              enroll qualified instructors to deliver high-quality instruction.
            </span>
            <span className="group-content">
              This initiative offers staff the opportunity to enhance their skills and
              stay up-to-date with the latest technologies through comprehensive and well-structured training programs.
            </span>
          </div>
        </div>
      </div>
      <div className="frame padding-64-px gray-background">
        <span className="feature-title">Key Features</span>
        <div className="feature-card-container">
          <div className="feature-card">
            <img src={diverse_courses} />
            <span className="header-content-text">Diverse Courses</span>
            <span className="feature-card-content">Videos, texts, and exercises to enhance the learning experience.</span>
          </div>

          <div className="feature-card">
            <img src={flexible_learning} />
            <span className="header-content-text">Flexible Learning</span>
            <span className="feature-card-content">
              Learn anytime and anywhere on your mobile device,
              giving you convenient access to educational resources and courses.
            </span>
          </div>

          <div className="feature-card">
            <img src={interaction} />
            <span className="header-content-text">interaction</span>
            <span className="feature-card-content">
              Chat and comment to interact and share knowledge with your instructors.
            </span>
          </div>
        </div>
      </div>
      {/* <div className="join-now">
        <span
          onClick={() => navigate('/register')}
        >JOIN US NOW</span>
      </div> */}
    </>
  );
};

export default AboutUs;
