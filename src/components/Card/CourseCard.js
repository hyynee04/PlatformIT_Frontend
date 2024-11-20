import { useState } from "react";
import { LuBuilding2, LuClock, LuDollarSign, LuStar } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/card/Card.css";

const CourseCard = (props) => {
  const navigate = useNavigate();
  const { course } = props;
  const [isHover, setIsHover] = useState(false);

  const longest_tag =
    course.tags && course.tags.length > 0
      ? course.tags.reduce((longest, current) =>
          current.length > longest.length ? current : longest
        )
      : "";
  const remain_tag_number = course.tags ? course.tags.length - 1 : 0;

  // format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

  const getCourseStatus = (course) => {
    const currentDate = new Date();
    const registStart = new Date(course.registStartDate);
    const registEnd = new Date(course.registEndDate);
    const courseStart = new Date(course.courseStartDate);
    const courseEnd = new Date(course.courseEndDate);

    if (currentDate >= registStart && currentDate <= registEnd) {
      return "Registrating";
    } else if (currentDate >= registEnd && currentDate <= courseStart) {
      return "Registration end";
    } else if (currentDate >= courseStart && currentDate <= courseEnd) {
      return "On going";
    } else if (currentDate > courseEnd) {
      return "Course end";
    } else {
      return "Upcoming";
    }
  };

  const status = getCourseStatus(course);
  return (
    <div className="outside-card">
      <div className="card-container">
        <div
          className="course-card-container"
          onMouseEnter={() => setIsHover(true)}
        >
          <img
            src={course.pathImg !== null ? course.pathImg : default_image}
            alt="course image"
          />

          <div className="course-card-body">
            <span className="course-card-title">{course.courseTitle}</span>
            {course.tags && course.tags.length > 0 && (
              <div className="course-card-tag-container">
                <div className="tag-content">{longest_tag}</div>
                {remain_tag_number > 0 && (
                  <div className="tag-content-more">+{remain_tag_number}</div>
                )}
              </div>
            )}
            <div className="course-card-info-container">
              {course.isLimitedTime === 1 ? (
                <div className="course-card-info">
                  {" "}
                  <LuClock color="#757575" />
                  {formatDate(course.courseStartDate)} -{" "}
                  {formatDate(course.courseEndDate)}
                </div>
              ) : (
                <div className="course-card-info">
                  {" "}
                  <LuClock color="#757575" /> Created on{" "}
                  {formatDate(course.createdDate)}
                </div>
              )}
            </div>
          </div>

          <div className="course-card-footer">
            <div className="course-card-price">
              <LuDollarSign color="#757575" />
              <span className="discount-price">{course.price || "Free"}</span>
              {/* <span className='initial-price'>300</span> */}
            </div>
            {course.isLimitedTime === 1 && (
              <div className="course-card-period">{status}</div>
            )}
          </div>
        </div>
      </div>

      {isHover && (
        <div
          className="card-container card-container-hover"
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="course-card-container course-card-hover">
            <img
              src={course.pathImg !== null ? course.pathImg : default_image}
              alt="course image"
            />

            <div className="course-card-body course-card-body-hover">
              <span className="course-card-title title-hover">
                {course.courseTitle}
              </span>
              <span className="course-card-quote">
                {course.introduction !== ""
                  ? course.introduction
                  : "(no introduction"}
              </span>

              {course.tags && course.tags.length > 0 && (
                <div className="course-card-tag-container">
                  <div className="tag-content">{longest_tag}</div>
                  {remain_tag_number > 0 && (
                    <div className="tag-content-more">+{remain_tag_number}</div>
                  )}
                </div>
              )}

              <div className="course-card-info-container">
                <div className="course-card-info">
                  {" "}
                  <LuBuilding2 color="#757575" /> {course.centerName}
                </div>
                {course.isLimitedTime === 1 ? (
                  <div className="course-card-info">
                    {" "}
                    <LuClock color="#757575" />
                    {formatDate(course.courseStartDate)} -{" "}
                    {formatDate(course.courseEndDate)}
                  </div>
                ) : (
                  <div className="course-card-info">
                    {" "}
                    <LuClock color="#757575" /> Created on{" "}
                    {formatDate(course.createdDate)}
                  </div>
                )}
                <div className="course-card-info">
                  <RiGroupLine color="#757575" /> {course.studentCount} &nbsp;
                  <LuStar color="#757575" /> {course.rate}/5
                </div>
              </div>
            </div>

            <div className="course-card-footer">
              <div className="course-card-price">
                <LuDollarSign color="#757575" />
                <span className="discount-price">{course.price || "Free"}</span>
                {/* <span className='initial-price'>300</span> */}
              </div>
              <button
                className="view-detail-btn"
                onClick={() => {
                  navigate("/courseDetail", {
                    state: {
                      idCourse: course.idCourse,
                      idUser: localStorage.getItem("idUser"),
                      idRole: localStorage.getItem("idRole"),
                    },
                  });
                }}
              >
                View Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
