import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/Detail.css";

import { FaDollarSign, FaGraduationCap, FaRegFile } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  LuCalendar,
  LuCheckSquare,
  LuClock,
  LuFileEdit,
  LuFileQuestion,
  LuMail,
  LuMinus,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";
import { RiChat3Line, RiGroupLine } from "react-icons/ri";

import StarRatings from "react-star-ratings";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";

import DiagAddSectionForm from "../../components/diag/DiagAddSectionForm";
import DiagSuccessfully from "../../components/diag/DiagSuccessfully";
import { APIStatus, Role } from "../../constants/constants";
import {
  getCourseDetail,
  getIsEnRolledCourse,
  postEnrollCourse,
} from "../../services/courseService";

const CourseDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [isShowed, setIsShowed] = useState(false);
  const [popupAdd, setPopupAdd] = useState(false);
  const [addSection, setAddSection] = useState(false);

  // console.log(">> Course Detail:", addSection);

  const [idRole, setIDRole] = useState(0);
  const [idUser, setIDUser] = useState("");
  const [courseInfo, setCourseInfo] = useState({});
  const [menuIndex, setMenuIndex] = useState(1);

  const [isEnrolledCourse, setIsEnrolledCourse] = useState(false);
  const fetchCourseDetail = async (idCourse) => {
    setLoading(true)
    try {
      let response = await getCourseDetail(idCourse);
      setCourseInfo(response.data);

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

  const handleIsShowed = () => {
    setIsShowed(!isShowed);
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
  }, []);

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
    return <div className="loading-page"><ImSpinner2 color="#397979" /></div>; // Show loading while waiting for API response
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
                  <LuClock color="#757575" /> Create on:{" "}
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
            {/* {new Date() >= new Date(courseInfo.registStartDate) &&
            new Date() <= new Date(courseInfo.registEndDate) ? (
              <button onClick={handleBuyCourse}>Buy Now</button>
            ) : (
              <button disabled>Can't buy now</button>
            )} */}
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
          <div className="teacher-menu">
            <button
              className={`teacher-menu-btn ${menuIndex === 1 ? "active" : ""}`}
              onClick={() => setMenuIndex(1)}
            >
              Main content
            </button>
            <button
              className={`teacher-menu-btn ${menuIndex === 2 ? "active" : ""}`}
              onClick={() => setMenuIndex(2)}
            >
              Notification
            </button>
            <button
              className={`teacher-menu-btn ${menuIndex === 3 ? "active" : ""}`}
              onClick={() => setMenuIndex(3)}
            >
              Attendance
            </button>
          </div>
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
            {courseInfo.sectionsWithCourses && courseInfo.sectionsWithCourses.length > 0 && (
              <div className="block-container">
                <div className="block-container-header">
                  <span className="block-container-title">Course Content</span>
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
                        className={`lecture-header ${isShowed ? "" : "change-border-radius"
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
                            onClick={() => handleIsShowed()}
                            disabled={section.lectures.length === 0}
                          >
                            {isShowed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </button>
                        </div>
                      </div>
                      {section.lectures && (
                        <div
                          className={`lecture-block ${isShowed ? "" : "adjust-lecture-block"
                            }`}
                        >
                          {section.lectures.map((lecture, index) => (
                            <div
                              key={index}
                              className={`lecture-content ${isShowed ? "" : "remove-border"
                                } `}
                            >
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
                    <div key={index} className="qualification">
                      <div className="qualification-body">
                        <div className="test-header">
                          <span className="test-name">
                            {test.assignmentTitle}
                          </span>
                          {idUser && idRole === Role.student && (
                            <div className="test-info">
                              Due: 09/15/2024, 23:59
                            </div>
                            // <div className="test-info">Submitted <FiCheckSquare /></div>
                            // <div className="test-info past-due">Past Due</div>
                          )}
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
            )
            }
          </>
        ) : null}

        {/* Teacher View: Main Content */}
        {idRole === Role.teacher && menuIndex === 1 ? (
          <>
            <div className="block-container">
              <div className="block-container-header">
                <span className="block-container-title">Course Content</span>
                <span className="block-container-sub-title">
                  1 section - 1 lecture
                </span>
              </div>
              <div className="block-container-col">
                <div className="lecture">
                  <div
                    className={`lecture-header ${isShowed ? "" : "change-border-radius"
                      } `}
                  >
                    <span className="section-name">Section 1</span>
                    <div className="section-info">
                      <span className="section-name">1 lecture</span>
                      <button
                        className="showhide-button"
                        onClick={() => handleIsShowed()}
                      >
                        {isShowed ? <IoIosArrowUp /> : <IoIosArrowDown />}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`lecture-block ${isShowed ? "" : "adjust-lecture-block"
                      }`}
                  >
                    <div
                      className={`lecture-content ${isShowed ? "" : "remove-border"
                        } `}
                    >
                      <div className="lecture-name">
                        <span className="lecture-title">Title</span>
                        <span className="lecture-exercise-num">
                          3 exercises
                        </span>
                      </div>
                      <span className="lecture-description">
                        Body text for whatever you’d like to say. Add main
                        takeaway points, quotes, anecdotes, or even a very very
                        short story.
                      </span>
                    </div>
                    <div
                      className={`lecture-content nohover ${isShowed ? "" : "remove-border"
                        } `}
                    >
                      <div className="option-container">
                        <button className="add-lecture">
                          <LuPlus /> Add new lecture
                        </button>
                        <button className="remove-section">
                          <LuTrash2 /> Remove this section
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="add-section-btn"
                onClick={() => setAddSection(true)}
              >
                <LuPlus /> Add new section
              </button>
              <DiagAddSectionForm
                isOpen={addSection}
                onClose={() => setAddSection(false)}
                idCourse={courseInfo.idCourse}
                idTeacher={idUser}
              />
            </div>

            <div className="block-container">
              <span className="block-container-title">Test</span>
              <div className="block-container-col">
                <div className="qualification">
                  <div className="qualification-body">
                    <div className="test-header">
                      <span className="test-name teacher-view">Title</span>
                    </div>

                    <div className="test-description">
                      <span>
                        <LuFileEdit /> Manual
                      </span>
                      <span>
                        <LuClock /> 45 mins
                      </span>
                      <span>
                        <LuCheckSquare /> 40 marks
                      </span>
                      <span>
                        <LuCalendar />
                        Due date: 11/20/2025
                      </span>
                    </div>
                  </div>

                  <div className="test-status">
                    <div className="test-status-text">Unpublish</div>
                  </div>
                </div>
              </div>
              <button
                className="add-section-btn"
                onClick={() => {
                  navigate("/addAssignment", {
                    state: {
                      selectedCourse: courseInfo,
                    },
                  });
                }}
              >
                <LuPlus /> Add new test
              </button>
            </div>
          </>
        ) : null}

        {/* Teacher View: Notification */}
        {idRole === Role.teacher && menuIndex === 2 ? (
          <div className="block-container">
            <span className="block-container-title">Notification Board</span>
            <div className="block-container-col noti-size">
              <div className="notification">
                <div className="delete-button">
                  <button>
                    <LuMinus />
                  </button>
                </div>
                <div className="notification-body">
                  <span className="notification-title">Title</span>
                  <span className="notification-content">
                    Body text for whatever you’d like to say. Add main takeaway
                    points, quotes, anecdotes, or even a very very short story.
                  </span>

                  <span className="noti-time">13.hr</span>
                </div>
              </div>
            </div>
            <button
              className="add-notification-button"
              onClick={() => setPopupAdd(!popupAdd)}
            >
              <LuPlus />
            </button>
            <div
              className={`add-notification-popup ${popupAdd ? "active" : ""}`}
            >
              <span className="popup-title">Add new notification</span>
              <input
                className="notification-title-enter"
                type="text"
                placeholder="Notification Title"
              />
              <textarea placeholder="Write your notification content here..."></textarea>
              <div className="post-button-container">
                <button
                  className="post-notification-button cancel"
                  onClick={() => setPopupAdd(!popupAdd)}
                >
                  Cancel
                </button>
                <button className="post-notification-button post">Post</button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Teacher View: Attendance */}
        {idRole && idRole === Role.teacher && menuIndex && menuIndex === 3 ? (
          <div className="block-container course-teacher-attendance">
            <div className="attendance-progress-container">
              <div className="attendance-progress-content">
                <div className="attendance-ava">
                  <img src={default_ava} />
                </div>
                <div className="attendance-progress-body">
                  <span className="attendance-name">Tian</span>
                  <span className="attendance-mail">
                    <LuMail color="#003B57" /> tiannait@snapmail.cc
                  </span>
                  <div className="attendance-progress">
                    <label>Lectures</label>
                    <div className="progress-line">
                      <div className="progress-line-inner"></div>
                    </div>
                    <span
                      className="proportion-number"
                      style={{ width: "20s%" }}
                    >
                      3/15
                    </span>
                  </div>
                  <div className="attendance-progress">
                    <label>Assignments</label>
                    <div className="progress-line">
                      <div
                        className="progress-line-inner"
                        style={{ width: "53.33%" }}
                      ></div>
                    </div>
                    <span className="proportion-number">8/15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="attendance-progress-container">
              <div className="attendance-progress-content">
                <div className="attendance-ava">
                  <img src={default_ava} />
                </div>
                <div className="attendance-progress-body">
                  <span className="attendance-name">Ruan</span>
                  <span className="attendance-mail">
                    <LuMail color="#003B57" /> tiannait@snapmail.cc
                  </span>
                  <div className="attendance-progress">
                    <label>Lectures</label>
                    <div className="progress-line">
                      <div className="progress-line-inner"></div>
                    </div>
                    <span
                      className="proportion-number"
                      style={{ width: "20s%" }}
                    >
                      3/15
                    </span>
                  </div>
                  <div className="attendance-progress">
                    <label>Assignments</label>
                    <div className="progress-line">
                      <div
                        className="progress-line-inner"
                        style={{ width: "53.33%" }}
                      ></div>
                    </div>
                    <span className="proportion-number">8/15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isModalSuccessOpen && (
        <div>
          <DiagSuccessfully
            isOpen={isModalSuccessOpen}
            onClose={closeSuccessModal}
            notification={
              "Congratulations! You have successfully enrolled in the course."
            }
          />
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
