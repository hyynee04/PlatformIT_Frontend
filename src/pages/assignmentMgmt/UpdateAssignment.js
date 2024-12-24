import React, { useEffect, useRef, useState } from "react";
import { FaCalendar, FaChevronDown, FaSave, FaTrashAlt } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { IoDuplicateSharp } from "react-icons/io5";
import {
  LuAlignJustify,
  LuChevronLeft,
  LuChevronRight,
  LuMinusCircle,
  LuX,
} from "react-icons/lu";
import { MdPublish } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";
import ManualQuestion from "../../components/assigment/ManualQuestion";
import QuizQuestion from "../../components/assigment/QuizQuestion";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentType,
} from "../../constants/constants";
import { formatDate } from "../../functions/function";
import {
  deleteAssignment,
  getAssignmentInfo,
  postAddManualAssignment,
  postAddQuizAssignment,
  postUpdateAssignment,
} from "../../services/assignmentService";
import {
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
} from "../../services/courseService";
import DiagNotiWarning from "../../components/diag/DiagNotiWarning";
const UpdateAssignment = ({ isDuplicate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState({
    save: false,
    publish: false,
  });
  const [listCourse, setListCourse] = useState([]);
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [originAssignInfo, setOriginAssignInfo] = useState({});
  const [questions, setQuestions] = useState([]);

  // Hàm xử lý cập nhật thông tin
  const handleUpdateAssignment = (key, value) => {
    setAssignmentInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };
  useEffect(() => {
    const fetchAssignmentData = async (idAssignment) => {
      setLoading(true);
      try {
        const response = await getAssignmentInfo(idAssignment);
        if (response.status === APIStatus.success) {
          const fetchedAssignmentInfo = response.data;
          const updatedTitle = isDuplicate
            ? `${fetchedAssignmentInfo.title} (Duplicate)`
            : fetchedAssignmentInfo.title;

          setAssignmentInfo({
            ...fetchedAssignmentInfo,
            title: updatedTitle,
            startDate: fetchedAssignmentInfo.startDate || "",
            dueDate: fetchedAssignmentInfo.dueDate || "",
            duration: fetchedAssignmentInfo.duration || "",
          });
          setOriginAssignInfo({
            ...fetchedAssignmentInfo,
            title: updatedTitle,
            assignmentItems: fetchedAssignmentInfo.assignmentItems.map(
              (item) => ({
                idAssignmentItem: item.idAssignmentItem,
                question: item.question,
                mark: item.mark,
                explanation: item.explanation,
                isMultipleAnswer: item.isMultipleAnswer,
                attachedFile: item.attachedFile,
                nameFile: item.nameFile,
                assignmentItemAnswerType: item.assignmentItemAnswerType,
                assignmentItemStatus: item.assignmentItemStatus,
                items: item.items,
              })
            ),
          });
          setQuestions(fetchedAssignmentInfo.assignmentItems);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    const fetchListCourse = async () => {
      setLoading(true);
      try {
        const response = await getAllActiveCourseOfTeacher();
        if (response.status === APIStatus.success) {
          const sortedCourses = response.data.sort((a, b) =>
            a.courseTitle.localeCompare(b.courseTitle)
          );
          setListCourse(sortedCourses);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    const state = location.state;
    if (state) {
      if (state.idAssignment) {
        fetchAssignmentData(state.idAssignment);
      }
    }
    if (isDuplicate) {
      fetchListCourse();
    }
  }, [location, isDuplicate]);
  //IS TEST
  const [isTest, setIsTest] = useState(false);
  //COURSE
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLimitedTimeCourse, setIsLimitedTimeCourse] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleInputClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setDropdownVisible(false);
  };
  const formatTimeCourse = (courseStartDate, courseEndDate) => {
    const now = new Date();
    const startDate = new Date(courseStartDate);
    const endDate = new Date(courseEndDate);

    if (now >= startDate && now <= endDate) {
      return "Ongoing";
    } else if (now < startDate) {
      return "Starting soon";
    } else {
      return "Ended";
    }
  };

  //SECTION
  const [listSection, setListSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fectchSection = async () => {
      if (selectedCourse && selectedCourse.idCourse) {
        const response = await getAllActiveSectionOfCourse(
          selectedCourse.idCourse
        );
        if (response.status === APIStatus.success) {
          const sortedSection = response.data.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          setListSection(sortedSection);
        }
        //unlimited course setting: không có manual assignment, bắc buộc phải thuộc 1 lecture nào đó
        if (selectedCourse.isLimitedTime === 1) {
          setIsLimitedTimeCourse(true);
        } else {
          setIsLimitedTimeCourse(false);
        }
      }
    };
    fectchSection();
  }, [selectedCourse]);
  const handleSectionChange = (event) => {
    const selectedSectionTitle = event.target.value;
    const section = listSection.find((c) => c.title === selectedSectionTitle);
    setSelectedSection(section);
  };
  //LECTURE
  const [listLecture, setListLecture] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  useEffect(() => {
    const fetchLectures = async () => {
      if (selectedCourse && selectedCourse.idCourse) {
        const response = await getAllActiveLecturesOfCoure(
          selectedCourse.idCourse
        );

        if (response.status === APIStatus.success) {
          if (selectedSection) {
            const selectiveLecture = response.data
              .sort((a, b) => a.titleLecture.localeCompare(b.titleLecture))
              .filter(
                (lecture) => lecture.idSection === selectedSection.idSection
              );
            setListLecture(selectiveLecture);
          } else {
            setListLecture(response.data);
          }
        }
        //unlimited course setting: không có manual assignment, bắc buộc phải thuộc 1 lecture nào đó
        if (selectedCourse.isLimitedTime === 1) {
          setIsLimitedTimeCourse(true);
        } else {
          setIsLimitedTimeCourse(false);
        }
      }
    };
    fetchLectures();
  }, [selectedCourse, selectedSection]);
  const handleLectureChange = (event) => {
    const selectedLectureTitle = event.target.value;
    const lecture = listLecture.find(
      (c) => c.titleLecture === selectedLectureTitle
    );
    setSelectedLecture(lecture);
  };

  //OPTION QUIZ
  const [showOptionQuiz, setShowOptionQuiz] = useState(false);
  const optionQuizRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionQuizRef.current && !optionQuizRef.current.contains(e.target)) {
        setShowOptionQuiz(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //TIME VALIDATE
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isStartDateAfterNow = (startDate) => {
    const currentDate = new Date();
    const selectedDate = new Date(startDate);

    if (selectedDate <= currentDate) {
      setErrorMessage("Start date must be in the future.");
      return false;
    }

    return true;
  };

  const isEndDateAfterStartDateAndDuration = (startDate, endDate, duration) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setErrorMessage("End date must be after start date.");
      return false;
    }

    if (duration) {
      const minEndDate = new Date(start.getTime() + duration * 60000); // Tính toán minEndDate

      if (end < minEndDate) {
        setErrorMessage("End date > start + duration.");
        return false;
      }
    }

    return true;
  };
  const isEndDateBeforeCourseEndDate = (endDate, courseEndDate) => {
    const end = new Date(endDate);
    const courseEnd = new Date(courseEndDate);

    if (end > courseEnd) {
      setErrorMessage("End date cannot be after the course end date.");
      return false;
    }
    return true;
  };
  const validateForm = (startDate, endDate, duration, courseEndDate) => {
    if (!isStartDateAfterNow(startDate)) {
      return false;
    }
    if (startDate && !endDate) {
      setErrorMessage("Please fill in 'Due date' field.");
      return false;
    }

    if (
      !isEndDateAfterStartDateAndDuration(startDate, endDate, duration) ||
      !isEndDateBeforeCourseEndDate(endDate, courseEndDate)
    ) {
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    handleUpdateAssignment("startDate", value);
    setIsValid(
      validateForm(
        value,
        assignmentInfo.dueDate,
        assignmentInfo.duration,
        selectedCourse
          ? selectedCourse.courseEndDate
          : assignmentInfo.courseEndDate
      )
    );
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    handleUpdateAssignment("dueDate", value);
    setIsValid(
      validateForm(
        assignmentInfo.startDate,
        value,
        assignmentInfo.duration,
        selectedCourse
          ? selectedCourse.courseEndDate
          : assignmentInfo.courseEndDate
      )
    );
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    handleUpdateAssignment("duration", value);
    setIsValid(
      validateForm(
        assignmentInfo.startDate,
        assignmentInfo.dueDate,
        value,
        selectedCourse
          ? selectedCourse.courseEndDate
          : assignmentInfo.courseEndDate
      )
    );
  };
  useEffect(() => {
    if (
      selectedCourse?.isLimitedTime === 1 &&
      assignmentInfo.isLimitedTime === 1
    )
      if (assignmentInfo.startDate && assignmentInfo.dueDate) {
        setIsValid(
          validateForm(
            assignmentInfo.startDate,
            assignmentInfo.dueDate,
            assignmentInfo.duration,
            selectedCourse
              ? selectedCourse.courseEndDate
              : assignmentInfo.courseEndDate
          )
        );
      }
  }, [assignmentInfo, selectedCourse]);
  //QUESTION

  const inputFileRef = useRef([]);
  const totalQuestions = questions.length;

  const totalMarks = questions.reduce(
    (acc, question) => acc + Number(question.mark),
    0
  );
  const handleAddQuestion = () => {
    const newQuestion =
      +assignmentInfo.assignmentType === AssignmentType.manual
        ? {
            idAssignmentItem: "",
            question: "",
            mark: "",
            assignmentItemAnswerType: AssignmentItemAnswerType.text,
            attachedFile: null,
            assignmentItemStatus: 1,
          }
        : +assignmentInfo.assignmentType === AssignmentType.quiz
        ? {
            idAssignmentItem: "",
            question: "",
            mark: "",
            explanation: "",
            isMultipleAnswer: false,
            attachedFile: null,
            attachedFilePreview: null,
            assignmentItemStatus: 1,
            items: [
              {
                idMultipleAssignmentItem: "",
                content: "",
                isCorrect: false,
                multipleAssignmentItemStatus: 1,
              },
            ],
          }
        : {};

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  //HANDLE EDIT ASSIGNMENT

  const [invalidHeader, setInvalidHeader] = useState("");
  const [invalidMsg, setInvalidMessage] = useState("");
  const [isModalInvalidOpen, setIsModalInvalidOpen] = useState(false);

  const openInvalidModal = () => setIsModalInvalidOpen(true);
  const closeInvalidModal = () => setIsModalInvalidOpen(false);
  const handleOpenInvalidDiag = (header, msgBody) => {
    setInvalidHeader(header);
    setInvalidMessage(msgBody);
    openInvalidModal();
  };
  const isFormValid = (isShowDiag) => {
    if (assignmentInfo.title === "") {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Assignment Title",
          "The assignment title is required. Please provide a valid title."
        );
      return false;
    }
    if (isDuplicate && !selectedCourse) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Course",
          "Please select a course to assign the assignment."
        );
      return false;
    }
    if (
      isDuplicate &&
      !isLimitedTimeCourse &&
      (!selectedSection || !selectedLecture)
    ) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Lecture",
          "Please select a lecture for this assignment."
        );
      return false;
    }
    if (isDuplicate && !isTest && (!selectedSection || !selectedLecture)) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Lecture or Section",
          "To create an exercise, select both a lecture and section, or uncheck the option to make it a course test."
        );
      return false;
    }
    if (!assignmentInfo.assignmentType) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Assignment Type",
          "Please select the type of assignment."
        );
      return false;
    }
    if (errorMessage !== "") {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Invalid Form",
          "There are errors in the form. Please review and fix them."
        );
      return false;
    }
    if (+assignmentInfo.assignmentType === AssignmentType.code) {
      if (!questions || typeof questions !== "object") {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Questions",
            "Please provide a valid question and mark for the coding assignment."
          );
        return false;
      }
      if (!questions.question || questions.question.trim() === "") {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Questions",
            "Please provide a valid question for the coding assignment."
          );
        return false;
      }
      if (!questions.mark || questions.mark <= 0) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Questions",
            "Please provide a valid mark greater than 0 for the coding assignment."
          );
        return false;
      }
    } else {
      if (!Array.isArray(questions) || questions.length <= 0) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Missing Questions",
            "You must add at least one question to proceed."
          );
        return false;
      }
      for (const question of questions) {
        if (!question.question || question.question.trim() === "") {
          isShowDiag &&
            handleOpenInvalidDiag(
              "Invalid Questions",
              "Each question must have valid content."
            );
          return false;
        }
        if (!question.mark || question.mark <= 0) {
          isShowDiag &&
            handleOpenInvalidDiag(
              "Invalid Questions",
              "Each question must have a mark greater than 0."
            );
          return false;
        }
        if (+assignmentInfo.assignmentType === AssignmentType.quiz) {
          if (question.items.length < 2) {
            isShowDiag &&
              handleOpenInvalidDiag(
                "Invalid Questions",
                "Each quiz question must have at least two options."
              );
            return false;
          }
          const hasCorrectAnswer = question.items.some(
            (item) => item.isCorrect
          );
          if (!hasCorrectAnswer) {
            isShowDiag &&
              handleOpenInvalidDiag(
                "Invalid Questions",
                "Each quiz question must have at least one correct answer."
              );
            return false;
          }
          for (const item of question.items) {
            if (!item.content || item.content.trim() === "") {
              isShowDiag &&
                handleOpenInvalidDiag(
                  "Invalid Questions",
                  "Quiz options must have valid content."
                );
              return false;
            }
          }
        }
      }
    }

    return true;
  };
  const [isFormValidState, setIsFormValidState] = useState(false);
  useEffect(() => {
    setIsFormValidState(isFormValid(false));
  }, [
    assignmentInfo.title,
    selectedCourse,
    selectedLecture,
    questions,
    assignmentInfo.assignmentType,
    errorMessage,
  ]);
  const handleDuplicateAssignment = async (isPublish) => {
    if (!isFormValid(true)) {
      return;
    }
    const dataToSubmit = {
      title: assignmentInfo.title,
      idCourse: selectedCourse.idCourse,
      isTest: isTest,
      idLecture: !isTest ? selectedLecture?.idLecture : null,
      startDate: assignmentInfo.startDate || "",
      endDate: assignmentInfo.dueDate || "",
      duration: assignmentInfo.duration || "",
      assignmentType: Number(assignmentInfo.assignmentType),
      isPublish: isPublish,
      isShufflingQuestion: assignmentInfo.isShufflingQuestion,
      isShufflingAnswer: assignmentInfo.isShufflingAnswer,
      isShowAnswer: assignmentInfo.isShowAnswer,
      questions: questions,
    };
    isPublish
      ? setLoadingBtn((prevState) => ({
          ...prevState,
          publish: true,
        }))
      : setLoadingBtn((prevState) => ({
          ...prevState,
          save: true,
        }));
    try {
      let response;

      if (+assignmentInfo.assignmentType === AssignmentType.manual) {
        response = await postAddManualAssignment(dataToSubmit);
      } else if (+assignmentInfo.assignmentType === AssignmentType.quiz) {
        response = await postAddQuizAssignment(dataToSubmit);
      }

      if (response?.status === APIStatus.success) {
        navigate("/teacherAssignment");
      } else {
        console.error("Error adding assignment:", response?.message);
      }
    } catch (error) {
      console.error("Failed to add assignment:", error);
    } finally {
      isPublish
        ? setLoadingBtn((prevState) => ({
            ...prevState,
            publish: false,
          }))
        : setLoadingBtn((prevState) => ({
            ...prevState,
            save: false,
          }));
    }
  };
  const handleEditAssignment = async (isPublish) => {
    if (!isFormValid(true)) {
      return;
    }
    const dataToSubmit = {
      idAssignment: assignmentInfo.idAssignment,
      title: assignmentInfo.title,
      isTest: isTest,
      startDate: assignmentInfo.startDate || "",
      endDate: assignmentInfo.dueDate || "",
      duration: assignmentInfo.duration || "",
      assignmentType: Number(assignmentInfo.assignmentType),
      isPublish: isPublish,
      isShufflingQuestion: assignmentInfo.isShufflingQuestion,
      isShufflingAnswer: assignmentInfo.isShufflingAnswer,
      isShowAnswer: assignmentInfo.isShowAnswer,
      assignmentStatus: assignmentInfo.assignmentStatus,
      questions: questions,
    };
    isPublish
      ? setLoadingBtn((prevState) => ({
          ...prevState,
          publish: true,
        }))
      : setLoadingBtn((prevState) => ({
          ...prevState,
          save: true,
        }));
    try {
      const response = await postUpdateAssignment(dataToSubmit);

      if (response.status === APIStatus.success) {
        navigate(-1);
      } else {
        console.error("Error updating assignment:", response?.message);
      }
    } catch (error) {
      console.error("Failed to updating assignment:", error);
    } finally {
      isPublish
        ? setLoadingBtn((prevState) => ({
            ...prevState,
            publish: false,
          }))
        : setLoadingBtn((prevState) => ({
            ...prevState,
            save: false,
          }));
    }
  };
  const [diagDeleteVisible, setDiagDeleteVisible] = useState(false);
  const handleOpenDeleteDiag = () => {
    setDiagDeleteVisible(true);
  };
  const handleDeleteAssignment = async () => {
    try {
      const response = await deleteAssignment(assignmentInfo.idAssignment);
      if (response.status === APIStatus.success) {
        setDiagDeleteVisible(false);
        navigate("/teacherAssignment");
      }
    } catch (error) {
      throw error;
    }
  };
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100); // Cố định khi cuộn qua 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }

  return (
    <div>
      <div className="assign-span">
        <div className="left-assign-span">
          <span style={{ fontWeight: "800" }}>
            <LuChevronLeft
              strokeWidth="4"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />{" "}
            {isDuplicate
              ? "Create new assignment"
              : `Edit ${assignmentInfo.isTest === 1 ? "test" : "exercise"}`}
          </span>
          <div className="name-container">
            {!isDuplicate && (
              <div className="name-sub-container">
                <span className="name-course">
                  {assignmentInfo.courseTitle}
                </span>
                {assignmentInfo.idSection && (
                  <>
                    <LuChevronRight className="icon" />
                    <span className="name-course">
                      {assignmentInfo.nameSection}
                    </span>
                  </>
                )}
                {assignmentInfo.idLecture && (
                  <>
                    <LuChevronRight className="icon" />
                    <span className="name-course">
                      {assignmentInfo.nameLecture}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="action-btns-form"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="container-button">
            {!isDuplicate && (
              <div
                style={{
                  borderRight: "2px solid var(--border-gray)",
                  display: "flex",
                  flexDirection: "row",
                  padding: "0 4px",
                }}
              >
                <button
                  className="btn"
                  //   disabled={!isFormValid()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDeleteDiag();
                  }}
                >
                  <FaTrashAlt />
                  <span>Delete assignment</span>
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setAssignmentInfo(originAssignInfo);
                    setQuestions(
                      originAssignInfo.assignmentItems.map((item) => ({
                        idAssignmentItem: item.idAssignmentItem,
                        question: item.question,
                        mark: item.mark,
                        explanation: item.explanation,
                        isMultipleAnswer: item.isMultipleAnswer,
                        attachedFile: item.attachedFile,
                        nameFile: item.nameFile,
                        assignmentItemAnswerType: item.assignmentItemAnswerType,
                        assignmentItemStatus: item.assignmentItemStatus,
                        items: JSON.parse(JSON.stringify(item?.items)),
                      }))
                    );

                    // setQuestions(fetchedAssignmentInfo.assignmentItems);
                  }}
                >
                  <HiRefresh />
                  <span>Discard changes</span>
                </button>

                <button
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/duplicateAssignment", {
                      state: {
                        idAssignment: assignmentInfo.idAssignment,
                        isDuplicate: true,
                      },
                    });
                  }}
                >
                  <IoDuplicateSharp />
                  <span>Duplicate</span>
                </button>
              </div>
            )}
            <button
              className={`btn save ${
                !isFormValidState ? "button-disabled" : ""
              }`}
              onClick={() => {
                isDuplicate
                  ? handleDuplicateAssignment(false)
                  : handleEditAssignment(false);
              }}
            >
              {loadingBtn.save ? (
                <ImSpinner2 className="icon-spin" color="#397979" />
              ) : (
                <FaSave />
              )}
              Save
            </button>
            <button
              className={`btn publish ${
                !isFormValidState ? "button-disabled" : ""
              }`}
              disabled={!isFormValid()}
              onClick={() => {
                isDuplicate
                  ? handleDuplicateAssignment(true)
                  : handleEditAssignment(true);
              }}
            >
              {loadingBtn.publish ? (
                <ImSpinner2 className="icon-spin" color="#f5f5f5" />
              ) : (
                <MdPublish />
              )}
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="container-assign">
        <div className="container-left-assign sticky">
          <span className="title-span">
            {isDuplicate
              ? "Detail assignment"
              : assignmentInfo.isTest === 1
              ? "Detail test"
              : "Detail exercise"}
          </span>
          <div className="assign-info">
            <div className="info">
              <span>
                Title<span className="required">*</span>
              </span>
              <input
                type="text"
                className="input-form-pi"
                value={assignmentInfo.title}
                onChange={(e) =>
                  handleUpdateAssignment("title", e.target.value)
                }
              />
            </div>

            {isDuplicate && (
              <div className="info">
                <span>
                  Add to course<span className="required">*</span>
                </span>
                <div className="select-container">
                  <input
                    style={{ cursor: "default" }}
                    type="text"
                    className="input-form-pi"
                    value={
                      selectedCourse
                        ? selectedCourse.courseTitle
                        : "Select a course"
                    }
                    readOnly
                    onClick={handleInputClick}
                  />

                  <FaChevronDown className="arrow-icon" />
                </div>

                {isDropdownVisible && (
                  <div className="list-options-container">
                    {listCourse.map((course, index) => (
                      <div
                        key={index}
                        className="option-course-container"
                        onClick={() => handleCourseSelect(course)}
                      >
                        <div>
                          {course.courseTitle}
                          {course.isLimitedTime === 1 && (
                            <span>
                              <FaCalendar style={{ marginBottom: "2px" }} />
                              {formatDate(course.courseStartDate)} -{" "}
                              {formatDate(course.courseEndDate)}
                            </span>
                          )}
                        </div>
                        {course.isLimitedTime === 1 && (
                          <span
                            className={`status-time-course ${
                              formatTimeCourse(
                                course.courseStartDate,
                                course.courseEndDate
                              ) === "Ongoing"
                                ? "on-going"
                                : "starting-soon"
                            }`}
                          >
                            {formatTimeCourse(
                              course.courseStartDate,
                              course.courseEndDate
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {isDuplicate && selectedCourse && (
                  <div className="info">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isAttendLimited"
                        checked={!isLimitedTimeCourse || !isTest}
                        disabled={!isLimitedTimeCourse}
                        onChange={(e) => {
                          if (isLimitedTimeCourse) {
                            setIsTest(!e.target.checked);
                          }
                        }}
                      />
                      <span style={{ color: "var(--black-color)" }}>
                        This is an exercise of a lecture.
                        {!isLimitedTimeCourse && (
                          <span className="required">*</span>
                        )}
                      </span>
                    </div>
                    {(!isLimitedTimeCourse || !isTest) && (
                      <>
                        <div className="select-container">
                          <select
                            className="input-form-pi"
                            onChange={handleSectionChange}
                            // disabled={isTest}
                          >
                            <option value="" disabled selected hidden>
                              {selectedLecture
                                ? selectedLecture.titleSection
                                : "Select a section"}
                            </option>
                            {listSection.map((section, index) => (
                              <option
                                value={section.title}
                                key={index}
                                className="option-container"
                              >
                                {section.title}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="arrow-icon" />
                        </div>
                        <div className="select-container">
                          <select
                            className="input-form-pi"
                            onChange={handleLectureChange}
                          >
                            <option value="" disabled selected hidden>
                              Select a lecture
                            </option>
                            {listLecture.map((lecture, index) => (
                              <option
                                value={lecture.titleLecture}
                                key={index}
                                className="option-container"
                              >
                                {lecture.titleLecture}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="arrow-icon" />
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="container-field">
                  <div className="container-left">
                    <div className="info">
                      <span>
                        Type<span className="required">*</span>
                      </span>
                      <div className="select-container">
                        <input
                          className="input-form-pi"
                          value={
                            assignmentInfo.assignmentType ===
                            AssignmentType.quiz
                              ? "Quiz"
                              : assignmentInfo.assignmentType ===
                                AssignmentType.manual
                              ? "Manual"
                              : "Code"
                          }
                          readOnly
                          // onChange={(e) => {
                          //   handleUpdateAssignment(
                          //     "assignmentType",
                          //     e.target.value
                          //   );
                          //   setQuestions([]);
                          // }}
                        />
                      </div>
                    </div>
                    {(isDuplicate
                      ? selectedCourse?.isLimitedTime === 1
                      : assignmentInfo.isLimitedTime === 1) && (
                      <div className="info">
                        <div className="container-validate">
                          <span>Start date</span>
                        </div>
                        <input
                          type="datetime-local"
                          className="input-form-pi"
                          value={assignmentInfo.startDate || ""}
                          onChange={handleStartDateChange}
                        />
                      </div>
                    )}
                  </div>
                  <div className="container-gap"></div>
                  <div className="container-right">
                    <div className="info">
                      <span>Duration</span>
                      <div className="select-container">
                        <input
                          type="number"
                          id="duration"
                          className="input-form-pi"
                          min="1"
                          step="1"
                          value={assignmentInfo.duration || ""}
                          onChange={handleDurationChange}
                        />
                        <span
                          className="arrow-icon"
                          style={{ fontSize: "14px" }}
                        >
                          | minutes
                        </span>
                      </div>
                    </div>
                    {(isDuplicate
                      ? selectedCourse?.isLimitedTime === 1
                      : assignmentInfo.isLimitedTime === 1) && (
                      <div className="info">
                        <div className="container-validate">
                          <span>Due date</span>
                        </div>

                        <input
                          type="datetime-local"
                          className="input-form-pi"
                          value={assignmentInfo.dueDate || ""}
                          onChange={handleEndDateChange}
                          // disabled={!startDate}
                        />
                        <div className="container-validate">
                          {" "}
                          {!isValid.registTimeValidate && (
                            <span
                              className={"warning-error"}
                              style={{
                                color: "var(--red-color)",
                                marginLeft: "auto",
                              }}
                            >
                              {errorMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            }
            <div className="info">
              <span className="overall-span">
                {totalQuestions}{" "}
                {totalQuestions <= 1 ? "question" : "questions"} |{" "}
                {totalMarks || 0} {totalMarks <= 1 ? "mark" : "marks"}
              </span>
            </div>
          </div>
        </div>
        <div className="container-right-assign">
          <span className="title-span">
            Questions
            {+assignmentInfo.assignmentType === AssignmentType.quiz ? (
              <LuAlignJustify
                style={{ cursor: "pointer" }}
                onClick={() => setShowOptionQuiz(!showOptionQuiz)}
              />
            ) : (
              <div className="info">
                <span>Question shuffling</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={assignmentInfo.isShufflingQuestion === 1}
                    onChange={(e) =>
                      handleUpdateAssignment(
                        "isShufflingQuestion",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            )}
            {showOptionQuiz && (
              <div
                className="container-options assign-setting-option"
                ref={optionQuizRef}
              >
                <div className="item">
                  <span>Question shuffling</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={assignmentInfo.isShufflingQuestion === 1}
                      onChange={(e) =>
                        handleUpdateAssignment(
                          "isShufflingQuestion",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="item">
                  <span>Answer shuffling</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={assignmentInfo.isShufflingAnswer === 1}
                      onChange={(e) =>
                        handleUpdateAssignment(
                          "isShufflingAnswer",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="item">
                  <span>Show answer on submission</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={assignmentInfo.showAnswer === 1}
                      onChange={(e) =>
                        handleUpdateAssignment(
                          "showAnswer",
                          e.target.checked ? 1 : 0
                        )
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}
          </span>
          {+assignmentInfo.assignmentType === AssignmentType.manual && (
            <ManualQuestion
              questions={questions}
              setQuestions={setQuestions}
              inputFileRef={inputFileRef}
              isUpdate={!isDuplicate}
            />
          )}
          {+assignmentInfo.assignmentType === AssignmentType.quiz && (
            <QuizQuestion
              questions={questions}
              setQuestions={setQuestions}
              inputFileRef={inputFileRef}
              isUpdate={!isDuplicate}
            />
          )}
          <button className="btn circle-btn" onClick={handleAddQuestion}>
            <TiPlus className="icon" />
          </button>
        </div>
      </div>

      {diagDeleteVisible && (
        <div
          className="modal-overlay"
          onClick={() => setDiagDeleteVisible(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="diag-header"
              style={{ backgroundColor: "var(--red-color)" }}
            >
              <div className="container-title">
                <LuMinusCircle className="diag-icon" />
                <span className="diag-title">Delete Assignment</span>
              </div>
              <LuX
                className="diag-icon"
                onClick={() => setDiagDeleteVisible(false)}
              />
            </div>
            <div className="diag-body">
              <span>Are you sure you want to delete this assignment?</span>
              <div className="str-btns">
                <div className="act-btns">
                  <button
                    className="btn diag-btn cancel"
                    onClick={() => setDiagDeleteVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn diag-btn signout"
                    style={{ backgroundColor: "var(--red-color)" }}
                    onClick={() => {
                      handleDeleteAssignment();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DiagNotiWarning
        isOpen={isModalInvalidOpen}
        onClose={closeInvalidModal}
        invalidHeader={invalidHeader}
        invalidMsg={invalidMsg}
      />
    </div>
  );
};

export default UpdateAssignment;
