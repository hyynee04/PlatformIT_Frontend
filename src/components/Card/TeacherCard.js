import "../../assets/scss/card/Card.css";
import { useState } from "react";
import default_ava from "../../assets/img/default_ava.png";
import { FaGraduationCap, FaRegFile } from "react-icons/fa6";

const TeacherCard = (props) => {
  const { teacher } = props;
  return (
    <div className="card-container">
      <div className="teacher-card-container">
        <img
          src={teacher.avatarPath !== "" ? teacher.avatarPath : default_ava}
          alt="teacher avatar"
        />
        <div className="teacher-card-body">
          <span className="teacher-card-title add-min-height">
            {teacher.name !== null ? teacher.name : "(unknown)"}
          </span>
          <div className="teacher-card-info">
            <FaGraduationCap color="#757575" />{" "}
            {teacher.teachingMajor !== null
              ? teacher.teachingMajor
              : "(unknown)"}
          </div>
          <div className="teacher-card-info">
            <FaRegFile color="#757575" />
            {teacher.coursesCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
