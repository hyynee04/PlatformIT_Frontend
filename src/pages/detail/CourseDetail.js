import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Detail.css";

import { FaCircleCheck, FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  LuCalendar,
  LuClock,
  LuFileEdit,
  LuFileQuestion,
  LuPenLine,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { RiChat3Line, RiGroupLine } from "react-icons/ri";
import { TbCurrencyDong } from "react-icons/tb";

import StarRatings from "react-star-ratings";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";

import { FiCheckSquare } from "react-icons/fi";
import DiagSuccessfully from "../../components/diag/DiagSuccessfully";
import { APIStatus, LectureStatus, Role } from "../../constants/constants";
import {
  calculateRelativeTime,
  formatDate,
  formatDateTime,
  getPagination,
  isPastDateTime,
  parseRelativeTime,
} from "../../functions/function";
import {
  getAllRatingsOfCourse,
  getCourseContentStructure,
  getCourseDetail,
  getCourseProgressByIdStudent,
  getIsChatAvailable,
  getIsEnRolledCourse,
  getSectionDetail,
  postAddReview,
  postEnrollCourse,
} from "../../services/courseService";
import CourseDetailTeacher from "./CourseDetailTeacher";
import { getTestOfCourseStudent } from "../../services/assignmentService";
import DiagDeleteConfirmation from "../../components/diag/DiagDeleteConfirmation";
import DiagBuyCourseConfirmation from "../../components/diag/DiagBuyCourseConfirmation";
import {
  getNotificationBoardOfCourse,
  postReadNotificationBoard,
} from "../../services/notificationService";

const CourseDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingAddReview, setLoadingAddReview] = useState(false);

  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");
  const [courseInfo, setCourseInfo] = useState({});
  const [notificationBoard, setNotificationBoard] = useState([]);
  const [studentProgress, setStudentProgress] = useState({});
  const [idSection, setIdSection] = useState(null);

  const [isAddReview, setIsAddReview] = useState(false);
  const [rating, setRating] = useState({ content: "", number: 0 });

  const [isRemoved, setIsRemoved] = useState(false);
  const [reviewRemoved, setReviewRemoved] = useState(null);
  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const [isChatAvailable, setIsChatAvailable] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [idNotiRemoved, setIdNotiRemoved] = useState(null);
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

      if (response.status === APIStatus.success) {
        setCourseInfo({
          ...response.data,
          rateModels: response.data.rateModels
            .map((rate) => ({
              ...rate,
              timestamp: parseRelativeTime(rate.relativeTime),
            }))
            .sort((a, b) => b.idRating - a.idRating),
        });
        if (idRole === Role.student || idRole === Role.teacher) {
          // Get Notification Board
          await fetchNotificationBoard(idCourse);
        }

        if (idRole === Role.student) {
          await fetchCourseContentStructure(idCourse, idUser);

          const responseIsChatAvailable = await getIsChatAvailable(
            Number(localStorage.getItem("idUser")),
            response.data.idTeacher
          );
          if (responseIsChatAvailable.status === APIStatus.success) {
            setIsChatAvailable(responseIsChatAvailable.data === true);
          } else {
            setIsChatAvailable(false);
          }
        } else await fetchCourseContentStructure(idCourse);

        const responseIsEnroll = await getIsEnRolledCourse(idCourse);
        if (responseIsEnroll.data === true) {
          await setIsEnrolledCourse(true);
          fetchTestOfCourseStudent(courseInfo.idCourse, idUser);
        } else {
          setIsEnrolledCourse(false);
        }
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
          ...response.data
            .sort((a, b) => b.idAssignment - a.idAssignment)
            .map((test) => {
              return {
                ...test,
                isPublish: true,
              };
            }),
        ],
      }));
    } else console.warn(response.data);
  };

  const fetchCourseContentStructure = async (idCourse, idUser) => {
    try {
      const response = await getCourseContentStructure(idCourse, idUser);

      if (response.status === APIStatus.success) {
        if (response.data) {
          setCourseInfo((prev) => ({
            ...prev,
            sectionsWithCourses: response.data.sectionStructures,
          })); // Only update if data exists
        } else {
          console.warn("Received empty data for course content structure.");
        }
      } else {
        console.error(
          "Failed to fetch course content structure:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching course content structure:", error);
    }
  };

  const fetchNotificationBoard = async (idCourse) => {
    let notifications = await getNotificationBoardOfCourse(idCourse);
    if (notifications.status === APIStatus.success) {
      const processedData = notifications.data.map((notification) => ({
        ...notification,
        timestamp: parseRelativeTime(notification.relativeTime),
      }));
      setNotificationBoard(processedData);
    } else {
      console.warn("Error fetching data: ", notifications.data);
    }
  };

  const addReview = async (rating) => {
    setLoadingAddReview(true);
    try {
      const respone = await postAddReview(idUser, courseInfo.idCourse, rating);
      if (respone.status === APIStatus.success) {
        setIsAddReview(false);
        fetchReviews(courseInfo.idCourse);
        setRating({ content: "", number: 0 });
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    } finally {
      setLoadingAddReview(false);
    }
  };

  const fetchReviews = async (idCourse) => {
    try {
      const respone = await getAllRatingsOfCourse(idCourse);
      if (respone.status === APIStatus.success) {
        setCourseInfo({
          ...courseInfo,
          rateModels: respone.data
            .map((rate) => ({
              ...rate,
              timestamp: parseRelativeTime(rate.relativeTime),
            }))
            .sort((a, b) => b.idRating - a.idRating),
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const avgRating = (rateModels) => {
    if (!rateModels || rateModels.length === 0) {
      return 0; // Return 0 if the array is empty or undefined
    }

    const totalPoints = rateModels.reduce(
      (sum, rate) => sum + rate.ratePoint,
      0
    );

    // Calculate the average and round it to 1 decimal place
    const avg = totalPoints / rateModels.length;
    const roundedAvg = Math.round(avg * 10) / 10; // Round to one decimal place

    // If the decimal part is .0, return as an integer, else return the rounded value
    return roundedAvg % 1 === 0 ? roundedAvg.toFixed(0) : roundedAvg.toFixed(1);
  };

  const readNotificationBoard = async (idCourse, idUser) => {
    try {
      const response = await postReadNotificationBoard(idCourse, idUser);
      if (response.status !== APIStatus.success) {
        console.error(response.data);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  useEffect(() => {
    if (isEnrolledCourse) {
      fetchCourseProgress(courseInfo.idCourse, idUser);
      fetchTestOfCourseStudent(courseInfo.idCourse, idUser);
      fetchCourseContentStructure(courseInfo.idCourse, idUser);
    }
  }, [isEnrolledCourse]);

  // Number of lectures
  const numberOfLectures = courseInfo.sectionsWithCourses
    ? courseInfo.sectionsWithCourses.reduce((total, section) => {
        return total + section.lectureCount;
      }, 0)
    : 0;

  const countTests = (tests) => {
    return tests.filter(
      (test) => test.isPublish === true || test.isPublish === null
    ).length;
  };

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
      fetchCourseDetail(
        state.idCourse,
        parseInt(state.idRole),
        parseInt(state.idUser)
      );
      if (idRole === Role.student) {
        readNotificationBoard(state.idCourse, parseInt(state.idUser));
      }
    }
    const interval = setInterval(() => {
      setNotificationBoard((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          relativeTime: calculateRelativeTime(notification.timestamp),
        }))
      );

      setCourseInfo((prevCourseInfo) => ({
        ...prevCourseInfo,
        rateModels: prevCourseInfo.rateModels.map((rate) => ({
          ...rate,
          relativeTime: calculateRelativeTime(rate.timestamp),
        })),
      }));
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

  //REMOVE COURSE
  const [isModalRemoveOpen, setIsModalRemoveOpen] = useState(false);

  const openRemoveModal = () => setIsModalRemoveOpen(true);
  const closeRemoveModal = () => setIsModalRemoveOpen(false);

  //REGIST COURSE
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState(false);

  const openSuccessModal = () => setIsModalSuccessOpen(true);
  const closeSuccessModal = () => setIsModalSuccessOpen(false);

  const handleNavigateDetailStudent = (idStudent) => {
    if (idRole !== Role.student) {
      if (idRole === Role.teacher) {
        navigate("/studentdetail", {
          state: {
            idStudent: idStudent,
            idCourse: courseInfo.idCourse,
            courseTitle: courseInfo.courseTitle,
          },
        });
      } else {
        navigate("/studentdetail", {
          state: {
            idStudent: idStudent,
          },
        });
      }
    }
  };

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
            {courseInfo.courseTitle ? (
              <span className="biography-name center">
                {courseInfo.courseTitle}
              </span>
            ) : null}

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
              {courseInfo.introduction ? (
                <span>{courseInfo.introduction}</span>
              ) : null}

              {(idRole === Role.platformAdmin ||
                idRole === Role.centerAdmin ||
                idRole === Role.teacher) && (
                <>
                  <hr style={{ margin: "0.5rem 0" }}></hr>
                  <span>
                    <input
                      type="checkbox"
                      checked={courseInfo.isApprovedLecture}
                      readOnly
                    />{" "}
                    Lecture approval required
                  </span>
                  <span>
                    <input
                      type="checkbox"
                      checked={courseInfo.maxAttendees !== null}
                      readOnly
                    />{" "}
                    Max attendees{" "}
                    {`${
                      courseInfo.maxAttendees
                        ? `: ${courseInfo.maxAttendees}`
                        : ""
                    }`}
                  </span>
                  {idRole === Role.centerAdmin ||
                    (idRole === Role.platformAdmin && (
                      <div className="setting-course">
                        <div className="buttons-container">
                          {idRole === Role.centerAdmin && (
                            <button
                              className="edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/updateCourse", {
                                  state: {
                                    idCourse: courseInfo.idCourse,
                                    hasStudent:
                                      courseInfo.studentCount > 0
                                        ? true
                                        : false,
                                  },
                                });
                              }}
                            >
                              <LuPenLine />
                            </button>
                          )}

                          <button
                            className="remove"
                            onClick={() => openRemoveModal()}
                          >
                            <LuTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            {(idRole === Role.student || !idRole) &&
              !isEnrolledCourse &&
              (!courseInfo.registStartDate || !courseInfo.registEndDate ? (
                <button onClick={() => setIsBuying(true)}>Buy Now</button>
              ) : new Date() >= new Date(courseInfo.registStartDate) &&
                new Date() <= new Date(courseInfo.registEndDate) ? (
                <button onClick={() => setIsBuying(true)}>Buy Now</button>
              ) : courseInfo.maxAttendees !== null &&
                courseInfo.studentCount >= courseInfo.maxAttendees ? (
                <button disabled>Fully bought</button>
              ) : (
                <button disabled>Registration closed</button>
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

                {courseInfo.teachingMajor ? (
                  <span className="teaching-major">
                    <FaGraduationCap color="#757575" />{" "}
                    {courseInfo.teachingMajor}
                  </span>
                ) : null}

                <span className="number-course">
                  <FaRegFile color="#757575" />
                  {`${courseInfo.teacherCourseCount} ${
                    courseInfo.teacherCourseCount > 1 ? "courses" : "course"
                  }`}
                </span>
              </div>
            </div>
          </div>
          {idUser && idRole === Role.student && isChatAvailable ? (
            <>
              <button
                className="chat-button"
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      selectedSender: {
                        userId: courseInfo.idTeacher,
                        name: courseInfo.teacherName,
                        avatar: courseInfo.teacherAvatarPath,
                      },
                    },
                  })
                }
              >
                Chat <RiChat3Line />
              </button>
            </>
          ) : null}
        </div>

        <div className="block-container">
          <div className="block-container-header">
            <span className="block-container-title">Review</span>
            {idRole === Role.student && isEnrolledCourse && (
              <button
                className="add-review-button"
                onClick={() => setIsAddReview(!isAddReview)}
              >
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
                    onClick={() => handleNavigateDetailStudent(review.idRater)}
                    style={{
                      cursor: idRole !== Role.student ? "pointer" : "default",
                    }}
                  />
                  <div className="review-body">
                    <div className="review-header">
                      <span
                        className="review-name"
                        onClick={() =>
                          handleNavigateDetailStudent(review.idRater)
                        }
                        style={{
                          cursor:
                            idRole !== Role.student ? "pointer" : "default",
                        }}
                      >
                        {review.raterName}
                      </span>
                      <span className="review-date">{review.relativeTime}</span>
                    </div>

                    <StarRatings
                      rating={review.ratePoint}
                      starRatedColor="rgb(255, 204, 0)"
                      starDimension="1.3rem"
                      starSpacing="2px"
                      numberOfStars={5}
                      name="rating"
                    />
                    <span className="review-title">{review.rateContent}</span>
                    {idRole === Role.platformAdmin && (
                      <button
                        className="delete-review"
                        onClick={() => {
                          setReviewRemoved(review.idRating);
                          setIsRemoved(true);
                        }}
                      >
                        Delete
                      </button>
                    )}
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
            {avgRating(courseInfo.rateModels)}/5
            <StarRatings
              rating={1}
              starRatedColor="rgb(255, 204, 0)"
              // changeRating={this.changeRating}
              starDimension="1.5rem"
              numberOfStars={1}
              name="rating"
            />
          </div>
          <div
            className={`add-review-container ${isAddReview ? "active" : ""}`}
          >
            <span>Add Review</span>
            <StarRatings
              rating={rating.number}
              starRatedColor="rgb(255, 204, 0)"
              starHoverColor="rgb(255, 204, 0)"
              starDimension="1.3rem"
              starSpacing="2px"
              numberOfStars={5}
              name="rating"
              changeRating={(newRating) =>
                setRating({ ...rating, number: newRating })
              }
            />
            <textarea
              placeholder="What do you think about this course..."
              value={rating.content}
              onChange={(e) =>
                setRating({ ...rating, content: e.target.value })
              }
            ></textarea>
            <div className="btns-containter">
              <button
                className="cancel"
                onClick={() => {
                  setRating({ content: "", number: 0 });
                  setIsAddReview(false);
                }}
              >
                Cancel
              </button>
              <button
                className="post"
                onClick={() => {
                  addReview(rating);
                }}
              >
                {loadingAddReview && <ImSpinner2 className="icon-spin" />} Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="right-container slide-to-left">
        {(idRole === Role.teacher && courseInfo.idTeacher === idUser) ||
        idRole === Role.centerAdmin ||
        idRole === Role.platformAdmin ? (
          <CourseDetailTeacher
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            idUser={idUser}
            setAddedNotification={setAddedNotification}
            notificationBoard={notificationBoard}
            fetchCourseDetail={fetchCourseDetail}
            setIsRemoved={setIsRemoved}
            setIdSection={setIdSection}
            fetchSectionDetail={() =>
              fetchCourseContentStructure(courseInfo.idCourse)
            }
            fetchNotificationBoard={() =>
              fetchNotificationBoard(courseInfo.idCourse)
            }
            setIdNotiRemoved={setIdNotiRemoved}
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
                              studentProgress.lectureCount) *
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
                          ? (studentProgress.courseStudentProgress?.length >
                              0 &&
                              studentProgress.courseStudentProgress[0]
                                .finishedAssignmentCount /
                                studentProgress.assignmentCount) * 100
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

        {(idRole !== Role.teacher &&
          idRole !== Role.centerAdmin &&
          idRole !== Role.platformAdmin) ||
        (idRole === Role.teacher && idUser !== courseInfo.idTeacher) ? (
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
                    numberOfLectures > 1 ? "lectures" : "lecture"
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
                          onClick={() => {
                            if (section.lectureCount > 0) handleIsShowed(index);
                          }}
                        >
                          <span className="section-name">
                            {section.sectionName}
                          </span>
                          <div className="section-info">
                            <span className="section-name">
                              {`${section.lectureCount} ${
                                section.lectureCount > 1
                                  ? "lectures"
                                  : "lecture"
                              }`}
                            </span>
                            <button
                              className="showhide-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (section.lectureCount > 0)
                                  handleIsShowed(index);
                              }}
                              disabled={section.lectureCount === 0}
                            >
                              {showedSections[index] ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </button>
                          </div>
                        </div>
                        {section.lectureStructures && (
                          <div
                            className={`lecture-block ${
                              showedSections[index]
                                ? ""
                                : "adjust-lecture-block"
                            }`}
                          >
                            {section.lectureStructures.map((lecture, index) => (
                              <>
                                {lecture.lectureStatus ===
                                  LectureStatus.active && (
                                  <div
                                    key={index}
                                    className={`lecture-content ${
                                      isEnrolledCourse ? "" : "nohover"
                                    } `}
                                    onClick={() => {
                                      if (isEnrolledCourse)
                                        navigate("/viewLecture", {
                                          state: {
                                            idLecture: lecture.idLecture,
                                            idCourse: courseInfo.idCourse,
                                          },
                                        });
                                    }}
                                  >
                                    {idRole === Role.student &&
                                      isEnrolledCourse &&
                                      lecture.isFinishedLecture && (
                                        <FaCircleCheck />
                                      )}

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
                                )}
                              </>
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
                      ? `${countTests(courseInfo.tests)} ${
                          countTests(courseInfo.tests) > 1 ? "tests" : "test"
                        }`
                      : "0 test"}{" "}
                  </span>
                </div>
                {courseInfo.tests && courseInfo.tests.length > 0 && (
                  <div className="block-container-col">
                    {courseInfo.tests.map((test, index) => (
                      <>
                        {test.isPublish ? (
                          <div
                            key={index}
                            className={`qualification test ${
                              idRole !== Role.student ? "nohover" : ""
                            }`}
                            onClick={() => {
                              if (isEnrolledCourse && idRole === Role.student)
                                navigate("/studentAssignDetail", {
                                  state: { idAssignment: test.idAssignment },
                                });
                            }}
                          >
                            <div className="qualification-body">
                              <div className="test-header">
                                <span className="test-name">
                                  {test.assignmentTitle}
                                </span>
                                {isEnrolledCourse && idRole === Role.student ? (
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

      <DiagBuyCourseConfirmation
        isOpen={isBuying}
        onClose={() => setIsBuying(false)}
        idCourse={courseInfo.idCourse}
        status={courseInfo.discountedPrice || courseInfo.price ? 2 : 1}
        paymentData={{
          amount: courseInfo.discountedPrice
            ? courseInfo.discountedPrice
            : courseInfo.price,
          idStudent: idUser,
          idCourse: courseInfo.idCourse,
        }}
        setIsEnrolledCourse={setIsEnrolledCourse}
      />

      <DiagDeleteConfirmation
        isOpen={isRemoved}
        onClose={() => {
          setIsRemoved(false);
          if (reviewRemoved) setReviewRemoved(null);
          if (idNotiRemoved) setIdNotiRemoved(null);
        }}
        object={
          reviewRemoved
            ? {
                id: reviewRemoved,
                name: "review",
                message: "Are you sure to delete this review?",
              }
            : idNotiRemoved
            ? {
                id: idNotiRemoved,
                name: "notificationBoard",
                message: "Are you sure to delete this notification?",
              }
            : {
                id: idSection,
                name: "section",
                message: "Are you sure to delete this section?",
              }
        }
        fetchData={() =>
          reviewRemoved
            ? fetchReviews(courseInfo.idCourse)
            : idNotiRemoved
            ? fetchNotificationBoard(courseInfo.idCourse)
            : fetchCourseContentStructure(courseInfo.idCourse)
        }
      />

      <DiagDeleteConfirmation
        isOpen={isModalRemoveOpen}
        onClose={closeRemoveModal}
        object={{
          id: courseInfo.idCourse,
          name: "course",
        }}
      />

      <DiagSuccessfully
        isOpen={isModalSuccessOpen}
        onClose={closeSuccessModal}
        notification={
          "Congratulations! You have successfully enrolled in the course."
        }
      />
    </div>
  );
};

export default CourseDetail;
