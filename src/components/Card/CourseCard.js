import { useEffect, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { LuBuilding2, LuClock, LuStar } from "react-icons/lu";
import { RiGroupLine } from "react-icons/ri";
import { TbCurrencyDong } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "../../assets/css/card/Card.css";
import default_image from "../../assets/img/default_image.png";
import { formatDate } from "../../functions/function";

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

  const [status, setStatus] = useState(null);
  const courseStatus = {
    1: "Coming soon",
    2: "Registering",
    3: "Starting soon",
    4: "On going",
  };

  const getCourseStatus = (course) => {
    const currentDate = new Date();
    const registStart = new Date(course.registStartDate);
    const registEnd = new Date(course.registEndDate);
    const courseStart = new Date(course.courseStartDate);
    const courseEnd = new Date(course.courseEndDate);

    if (currentDate >= registStart && currentDate <= registEnd) {
      setStatus(2);
    } else if (currentDate >= registEnd && currentDate <= courseStart) {
      setStatus(3);
    } else if (currentDate >= courseStart && currentDate <= courseEnd) {
      setStatus(4);
    } else {
      setStatus(1);
    }
  };

  useEffect(() => {
    getCourseStatus(course);
  }, [course]);

  return (
    <div className="outside-card">
      {(course.isEnrolled ||
        course.idTeacher === +localStorage.getItem("idUser")) && (
        <BsPinAngleFill />
      )}

      <div className="card-container">
        <div
          className="course-card-container"
          onMouseEnter={() => setIsHover(true)}
        >
          {course.isLimitedTime === 1 && (
            <div
              className={`course-card-period ${
                status === 1 || status === 3
                  ? "soon"
                  : status === 2
                  ? "registering"
                  : "ongoing"
              }`}
            >
              {courseStatus[status]}
            </div>
          )}
          <img
            src={course.pathImg !== null ? course.pathImg : default_image}
            alt="course background"
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
                  <LuClock color="#757575" />
                  {formatDate(course.courseStartDate)} -{" "}
                  {formatDate(course.courseEndDate)}
                </div>
              ) : (
                <div className="course-card-info">
                  <LuClock color="#757575" /> Created on&nbsp;
                  {formatDate(course.createdDate)}
                </div>
              )}
            </div>
          </div>

          <div className="course-card-footer">
            <div className="course-card-price">
              <span className="discount-price">
                {course.discountedPrice
                  ? `${course.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                  : course.price
                  ? `${course.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                  : "Free"}
                {course.price && <TbCurrencyDong />}
              </span>
              {course.discountedPrice && (
                <span className="initial-price">
                  {course.price
                    ? `${course.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                    : "Free"}
                  {course.price && <TbCurrencyDong />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isHover && (
        <div
          className="card-container card-container-hover"
          onMouseLeave={() => setIsHover(false)}
        >
          {(course.isEnrolled ||
            course.idTeacher === +localStorage.getItem("idUser")) && (
            <BsPinAngleFill className="pin-hover" />
          )}
          <div className="course-card-container course-card-hover">
            {course.isLimitedTime === 1 && (
              <div
                className={`course-card-period ${
                  status === 1 || status === 3
                    ? "soon"
                    : status === 2
                    ? "registering"
                    : "ongoing"
                }`}
              >
                {courseStatus[status]}
              </div>
            )}
            <img
              src={course.pathImg !== null ? course.pathImg : default_image}
              alt="course background"
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
                <span className="discount-price">
                  {course.price
                    ? `${course.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                    : "Free"}
                  {course.price && <TbCurrencyDong />}
                </span>
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
