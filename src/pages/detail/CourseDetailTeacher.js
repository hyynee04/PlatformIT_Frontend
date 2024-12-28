import { useEffect, useRef, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { ImSpinner2 } from "react-icons/im";
import {
  LuCalendar,
  LuCheck,
  LuChevronDown,
  LuClock,
  LuFileEdit,
  LuFileQuestion,
  LuMail,
  LuMinus,
  LuPenLine,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import "../../assets/css/Detail.css";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiGroupLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import default_ava from "../../assets/img/default_ava.png";
import { APIStatus, LectureStatus, Role } from "../../constants/constants";
import { formatDate } from "../../functions/function";
import {
  getCourseProgress,
  postAddSection,
  updateSection,
} from "../../services/courseService";
import { postAddBoardNotificationForCourse } from "../../services/notificationService";

const CourseDetailTeacher = (props) => {
  const {
    courseInfo,
    idUser,
    notificationBoard,
    setIsRemoved,
    setIdSection,
    fetchSectionDetail,
    fetchNotificationBoard,
    setIdNotiRemoved,
  } = props;

  const navigate = useNavigate();

  const idRole = +localStorage.getItem("idRole");
  const [loading, setLoading] = useState(false);

  const [notificationContent, setNotificationContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSection, setNewSection] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceListCurrent, setAttendanceListCurrent] = useState([]);

  const [popupAdd, setPopupAdd] = useState(false);
  const [addSection, setAddSection] = useState(false);

  const [menuIndex, setMenuIndex] = useState(1);
  useEffect(() => {
    const savedMenuIndex = localStorage.getItem("menuIndex");
    if (savedMenuIndex) {
      setMenuIndex(Number(savedMenuIndex)); // Restore the value if it exists
    }
  }, []);

  // Update localStorage whenever menuIndex changes
  useEffect(() => {
    localStorage.setItem("menuIndex", menuIndex);
  }, [menuIndex]);

  // Effect to clean up localStorage when the component is unmounted
  useEffect(() => {
    return () => {
      localStorage.removeItem("menuIndex");
    };
  }, []);

  const menuItems = [
    { label: "Main content", index: 1 },
    { label: "Notification", index: 2 },
    { label: "Attendee", index: 3 },
  ];

  const [showedSections, setShowedSections] = useState({});
  const [isEdit, setIsEdit] = useState({});

  // Number of lectures
  const numberOfLectures = courseInfo.sectionsWithCourses
    ? courseInfo.sectionsWithCourses?.reduce((total, section) => {
        return total + section.lectureCount;
      }, 0)
    : 0;

  const addNotificationBoard = async (idCourse, content, idCreatedBy) => {
    if (!content) {
      setErrorMessage("Something is missing...!");
      return;
    }
    setLoading(true);
    try {
      let response = await postAddBoardNotificationForCourse(
        idCourse,
        content,
        idCreatedBy
      );
      if (response.status === APIStatus.success) {
        setPopupAdd(false);
        fetchNotificationBoard();
      } else {
        setErrorMessage(response.data);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewSection = async (sectionTitle) => {
    try {
      let response = await postAddSection(
        sectionTitle,
        courseInfo.idCourse,
        idUser
      );
      if (response.status === APIStatus.success) {
        fetchSectionDetail(courseInfo.idCourse);
      } else console.log(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchCourseProgress = async (idCourse) => {
    try {
      let response = await getCourseProgress(idCourse);
      if (response.status === APIStatus.success) {
        setAttendanceList(response.data);
        setAttendanceListCurrent(response.data);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editSection = async (idSection, newSectionName, idUpdatedBy) => {
    try {
      let respone = await updateSection(idSection, newSectionName, idUpdatedBy);
      if (respone.status === APIStatus.success) {
        await fetchSectionDetail(courseInfo.idCourse);
        setNewSectionTitle("");
        setIsEdit({
          ...isEdit,
          [idSection]: !isEdit[idSection],
        });
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  useEffect(() => {
    fetchCourseProgress(courseInfo.idCourse);
  }, []);

  const sortButtonRef = useRef(null);
  const sortBoxRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [activeSortby, setActiveSortby] = useState(false);
  const [condition, setCondition] = useState({
    field: "",
    direction: "",
  });

  const resetCondition = () => {
    setCondition({ field: "", direction: "" });
    setAttendanceListCurrent({
      ...attendanceListCurrent,
      courseStudentProgress: attendanceList.courseStudentProgress,
    });
  };

  const handleChangeData = (content) => {
    const filteredCourse = attendanceList.courseStudentProgress
      ?.sort((a, b) => {
        console.log(a, b);

        // Ensure sortConditionCourse has valid values
        if (!condition.field || !condition.direction) {
          return 0; // If no sort condition is provided, return the list as is
        }
        const { field, direction } = condition;
        const dirMultiplier = direction === "asc" ? 1 : -1;

        // Get values directly and handle date fields by converting to timestamps if necessary
        const aValue = a[field];
        const bValue = b[field];
        console.log("avalue: ", aValue, "bvalue: ", bValue);

        // Comparison logic with direction
        if (aValue < bValue) return -1 * dirMultiplier;
        if (aValue > bValue) return 1 * dirMultiplier;
        return 0; // If values are the same, return 0
      })
      .filter(
        (attendance) =>
          attendance.fullName?.toLowerCase().includes(content?.toLowerCase()) ||
          attendance.email?.toLowerCase().includes(content?.toLowerCase())
      );
    setAttendanceListCurrent({
      ...attendanceListCurrent,
      courseStudentProgress: filteredCourse,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortBoxRef.current &&
        !sortBoxRef.current.contains(event.target) &&
        (!sortButtonRef.current ||
          (sortButtonRef.current.style.display !== "none" &&
            sortButtonRef.current.style.visibility !== "hidden" &&
            !sortButtonRef.current.contains(event.target)))
      ) {
        setActiveSortby(false);
      }
    };
    // Attach both event listeners
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup both event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="teacher-menu">
        {menuItems.map(({ label, index }) => (
          <button
            key={index}
            className={`teacher-menu-btn ${
              menuIndex === index ? "active" : ""
            }`}
            onClick={() => {
              setMenuIndex(index);
              localStorage.setItem("menuIndex", index);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Teacher View: Main Content */}
      {menuIndex === 1 ? (
        <>
          <div
            className={`block-container ${
              courseInfo.tests?.length > 0 ? "content-test" : "content-teacher"
            }`}
          >
            <div className="block-container-header">
              <span className="block-container-title">Course Content</span>
              <span className="block-container-sub-title">
                {courseInfo.sectionsWithCourses
                  ? `${courseInfo.sectionsWithCourses.length} ${
                      courseInfo.sectionsWithCourses.length === 1
                        ? "section"
                        : "sections"
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
                          setShowedSections({
                            ...showedSections,
                            [index]: !showedSections[index],
                          });
                        }}
                      >
                        {!isEdit[section.idSection] ? (
                          <>
                            <span className="section-name">
                              {idRole !== Role.platformAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEdit({
                                      ...Object.keys(isEdit).reduce(
                                        (acc, key) => ({
                                          ...acc,
                                          [key]: false,
                                        }),
                                        {}
                                      ),
                                      [section.idSection]: true,
                                    });
                                    setNewSectionTitle(section.sectionName);
                                  }}
                                >
                                  <LuPenLine />
                                </button>
                              )}

                              {section.sectionName}
                            </span>
                            <div className="section-info">
                              <span>
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

                                  setShowedSections({
                                    ...showedSections,
                                    [index]: !showedSections[index],
                                  });
                                }}
                              >
                                {showedSections[index] ? (
                                  <IoIosArrowUp />
                                ) : (
                                  <IoIosArrowDown />
                                )}
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            className="edit-section-container"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              className="edit-section"
                              value={newSectionTitle}
                              type="text"
                              placeholder={section.sectionName}
                              onChange={(e) =>
                                setNewSectionTitle(e.target.value)
                              }
                            />
                            <div className="edit-button-container">
                              <button
                                disabled={!newSectionTitle}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editSection(
                                    section.idSection,
                                    newSectionTitle,
                                    idUser
                                  );
                                }}
                              >
                                <LuCheck />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewSectionTitle("");
                                  setIsEdit({
                                    ...isEdit,
                                    [section.idSection]:
                                      !isEdit[section.idSection],
                                  });
                                }}
                              >
                                <LuX />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      {section.lectureStructures && (
                        <div
                          key={index}
                          className={`lecture-block ${
                            showedSections[index] ? "" : "adjust-lecture-block"
                          }`}
                        >
                          {section.lectureStructures.map((lecture, index) => (
                            <>
                              {lecture.lectureStatus !==
                                LectureStatus.inactive && (
                                <div
                                  key={index}
                                  className={`lecture-content`}
                                  onClick={() => {
                                    if (
                                      lecture.lectureStatus ===
                                      LectureStatus.active
                                    )
                                      navigate("/viewLecture", {
                                        state: {
                                          idLecture: lecture.idLecture,
                                          idCourse: courseInfo.idCourse,
                                        },
                                      });
                                    else {
                                      navigate("/addNewLecture", {
                                        state: {
                                          idLecture: lecture.idLecture,
                                          lectureStatus: lecture.lectureStatus,
                                          sectionName: section.sectionName,
                                        },
                                      });
                                    }
                                  }}
                                >
                                  <div className="lecture-name">
                                    <span className="lecture-title">
                                      {lecture.lectureTitle}
                                    </span>
                                    {lecture.lectureStatus ===
                                    LectureStatus.active ? (
                                      <span className="lecture-exercise-num">
                                        {`${lecture.exerciseCount} ${
                                          lecture.exerciseCount > 1
                                            ? "exercises"
                                            : "exercise"
                                        }`}
                                      </span>
                                    ) : lecture.lectureStatus ===
                                      LectureStatus.pending ? (
                                      <span className="lecture-exercise-num pending">
                                        Pending
                                      </span>
                                    ) : (
                                      <span className="lecture-exercise-num reject">
                                        Rejected
                                      </span>
                                    )}
                                  </div>
                                  <span className="lecture-description">
                                    {lecture.lectureIntroduction}
                                  </span>
                                </div>
                              )}
                            </>
                          ))}

                          <div className={`lecture-content nohover`}>
                            <div className="option-container">
                              {idRole === Role.teacher && (
                                <button
                                  className="add-lecture"
                                  onClick={() =>
                                    navigate("/addNewLecture", {
                                      state: {
                                        idCourse: courseInfo.idCourse,
                                        idSection: section.idSection,
                                        courseTitle: courseInfo.courseTitle,
                                        sectionName: section.sectionName,
                                      },
                                    })
                                  }
                                >
                                  <span className="icon">
                                    <LuPlus />
                                  </span>
                                  <span className="text">Add new lecture</span>
                                </button>
                              )}

                              <button
                                className="remove-section"
                                onClick={() => {
                                  setIdSection(section.idSection);
                                  setIsRemoved(true);
                                }}
                              >
                                <span className="icon">
                                  <LuTrash2 />
                                </span>
                                <span className="text">
                                  Remove this section
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            {idRole === Role.teacher && (
              <>
                {!addSection ? (
                  <div className="add-section-btn-container">
                    <button
                      className="add-section-btn"
                      onClick={() => setAddSection(!addSection)}
                    >
                      <LuPlus /> Add new section
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="add-section-container change-border-radius">
                      <div className="edit-section-container">
                        <input
                          className="edit-section"
                          value={newSection}
                          type="text"
                          placeholder="Section Name"
                          onChange={(e) => setNewSection(e.target.value)}
                        />
                        <div className="edit-button-container">
                          <button
                            disabled={!newSection}
                            onClick={() => {
                              addNewSection(newSection);
                              setNewSection("");
                              setAddSection(false);
                            }}
                          >
                            <LuCheck />
                          </button>
                          <button
                            onClick={() => {
                              setNewSection("");
                              setAddSection(!addSection);
                            }}
                          >
                            <LuX />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {courseInfo.isLimitedTime ? (
            <div className="block-container course-test">
              <div className="block-container-header">
                <span className="block-container-title">Tests</span>
                <span className="block-container-sub-title">
                  {courseInfo.tests
                    ? `${courseInfo.tests.length} ${
                        courseInfo.tests.length > 1 ? "tests" : "test"
                      }`
                    : "0 section"}{" "}
                </span>
              </div>
              {courseInfo.tests && courseInfo.tests.length !== 0 && (
                <div className="block-container-col">
                  {courseInfo.tests.map((test, index) => (
                    <div
                      key={index}
                      className={`qualification test ${
                        idRole === Role.centerAdmin ||
                        idRole === Role.platformAdmin
                          ? "nohover"
                          : ""
                      }`}
                      onClick={(e) => {
                        console.log(idRole);
                        e.stopPropagation();
                        if (idRole === Role.teacher) {
                          if (test.isPublish) {
                            navigate("/teacherAssignDetail", {
                              state: {
                                idAssignment: test.idAssignment,
                              },
                            });
                          } else {
                            navigate("/updateAssignment", {
                              state: {
                                idAssignment: test.idAssignment,
                              },
                            });
                          }
                        }
                      }}
                    >
                      <div className="qualification-body">
                        <div className="test-header">
                          <span className="test-name teacher-view">
                            {test.assignmentTitle}
                          </span>
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

                      <div className="test-status">
                        <span>
                          {test.finishedStudentCount}/{courseInfo.studentCount}{" "}
                          <RiGroupLine />
                        </span>
                        <div
                          className={`test-status-text ${
                            test.isPublish ? "is-published" : "unpublish"
                          }`}
                        >
                          {test.isPublish ? "Published" : "Unpublish"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {idRole === Role.teacher && (
                <div className="add-section-btn-container">
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
              )}
            </div>
          ) : null}
        </>
      ) : null}

      {/* Teacher View: Notification Board*/}
      {menuIndex === 2 ? (
        <div className="block-container">
          <span className="block-container-title">Notification Board</span>
          {notificationBoard && notificationBoard.length > 0 && (
            <div className="block-container-col noti-size">
              {notificationBoard.map((notification, index) => (
                <div key={index} className="notification">
                  {idRole === Role.teacher && (
                    <div className="delete-button">
                      <button
                        onClick={() => {
                          setIdNotiRemoved(notification.idNotification);
                          setIsRemoved(true);
                        }}
                      >
                        <LuMinus />
                      </button>
                    </div>
                  )}
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
          )}
          {idRole === Role.teacher && (
            <button
              className="add-notification-button"
              onClick={() => setPopupAdd(!popupAdd)}
            >
              <LuPlus />
            </button>
          )}

          <div className={`add-notification-popup ${popupAdd ? "active" : ""}`}>
            <span className="popup-title">Add new notification</span>
            <textarea
              value={notificationContent}
              placeholder="Write your notification content here..."
              onChange={(e) => {
                setErrorMessage("");
                setNotificationContent(e.target.value);
              }}
            ></textarea>
            {errorMessage && (
              <span className="add-noti-error">{errorMessage}</span>
            )}
            <div className="post-button-container">
              <button
                className="post-notification-button cancel"
                onClick={() => {
                  setPopupAdd(!popupAdd);
                  setNotificationContent("");
                  setErrorMessage("");
                }}
              >
                Cancel
              </button>
              <button
                className="post-notification-button post"
                onClick={() => {
                  addNotificationBoard(
                    courseInfo.idCourse,
                    notificationContent,
                    idUser
                  );
                }}
              >
                {loading && <ImSpinner2 className="icon-spin" />} Post
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Teacher View: Attendance */}
      {menuIndex === 3 ? (
        <>
          <div className="filter-search-section">
            <div className="filter-sort-btns">
              <div
                ref={sortButtonRef}
                className="button"
                onClick={() => {
                  setActiveSortby(!activeSortby);
                }}
              >
                <span>Sort by</span>
                <LuChevronDown color="#397979" />
              </div>
            </div>
            <div className="search-container">
              <input
                type="text"
                className="search-field"
                placeholder="Search"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  handleChangeData(event.target.value);
                }}
              />
              <LuSearch color="#397979" />
            </div>
            <div
              ref={sortBoxRef}
              className={`filter-sort-box ${activeSortby ? "active" : ""}`}
            >
              <span className="box-title">Sort</span>
              <div className="main-box">
                <div className="field">
                  <select
                    className="select-sortby"
                    onChange={(e) =>
                      setCondition({
                        ...condition,
                        field: e.target.value,
                      })
                    }
                  >
                    <option value="">Field</option>
                    <option value="finishedLectureCount">Lecture</option>
                    <option value="finishedAssignmentCount">Assignment</option>
                  </select>
                  <select
                    className="select-sortby"
                    onChange={(e) =>
                      setCondition({
                        ...condition,
                        direction: e.target.value,
                      })
                    }
                  >
                    <option value="">Direction</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
              <div className="box-footer">
                <button
                  className="cancel"
                  onClick={() => {
                    resetCondition();
                    setActiveSortby(false);
                  }}
                >
                  Clear
                </button>
                <button
                  className="save"
                  onClick={() => {
                    handleChangeData(searchText);
                    setActiveSortby(false);
                  }}
                >
                  Sort
                </button>
              </div>
            </div>
          </div>
          <div className="block-container course-teacher-attendance">
            {attendanceListCurrent.courseStudentProgress &&
              attendanceListCurrent.courseStudentProgress.length > 0 &&
              attendanceListCurrent.courseStudentProgress.map(
                (attendance, index) => (
                  <div
                    key={index}
                    className="attendance-progress-container"
                    onClick={() => {
                      if (idRole === Role.teacher) {
                        navigate("/studentdetail", {
                          state: {
                            idStudent: attendance.idStudent,
                            idCourse: courseInfo.idCourse,
                            courseTitle: courseInfo.courseTitle,
                          },
                        });
                      } else {
                        navigate("/studentdetail", {
                          state: {
                            idStudent: attendance.idStudent,
                          },
                        });
                      }
                    }}
                  >
                    <div className="attendance-progress-content">
                      <div className="attendance-ava">
                        <img src={attendance.avatarPath || default_ava} />
                      </div>
                      <div className="attendance-progress-body">
                        <span className="attendance-name">
                          {attendance.fullName}
                        </span>
                        <span className="attendance-mail">
                          <LuMail color="#003B57" /> {attendance.email}
                        </span>
                        <div className="attendance-progress">
                          <label>Lectures</label>
                          <div className="progress-line">
                            <div
                              className="progress-line-inner"
                              style={{
                                width: `${
                                  attendanceListCurrent.lectureCount > 0
                                    ? (attendance.finishedLectureCount /
                                        attendanceListCurrent.lectureCount) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="proportion-number">
                            {attendance.finishedLectureCount}/
                            {attendanceListCurrent.lectureCount}
                          </span>
                        </div>
                        <div className="attendance-progress">
                          <label>Assignments</label>
                          <div className="progress-line">
                            <div
                              className="progress-line-inner"
                              style={{
                                width: `${
                                  attendanceListCurrent.assignmentCount > 0
                                    ? (attendance.finishedAssignmentCount /
                                        attendanceListCurrent.assignmentCount) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="proportion-number">
                            {attendance.finishedAssignmentCount}/
                            {attendanceListCurrent.assignmentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </>
      ) : null}
    </>
  );
};

export default CourseDetailTeacher;
