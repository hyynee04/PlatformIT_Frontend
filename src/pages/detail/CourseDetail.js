import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Detail.css";

import { FaDollarSign, FaGraduationCap, FaRegFile } from "react-icons/fa6";
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

import StarRatings from "react-star-ratings";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";

import DiagSuccessfully from "../../components/diag/DiagSuccessfully";
import { APIStatus, Role } from "../../constants/constants";
import {
  getCourseDetail,
  getIsEnRolledCourse,
  getNotificationBoardOfCourse,
  postEnrollCourse,
} from "../../services/courseService";
import CourseDetailTeacher from "./CourseDetailTeacher";

const CourseDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // console.log(">> Course Detail:", addSection);

  const [idRole, setIDRole] = useState(0);
  const [idUser, setIDUser] = useState("");
  const [courseInfo, setCourseInfo] = useState({});
  const [listTestCards, setListTestCards] = useState([]);
  const [notificationBoard, setNotificationBoard] = useState([]);

  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [showedSections, setShowedSections] = useState({});
  const handleIsShowed = (index) => {
    setShowedSections((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the current section's visibility
    }));
  };
  const fetchCourseDetail = async (idCourse) => {
    setLoading(true);
    try {
      let response = await getCourseDetail(idCourse);
      setCourseInfo(response.data);

      // Get Notification Board
      let notifications = await getNotificationBoardOfCourse(idCourse);
      const processedData = notifications.data.map((notification) => ({
        ...notification,
        timestamp: parseRelativeTime(notification.relativeTime),
      }));
      setNotificationBoard(processedData);

      const responseIsEnroll = await getIsEnRolledCourse(idCourse);
      // if (idRole === Role.teacher) {

      // }
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

  // Helper to calculate relative time
  const calculateRelativeTime = (timestamp) => {
    const now = new Date();
    const difference = Math.floor((now - timestamp) / 1000); // Difference in seconds

    if (difference < 60) return `${difference} seconds ago`;
    if (difference < 3600) return `${Math.floor(difference / 60)} minutes ago`;
    if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`;
    return `${Math.floor(difference / 86400)} days ago`;
  };

  // Helper to parse "relativeTime" into a timestamp
  const parseRelativeTime = (relativeTime) => {
    const now = new Date();
    const parts = relativeTime.split(" ");

    if (parts.includes("seconds")) {
      return new Date(now.getTime() - parseInt(parts[0], 10) * 1000);
    } else if (parts.includes("minutes")) {
      return new Date(now.getTime() - parseInt(parts[0], 10) * 60 * 1000);
    } else if (parts.includes("hours")) {
      return new Date(now.getTime() - parseInt(parts[0], 10) * 3600 * 1000);
    } else if (parts.includes("days")) {
      return new Date(now.getTime() - parseInt(parts[0], 10) * 86400 * 1000);
    }
    return now; // Default to current time if unrecognized format
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

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
      setIDUser(parseInt(state.idUser));
      setIDRole(parseInt(state.idRole));
      fetchCourseDetail(state.idCourse);
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Remove the item if the user refreshes or leaves the page
      if (location.pathname === "/courseDetail") {
        localStorage.removeItem("menuIndex");
      }
    };
    // Handle refresh scenarios
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      // Handle navigation away from the page
      if (location.pathname !== "/courseDetail") {
        localStorage.removeItem("menuIndex");
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]); // Re-run when the path changes

  const reviews = courseInfo?.rateModels || [];

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  // Calculate total pages
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  // Get reviews for the current page
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);
  // Generate pagination display numbers
  const getPagination = () => {
    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      // Logic for more than 5 pages
      if (currentPage <= 3) {
        // Show first few pages if current page is near the start
        return [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages if current page is near the end
        return [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        // Show current page in the middle with surrounding pages
        return [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
  };

  const paginationNumbers = getPagination();

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
        setIsEnrolledCourse(true);
      }
      //   openSuccessModal();
    } else {
      navigate("/login");
    }
  };

  console.log(idRole);
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="detail-container">
      <div className="left-container">
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
              <FaDollarSign color="#003B57" />
              <span className="discount-price">
                {courseInfo.price || "Free"}
              </span>
              {/* <span className='initial-price'>300</span> */}
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
                {`${courseInfo.studentCount} ${courseInfo.studentCount > 1 ? "students" : "student"
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
                  {`${courseInfo.teacherCourseCount} ${courseInfo.teacherCourseCount > 1 ? "courses" : "course"
                    }`}
                </span>
              </div>
            </div>
          </div>
          {idUser && idRole === Role.student && isEnrolledCourse && (
            <>
              <button className="chat-button">
                Chat <RiChat3Line />
              </button>
            </>
          )}
        </div>

        {reviews && reviews.length !== 0 && (
          <div className="block-container">
            <div className="block-container-header">
              <span className="block-container-title">Review</span>
              {idUser && idRole === Role.student && isEnrolledCourse && (
                <button className="add-review-button">
                  <LuPlus /> Add review
                </button>
              )}
            </div>
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
        )}
      </div>

      <div className="right-container">
        {idUser && idRole === Role.teacher ? (
          <CourseDetailTeacher
            courseInfo={courseInfo}
            idUser={idUser}
            setAddedNotification={setAddedNotification}
            notificationBoard={notificationBoard}
            fetchCourseDetail={fetchCourseDetail}
          />) : null}

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
                      value={53}
                      text="8/15"
                    />
                  </div>
                </div>

                <div className="progress-section">
                  <label>Assignments</label>
                  <div className="progress-container">
                    <CircularProgressbar
                      strokeWidth={12}
                      value={57}
                      text="4/7"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="block-container">
              <span className="block-container-title">Notification Board</span>
              <div className="block-container-col noti-size">
                <div className="notification">
                  <div className="notification-body">
                    <span className="notification-title">Title</span>
                    <span className="notification-content">
                      Body text for whatever you’d like to say. Add main
                      takeaway points, quotes, anecdotes, or even a very very
                      short story.
                    </span>

                    <span className="noti-time">13.hr</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {idRole !== Role.teacher ? (
          <>
            {courseInfo.sectionsWithCourses &&
              courseInfo.sectionsWithCourses.length > 0 && (
                <div className="block-container">
                  <div className="block-container-header">
                    <span className="block-container-title">
                      Course Content
                    </span>
                    <span className="block-container-sub-title">
                      {courseInfo.sectionsWithCourses
                        ? `${courseInfo.sectionsWithCourses.length} ${courseInfo.sectionsWithCourses.length === 1
                          ? "section"
                          : "sections"
                        }`
                        : "0 section"}{" "}
                      -{" "}
                      {`${numberOfLectures} ${numberOfLectures >= 1 ? "lecture" : "lectures"
                        }`}
                    </span>
                  </div>

                  <div className="block-container-col">
                    {courseInfo.sectionsWithCourses.map((section, index) => (
                      <div key={index} className="lecture">
                        <div
                          className={`lecture-header ${showedSections[index] ? "" : "change-border-radius"
                            } `}
                        >
                          <span className="section-name">
                            {section.sectionName}
                          </span>
                          <div className="section-info">
                            <span className="section-name">
                              {section.lectures
                                ? `${section.lectures.length} ${section.lectures.length > 1
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
                            className={`lecture-block ${showedSections[index]
                              ? ""
                              : "adjust-lecture-block"
                              }`}
                          >
                            {section.lectures.map((lecture, index) => (
                              <div key={index} className="lecture-content">
                                <div className="lecture-name">
                                  <span className="lecture-title">
                                    {lecture.lectureTitle}
                                  </span>
                                  <span className="lecture-exercise-num">
                                    {`${lecture.exerciseCount} ${lecture.exerciseCount > 1
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
                </div>
              )}

            {courseInfo.tests && courseInfo.tests.length !== 0 && (
              <div className="block-container">
                <span className="block-container-title">Test</span>
                <div className="block-container-col">
                  {courseInfo.tests.map((test, index) => (
                    <div key={index} className="qualification test">
                      <div className="qualification-body">
                        <div className="test-header">
                          <span className="test-name">
                            {test.assignmentTitle}
                          </span>
                          {idUser && idRole === Role.student ? (
                            <div className="test-info">
                              Due: 09/15/2024, 23:59
                            </div>
                          ) : // <div className="test-info">Submitted <FiCheckSquare /></div>
                            // <div className="test-info past-due">Past Due</div>
                            null}
                        </div>

                        <div className="test-description">
                          <span>
                            <LuFileEdit /> Manual
                          </span>
                          {test.duration && (
                            <span>
                              <LuClock /> {test.duration} mins
                            </span>
                          )}
                          <span>
                            <LuFileQuestion /> {test.maxScore} questions
                          </span>
                          <span>
                            <LuCalendar />
                            Due date: 11/20/2024
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
