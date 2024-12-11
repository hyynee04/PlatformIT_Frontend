import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Detail.css";

import { FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  LuCalendar,
  LuClock,
  LuFileEdit,
  LuFileQuestion,
  LuPlus,
} from "react-icons/lu";
import { RiChat3Line, RiGroupLine } from "react-icons/ri";
import { TbCurrencyDong } from "react-icons/tb";

import StarRatings from "react-star-ratings";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";

import { FiCheckSquare } from "react-icons/fi";
import DiagSuccessfully from "../../components/diag/DiagSuccessfully";
import { APIStatus, Role } from "../../constants/constants";
import {
  calculateRelativeTime,
  formatDate,
  formatDateTime,
  getPagination,
  isPastDateTime,
  parseRelativeTime,
} from "../../functions/function";
import {
  getCourseDetail,
  getCourseProgressByIdStudent,
  getIsEnRolledCourse,
  getNotificationBoardOfCourse,
  postEnrollCourse,
} from "../../services/courseService";
import CourseDetailTeacher from "./CourseDetailTeacher";
import { IoReloadOutline } from "react-icons/io5";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { getTestOfCourseStudent } from "../../services/assignmentService";

const CourseDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");
  const [courseInfo, setCourseInfo] = useState({});
  const [notificationBoard, setNotificationBoard] = useState([]);
  const [studentProgress, setStudentProgress] = useState({});
  const [index, setIndex] = useState(null);

  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [showedSections, setShowedSections] = useState({});
  const handleIsShowed = (index) => {
    setShowedSections((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the current section's visibility
    }));
  };
  const fetchCourseDetail = async (idCourse, idRole, idUser) => {
    setLoading(true);
    try {
      let response = await getCourseDetail(idCourse);
      setCourseInfo(response.data);

      if (idRole === Role.student || idRole === Role.teacher) {
        // Get Notification Board
        let notifications = await getNotificationBoardOfCourse(idCourse);
        if (notifications.status === APIStatus) {
          const processedData = notifications.data.map((notification) => ({
            ...notification,
            timestamp: parseRelativeTime(notification.relativeTime),
          }));
          setNotificationBoard(processedData);
        } else {
          console.warn("Error fetching data: ", notifications.data);
        }
      }

      const responseIsEnroll = await getIsEnRolledCourse(idCourse);
      if (responseIsEnroll.data === true) {
        setIsEnrolledCourse(true);
      } else {
        setIsEnrolledCourse(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const fetchCourseProgress = async (idCourse, idStudent) => {
    setLoading(true);
    try {
      let progress = await getCourseProgressByIdStudent(idCourse, idStudent);
      if (progress.status === APIStatus.success) {
        console.log("Response data: ", progress.data);

        setStudentProgress(progress.data);
      } else {
        console.warn(progress.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestOfCourseStudent = async (idCourse, idUser) => {
    let response = await getTestOfCourseStudent(idCourse, idUser);
    if (response.status === APIStatus.success) {
      setCourseInfo((prev) => ({
        ...prev,
        tests: [
          ...response.data.map((test) => {
            return {
              ...test,
              isPublish: true,
            };
          }),
        ],
      }));
    } else console.warn(response.data);
  };

  useEffect(() => {
    if (isEnrolledCourse) {
      fetchCourseProgress(courseInfo.idCourse, idUser);
      fetchTestOfCourseStudent(courseInfo.idCourse, idUser);
    }
  }, [isEnrolledCourse]);

  // Number of lectures
  const numberOfLectures = courseInfo.sectionsWithCourses
    ? courseInfo.sectionsWithCourses.reduce((total, section) => {
        return total + (section.lectures ? section.lectures.length : 0);
      }, 0)
    : 0;

  const getCourseStatus = (course) => {
    const currentDate = new Date();
    const registStart = new Date(course.registStartDate);
    const registEnd = new Date(course.registEndDate);
    const courseStart = new Date(course.courseStartDate);
    const courseEnd = new Date(course.courseEndDate);

    if (currentDate >= registStart && currentDate <= registEnd) {
      return `Registrating (${formatDate(
        course.registStartDate
      )} - ${formatDate(course.registEndDate)})`;
    } else if (currentDate > registEnd && currentDate < courseStart) {
      return "End registration";
    } else if (currentDate >= courseStart && currentDate <= courseEnd) {
      return "On going";
    } else if (currentDate > courseEnd) {
      return "Course end";
    } else {
      return "Upcoming";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const state = location.state;
    if (state) {
      // setIDUser(parseInt(state.idUser));
      // setIDRole(parseInt(state.idRole));
      fetchCourseDetail(
        state.idCourse,
        parseInt(state.idRole),
        parseInt(state.idUser)
      );
    }
    const interval = setInterval(() => {
      setNotificationBoard((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          relativeTime: calculateRelativeTime(notification.timestamp),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const reviews = courseInfo?.rateModels || [];

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  // Calculate total pages
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  // Get reviews for the current page
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  // Generate pagination display numbers

  const paginationNumbers = getPagination(currentPage, totalPages);

  //REGIST COURSE
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState(false);

  const openSuccessModal = () => setIsModalSuccessOpen(true);
  const closeSuccessModal = () => setIsModalSuccessOpen(false);

  const handleBuyCourse = async () => {
    let idUser = +localStorage.getItem("idUser");
    if (idUser) {
      const response = await postEnrollCourse(courseInfo.idCourse);
      if (response.status === APIStatus.success) {
        openSuccessModal();
        // fetchCourseDetail(courseInfo.idCourse, idRole);
        setIsEnrolledCourse(true);
      }
      //   openSuccessModal();
    } else {
      navigate("/login");
    }
  };

  console.log(studentProgress);

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
            className="biography-ava center"
            src={courseInfo.pathImg || default_image}
            alt="course background"
          />
          <div className="biography-block">
            <span className="biography-name center">
              {courseInfo.courseTitle}
            </span>
            <div className="course-card-price">
              <span className="discount-price">
                {courseInfo.discountedPrice
                  ? `${courseInfo.discountedPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                  : courseInfo.price
                  ? `${courseInfo.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                  : "Free"}
                {courseInfo.price && <TbCurrencyDong />}
              </span>
              {courseInfo.discountedPrice && (
                <span className="initial-price">
                  {courseInfo.price
                    ? `${courseInfo.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
                    : "Free"}
                  {courseInfo.price && <TbCurrencyDong />}
                </span>
              )}
            </div>
            {courseInfo.tags && courseInfo.tags.length > 0 && (
              <div className="tag-container">
                {courseInfo.tags.map((tag, index) => (
                  <div key={index} className="tag-content">
                    {tag}
                  </div>
                ))}
              </div>
            )}

            <div className="center-information">
              {courseInfo.courseStartDate ? (
                <>
                  <span className="number-course">
                    <LuClock color="#757575" />
                    {formatDate(courseInfo.courseStartDate)} -{" "}
                    {formatDate(courseInfo.courseEndDate)}
                  </span>
                  <span className="number-course" style={{ color: "#003B57" }}>
                    <LuCalendar color="#757575" /> {getCourseStatus(courseInfo)}
                  </span>
                </>
              ) : (
                <span className="number-course">
                  <LuClock color="#757575" /> Create on:&nbsp;
                  {formatDate(courseInfo.createdDate)}
                </span>
              )}

              <span className="">
                <RiGroupLine color="#757575" />
                {`${courseInfo.studentCount} ${
                  courseInfo.studentCount > 1 ? "students" : "student"
                }`}
              </span>
              <span>{courseInfo.introduction}</span>
            </div>
            {(idRole === Role.student || !idRole) &&
              !isEnrolledCourse &&
              (!courseInfo.registStartDate || !courseInfo.registEndDate ? (
                <button onClick={handleBuyCourse}>Buy Now</button>
              ) : new Date() >= new Date(courseInfo.registStartDate) &&
                new Date() <= new Date(courseInfo.registEndDate) ? (
                <button onClick={handleBuyCourse}>Buy Now</button>
              ) : (
                <button disabled>Can't buy now</button>
              ))}
          </div>
        </div>

        <div className="block-container">
          <span className="block-container-title">Center</span>
          <div
            className="block-container-row center"
            onClick={() => {
              navigate("/centerDetail", {
                state: {
                  idCenter: courseInfo.idCenter,
                  idUser: localStorage.getItem("idUser"),
                  idRole: localStorage.getItem("idRole"),
                },
              });
            }}
          >
            <img
              src={courseInfo.centerAvatarPath || default_image}
              alt="center background"
            />
            <div className="center-block">
              <span className="name-center">{courseInfo.centerName}</span>
              <span className="quote-center">
                {courseInfo.centerDescription}
              </span>
            </div>
          </div>
        </div>

        <div className="block-container">
          <span className="block-container-title">Teacher</span>
          <div
            className="block-container-col teacher"
            onClick={() => {
              navigate("/teacherDetail", {
                state: {
                  idTeacher: courseInfo.idTeacher,
                  idRole: localStorage.getItem("idRole"),
                  idUser: localStorage.getItem("idUser"),
                },
              });
            }}
          >
            <div className="teacher-header">
              <img
                className="small-ava"
                src={courseInfo.teacherAvatarPath || default_ava}
                alt=""
              />
              <span className="teacher-name">
                {courseInfo.teacherName || "(unknown)"}
              </span>
            </div>
            <div className="biography-block">
              <div className="teacher-information">
                {courseInfo.teacherDescription && (
                  <span className="biography-brand">
                    {courseInfo.teacherDescription}
                  </span>
                )}

                <span className="teaching-major">
                  <FaGraduationCap color="#757575" />{" "}
                  {courseInfo.teachingMajor || "(no major)"}
                </span>
                <span className="number-course">
                  <FaRegFile color="#757575" />
                  {`${courseInfo.teacherCourseCount} ${
                    courseInfo.teacherCourseCount > 1 ? "courses" : "course"
                  }`}
                </span>
              </div>
            </div>
          </div>
          {idUser && idRole === Role.student && isEnrolledCourse ? (
            <>
              <button className="chat-button">
                Chat <RiChat3Line />
              </button>
            </>
          ) : null}
        </div>

        <div className="block-container">
          <div className="block-container-header">
            <span className="block-container-title">Review</span>
            {idUser && idRole === Role.student && isEnrolledCourse && (
              <button className="add-review-button">
                <LuPlus /> Add review
              </button>
            )}
          </div>
          {reviews && reviews.length !== 0 && (
            <div className="block-container-col">
              {currentReviews.map((review, index) => (
                <div key={index} className="review-content">
                  <img
                    className="small-ava"
                    src={review.raterAvatarPath || default_image}
                    alt="Rater Avatar"
                  />
                  <div className="review-body">
                    <span className="review-name">{review.raterName}</span>
                    <StarRatings
                      rating={review.ratePoint}
                      starRatedColor="rgb(255, 204, 0)"
                      starDimension="1.3rem"
                      starSpacing="2px"
                      numberOfStars={5}
                      name="rating"
                    />
                    <span className="review-title">{review.rateContent}</span>
                    <span className="review-date">03/03/2024</span>
                  </div>
                </div>
              ))}
              <div className="pagination-controls">
                {paginationNumbers.map((number, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof number === "number" && setCurrentPage(number)
                    }
                    className={number === currentPage ? "active" : ""}
                    disabled={number === "..."}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="total-rating">
            {courseInfo.totalRatePoint}/5
            <StarRatings
              rating={1}
              starRatedColor="rgb(255, 204, 0)"
              // changeRating={this.changeRating}
              starDimension="1.5rem"
              numberOfStars={1}
              name="rating"
            />
          </div>
        </div>
      </div>

      <div className="right-container slide-to-left">
        {idUser &&
        idRole === Role.teacher &&
        courseInfo.idTeacher === idUser ? (
          <CourseDetailTeacher
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            idUser={idUser}
            setAddedNotification={setAddedNotification}
            notificationBoard={notificationBoard}
            fetchCourseDetail={fetchCourseDetail}
          />
        ) : null}

        {/* Student View */}
        {idUser && idRole === Role.student && isEnrolledCourse ? (
          <>
            <div className="block-container course-progress-container">
              <div className="block-container-row">
                <div className="progress-section">
                  <label>Lectures</label>
                  <div className="progress-container">
                    <CircularProgressbar
                      strokeWidth={12}
                      value={`${
                        studentProgress.lectureCount > 0
                          ? (studentProgress.courseStudentProgress[0]
                              .finishedLectureCount /
                              studentProgress.LectureCount) *
                            100
                          : 0
                      }`}
                      text={`${
                        studentProgress.courseStudentProgress?.length > 0 &&
                        `${studentProgress.courseStudentProgress[0].finishedLectureCount}/${studentProgress.lectureCount}`
                      }`}
                    />
                  </div>
                </div>

                <div className="progress-section">
                  <label>Assignments</label>
                  <div className="progress-container">
                    <CircularProgressbar
                      strokeWidth={12}
                      value={`${
                        studentProgress.assignmentCount > 0
                          ? (studentProgress.courseStudentProgress[0]
                              .finishedAssignmentCount /
                              studentProgress.assignmentCount) *
                            100
                          : 0
                      }`}
                      text={`${
                        studentProgress.courseStudentProgress?.length > 0 &&
                        `${studentProgress.courseStudentProgress[0]?.finishedAssignmentCount}/${studentProgress.assignmentCount}`
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="block-container student">
              <span className="block-container-title">Notification Board</span>
              <div className="block-container-col noti-size">
                {notificationBoard.length > 0 &&
                  notificationBoard.map((notification, index) => (
                    <div key={index} className="notification">
                      <div className="notification-body">
                        <span className="notification-content">
                          {notification.content}
                        </span>

                        <span className="noti-time">
                          {notification.relativeTime}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : null}

        {idRole !== Role.teacher || idUser !== courseInfo.idTeacher ? (
          <>
            <div
              className={`block-container ${
                isEnrolledCourse ? "student" : "content-test"
              }`}
            >
              <div className="block-container-header">
                <span className="block-container-title">Course Content</span>
                <span className="block-container-sub-title">
                  {courseInfo.sectionsWithCourses
                    ? `${courseInfo.sectionsWithCourses.length} ${
                        courseInfo.sectionsWithCourses.length > 1
                          ? "sections"
                          : "section"
                      }`
                    : "0 section"}{" "}
                  -{" "}
                  {`${numberOfLectures} ${
                    numberOfLectures >= 1 ? "lectures" : "lecture"
                  }`}
                </span>
              </div>
              {courseInfo.sectionsWithCourses &&
                courseInfo.sectionsWithCourses.length > 0 && (
                  <div className="block-container-col">
                    {courseInfo.sectionsWithCourses.map((section, index) => (
                      <div key={index} className="lecture">
                        <div
                          className={`lecture-header ${
                            showedSections[index] ? "" : "change-header"
                          } `}
                          onClick={() => handleIsShowed(index)}
                        >
                          <span className="section-name">
                            {section.sectionName}
                          </span>
                          <div className="section-info">
                            <span className="section-name">
                              {section.lectures
                                ? `${section.lectures.length} ${
                                    section.lectures.length > 1
                                      ? "lectures"
                                      : "lecture"
                                  }`
                                : "0 lecture"}
                            </span>
                            <button
                              className="showhide-button"
                              onClick={() => handleIsShowed(index)}
                              disabled={section.lectures.length === 0}
                            >
                              {showedSections[index] ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </button>
                          </div>
                        </div>
                        {section.lectures && (
                          <div
                            className={`lecture-block ${
                              showedSections[index]
                                ? ""
                                : "adjust-lecture-block"
                            }`}
                          >
                            {section.lectures.map((lecture, index) => (
                              <div
                                key={index}
                                className={`lecture-content ${
                                  isEnrolledCourse ? "" : "nohover"
                                } `}
                                onClick={() => {
                                  if (isEnrolledCourse)
                                    navigate("/viewLecture", {
                                      state: {
                                        idCourse: courseInfo.idCourse,
                                        idSection: section.idSection,
                                        idLecture: lecture.idLecture,
                                      },
                                    });
                                }}
                              >
                                <div className="lecture-name">
                                  <span className="lecture-title">
                                    {lecture.lectureTitle}
                                  </span>
                                  <span className="lecture-exercise-num">
                                    {`${lecture.exerciseCount} ${
                                      lecture.exerciseCount > 1
                                        ? "exercises"
                                        : "exercise"
                                    }`}
                                  </span>
                                </div>
                                <span className="lecture-description">
                                  {lecture.lectureIntroduction}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {courseInfo.isLimitedTime ? (
              <div
                className={`block-container ${
                  isEnrolledCourse ? "student" : "content-test"
                }`}
              >
                <div className="block-container-header">
                  <span className="block-container-title">Tests</span>
                  <span className="block-container-sub-title">
                    {courseInfo.tests
                      ? `${courseInfo.tests.length} ${
                          courseInfo.tests.length > 1 ? "tests" : "test"
                        }`
                      : "0 test"}{" "}
                  </span>
                </div>
                {courseInfo.tests && courseInfo.tests.length > 0 && (
                  <div className="block-container-col">
                    {courseInfo.tests.map((test, index) => (
                      <>
                        {test.isPublish ? (
                          <div key={index} className="qualification test">
                            <div className="qualification-body">
                              <div className="test-header">
                                <span className="test-name">
                                  {test.assignmentTitle}
                                </span>
                                {idUser &&
                                isEnrolledCourse &&
                                idRole === Role.student ? (
                                  <>
                                    {test.isSubmitted ? (
                                      <div className="test-info submitted">
                                        Submitted <FiCheckSquare />
                                      </div>
                                    ) : test.dueDate &&
                                      isPastDateTime(test.dueDate) ? (
                                      <div className="test-info past-due">
                                        Past Due
                                      </div>
                                    ) : (
                                      test.dueDate && (
                                        <div className="test-info">
                                          {test.dueDate
                                            ? formatDateTime(test.dueDate)
                                            : formatDateTime(
                                                courseInfo.courseEndDate
                                              )}
                                        </div>
                                      )
                                    )}
                                  </>
                                ) : null}
                              </div>

                              <div className="test-description">
                                {test.assignmentType && (
                                  <span>
                                    <LuFileEdit /> {test.assignmentTypeDesc}
                                  </span>
                                )}
                                {test.duration > 0 && (
                                  <span>
                                    <LuClock /> {test.duration} mins
                                  </span>
                                )}
                                {test.questionQuantity > 0 && (
                                  <span>
                                    <LuFileQuestion /> {test.questionQuantity}{" "}
                                    questions
                                  </span>
                                )}
                                {test.dueDate && (
                                  <span>
                                    <LuCalendar />
                                    {formatDate(test.dueDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div>
        <DiagSuccessfully
          isOpen={isModalSuccessOpen}
          onClose={closeSuccessModal}
          notification={
            "Congratulations! You have successfully enrolled in the course."
          }
        />
        <DiagSuccessfully
          isOpen={addedNotification}
          onClose={() => setAddedNotification(false)}
          notification={"Successfully post a new notification to board."}
        />
      </div>
    </div>
  );
};

export default CourseDetail;
