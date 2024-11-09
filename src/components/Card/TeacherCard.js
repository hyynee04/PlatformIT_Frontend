import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import default_ava from "../../assets/img/default_ava.png";
import "../../assets/scss/card/Card.css";

const TeacherCard = (props) => {
  const navigate = useNavigate();
  const { teacher } = props;
  return (
    <div
      className="card-container hover"
      onClick={() => {
        navigate("/teacherDetail", {
          state: {
            idTeacher: teacher.idUser,
            idRole: localStorage.getItem("idRole"),
            idUser: localStorage.getItem("idUser")
          },
        });
      }}
    >
      <div className="teacher-card-container">
        <img
          src={teacher.avatarPath || default_ava}
          alt="teacher avatar"
        />
        <div className="teacher-card-body">
          <span className="teacher-card-title add-min-height">
            {teacher.name || teacher.fullName || ""}
          </span>
          <div className="teacher-card-info">
            <FaGraduationCap color="#757575" />
            {teacher.teachingMajor !== null
              ? teacher.teachingMajor
              : ""}
          </div>
          <div className="teacher-card-info">
            <FaRegFile color="#757575" />
            {`${teacher.coursesCount || teacher.courseCount || 0} ${(teacher.coursesCount > 1 || teacher.courseCount > 1) ? "courses" : "course"}`} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
