import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { FaCalendar, FaChevronDown, FaSave, FaTrashAlt } from "react-icons/fa";
import {
  LuAlignJustify,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
} from "react-icons/lu";
import { MdPublish } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { ImSpinner2 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Assignment.css";
import ManualQuestion from "../../components/assigment/ManualQuestion";
import QuizQuestion from "../../components/assigment/QuizQuestion";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentType,
} from "../../constants/constants";
import {
  getAllActiveLanguage,
  postAddCodeAssignment,
  postAddManualAssignment,
  postAddQuizAssignment,
} from "../../services/assignmentService";
import {
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
} from "../../services/courseService";
import RunCode from "../../components/assigment/RunCode";
import DiagNotiWarning from "../../components/diag/DiagNotiWarning";

const AddNewAssign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingBtn, setLoadingBtn] = useState({
    save: false,
    publish: false,
  });
  const [loading, setLoading] = useState(false);
  const [isAddByCourse, setIsAddByCourse] = useState(false);
  const [isAddByLecture, setIsAddByLecture] = useState(false);

  const [listCourse, setListCourse] = useState([]);
  const [listSection, setListSection] = useState([]);
  const [listLecture, setListLecture] = useState([]);

  const [isDropdownCourseVisible, setDropdownCourseVisible] = useState(false);
  const [isDropdownSectionVisible, setDropdownSectionVisible] = useState(false);
  const [isDropdownLectureVisible, setDropdownLectureVisible] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [title, setTitle] = useState("");
  const [isTest, setIsTest] = useState(false);
  const [isLimitedTimeCourse, setIsLimitedTimeCourse] = useState(false);
  const [isShufflingQuestion, setIsShufflingQuestion] = useState(false);
  const [isShufflingAnswer, setIsShufflingAnswer] = useState(false);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [isShowTestCases, setIsShowTestCases] = useState(false);
  const [typeAssignment, setTypeAssignment] = useState(null);
  const [duration, setDuration] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [questions, setQuestions] = useState([]);
  const [listLanguagesCode, setListLanguagesCode] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const inputFileRef = useRef([]);

  const [showOptionQuiz, setShowOptionQuiz] = useState(false);
  const optionQuizRef = useRef(null);

  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAddQuestionMessage, setErrorAddQuestionMessage] = useState("");

  useEffect(() => {
    const state = location.state;
    if (state) {
      if (state.selectedLecture) {
        setIsAddByLecture(true);
        setSelectedLecture(state.selectedLecture);
        setIsTest(false);
      } else if (state.selectedCourse) {
        setIsAddByCourse(true);
        setSelectedCourse(state.selectedCourse);
        setIsTest(true);
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getAllActiveCourseOfTeacher();
      if (response.status === APIStatus.success) {
        const sortedCourses = response.data.sort((a, b) =>
          a.courseTitle.localeCompare(b.courseTitle)
        );
        setListCourse(sortedCourses);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSection(null);
    setSelectedLecture(null);
    setDropdownCourseVisible(false);
    if (
      course.isLimitedTime === 0 &&
      +typeAssignment === AssignmentType.manual
    ) {
      setTypeAssignment(AssignmentType.quiz);
      setQuestions([]);
    }

    setErrorAddQuestionMessage("");
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  //SECTION

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

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setSelectedLecture(null);
    setDropdownSectionVisible(false);
  };

  //LECTURE

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
  const handleLectureSelect = (lecture) => {
    setSelectedLecture(lecture);
    setDropdownLectureVisible(false);
  };

  const handleDropdownClick = (type) => {
    setDropdownCourseVisible((prev) => (type === "course" ? !prev : false));
    setDropdownSectionVisible((prev) => (type === "section" ? !prev : false));
    setDropdownLectureVisible((prev) => (type === "lecture" ? !prev : false));
  };
  useEffect(() => {
    if (isAddByLecture) {
      const matchedCourse = listCourse.find(
        (course) => course.idCourse === selectedLecture.idCourse
      );
      if (matchedCourse) {
        setSelectedCourse(matchedCourse);
      }
      const matchedSection = listSection.find(
        (section) => section.idSection === selectedLecture.idSection
      );
      if (matchedSection) {
        setSelectedSection(matchedSection);
      }
    }
  }, [listCourse, listSection, selectedLecture, isAddByLecture]);
  const fetchLaguages = async () => {
    let response = await getAllActiveLanguage();
    if (response.status === APIStatus.success) {
      setListLanguagesCode(response.data);
    }
  };
  useEffect(() => {
    fetchLaguages();
  }, [typeAssignment]);
  const handleLanguageChange = (event) => {
    const selectedLanguageTitle = event.target.value;
    const language = listLanguagesCode.find(
      (c) => c.languageName === selectedLanguageTitle
    );
    setSelectedLanguage(language);
  };
  // useEffect(() => {
  //   if (
  //     selectedLanguage &&
  //     typeof questions === "object" &&
  //     questions !== null
  //   ) {
  //     setQuestions((prevQuestions) => ({
  //       ...prevQuestions,
  //       idLanguage: selectedLanguage.idLanguage,
  //     }));
  //   }
  // }, [selectedLanguage, questions]);

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
      const minEndDate = new Date(start.getTime() + duration * 60000);

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
    setStartDate(value);
    setIsValid(
      validateForm(value, endDate, duration, selectedCourse.courseEndDate)
    );
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    setIsValid(
      validateForm(startDate, value, duration, selectedCourse.courseEndDate)
    );
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setDuration(value);
    setIsValid(
      validateForm(startDate, endDate, value, selectedCourse.courseEndDate)
    );
  };

  //ISSHUFFLINGQUESTION

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
  //QUESTION
  const handleAddQuestion = () => {
    if (+typeAssignment === AssignmentType.manual) {
      setQuestions([
        ...questions,
        {
          question: "",
          mark: "",
          assignmentItemAnswerType: AssignmentItemAnswerType.text,
          attachedFile: null,
          assignmentItemStatus: 1,
        },
      ]);
    } else if (+typeAssignment === AssignmentType.quiz) {
      setQuestions([
        ...questions,
        {
          question: "",
          mark: "",
          explanation: "",
          isMultipleAnswer: false,
          attachedFile: null,
          attachedFilePreview: null,
          assignmentItemStatus: 1,
          items: [
            {
              content: "",
              isCorrect: false,
              multipleAssignmentItemStatus: 1,
            },
          ],
        },
      ]);
    } else {
      setErrorAddQuestionMessage("Please select an assignment type first!");
    }
  };
  const totalQuestions = questions.length;

  const totalMarks =
    Number(typeAssignment) !== AssignmentType.code
      ? questions.reduce((acc, question) => acc + Number(question.mark), 0)
      : 0;

  const handleAddNewRecord = (fieldName) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [fieldName]: [...prevQuestions[fieldName], { input: "", output: "" }],
    }));
  };
  const handleDeleteRecord = (fieldName, index) => {
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [fieldName]: prevQuestions[fieldName].filter((_, idx) => idx !== index),
    }));
  };

  const handleTableCodeChange = (fieldName, index, field, value) => {
    const updatedField = [...questions[fieldName]];
    updatedField[index][field] = value;
    setQuestions((prevQuestions) => ({
      ...prevQuestions,
      [fieldName]: updatedField,
    }));
  };
  const handleTimeChange = (e) => {
    const inputValue = e.target.value;

    // Cho phép số và một dấu "."
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setQuestions((prevQuestions) => ({
        ...prevQuestions,
        timeValue: inputValue,
      }));
    }
  };
  //HANDLE ADD ASSIGNMENT
  const [isFormValidState, setIsFormValidState] = useState(false);
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
    if (title === "") {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Assignment Title",
          "The assignment title is required. Please provide a valid title."
        );
      return false;
    }
    if (!selectedCourse) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Course",
          "Please select a course to assign the assignment."
        );
      return false;
    }
    if (!isLimitedTimeCourse && (!selectedLecture || !selectedLecture)) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Lecture",
          "Please select a lecture for this assignment."
        );
      return false;
    }
    if (!isTest && (!selectedSection || !selectedLecture)) {
      isShowDiag &&
        handleOpenInvalidDiag(
          "Missing Lecture or Section",
          "To create an exercise, select both a lecture and section, or uncheck the option to make it a course test."
        );
      return false;
    }
    if (!typeAssignment) {
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
    if (+typeAssignment === AssignmentType.code) {
      if (!questions?.problem || questions.problem.trim() === "") {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Question",
            "Please provide a valid problem for the coding assignment."
          );
        return false;
      }
      if (!selectedLanguage || Object.keys(selectedLanguage).length === 0) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Missing Programming Language",
            "Please select a programming language for the coding assignment."
          );
        return false;
      }
      const hasInvalidExample = questions.examples.some(
        (examples) =>
          !examples.input ||
          examples.input.trim() === "" ||
          !examples.output ||
          examples.output.trim() === ""
      );

      if (hasInvalidExample) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Example",
            "Each example must have valid input and output."
          );
        return false;
      }
      if (!questions.testCases || questions.testCases.length === 0) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Missing Test Cases",
            "Please add at least one test case to validate the code execution."
          );
        return false;
      }

      const hasInvalidTestCase = questions.testCases.some(
        (testCase) =>
          !testCase.input ||
          testCase.input.trim() === "" ||
          !testCase.expectedOutput ||
          testCase.expectedOutput.trim() === ""
      );

      if (hasInvalidTestCase) {
        isShowDiag &&
          handleOpenInvalidDiag(
            "Invalid Test Case",
            "Each test case must have valid input and expected output."
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
        if (+typeAssignment === AssignmentType.quiz) {
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
  useEffect(() => {
    setIsFormValidState(isFormValid(false));
  }, [
    title,
    selectedCourse,
    selectedLecture,
    questions,
    typeAssignment,
    errorMessage,
  ]);
  const handleAddAssignment = async (isPublish) => {
    if (!isFormValid(true)) {
      return;
    }
    let dataToSubmit = {
      title: title,
      idCourse: selectedCourse.idCourse,
      isTest: isTest,
      idLecture: !isTest ? selectedLecture?.idLecture : null,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      assignmentType: Number(typeAssignment),
      isPublish: isPublish,
      isShufflingQuestion: isShufflingQuestion,
      isShufflingAnswer: isShufflingAnswer,
      isShowAnswer: isShowAnswer,
      isShowTestCase: isShowTestCases,
      idLanguage: selectedLanguage.idLanguage,
      // questions: questions,
    };
    if (+typeAssignment === AssignmentType.code) {
      dataToSubmit = {
        ...dataToSubmit,
        ...questions,
      };
    } else {
      dataToSubmit = {
        ...dataToSubmit,
        questions: questions,
      };
    }
    setLoading(true);
    try {
      let response;

      if (+typeAssignment === AssignmentType.manual) {
        response = await postAddManualAssignment(dataToSubmit);
      } else if (+typeAssignment === AssignmentType.quiz) {
        response = await postAddQuizAssignment(dataToSubmit);
      } else if (+typeAssignment === AssignmentType.code) {
        response = await postAddCodeAssignment(dataToSubmit);
      }

      if (response?.status === APIStatus.success) {
        if (isAddByCourse) {
          navigate("/courseDetail", {
            state: {
              idCourse: selectedCourse.idCourse,
              idUser: localStorage.getItem("idUser"),
              idRole: localStorage.getItem("idRole"),
            },
          });
        } else {
          navigate(-1);
        }
      } else {
        console.error("Error adding assignment:", response?.message);
      }
    } catch (error) {
      console.error("Failed to add assignment:", error);
    } finally {
      setLoading(false);
    }
  };
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
          <span
            style={{ fontWeight: "800", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            <LuChevronLeft stroke-width="4" />
            {isAddByLecture
              ? "Create new exercise"
              : isAddByCourse
              ? "Create new test"
              : "Create new assignment"}
          </span>
          <div className="name-container">
            {isAddByCourse && (
              <span className="name-course">{selectedCourse.courseTitle}</span>
            )}
            {isAddByLecture && (
              <div className="name-sub-container">
                <span className="name-course">
                  {selectedCourse?.courseTitle}
                </span>
                <LuChevronRight className="icon" />
                <span className="name-course">{selectedSection?.title}</span>
                <LuChevronRight className="icon" />
                <span className="name-course">
                  {selectedLecture.lectureTitle}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="action-btns-form"
          style={{ backgroundColor: "transparent" }}
        >
          <div className="container-button">
            <button
              className={`btn save ${
                !isFormValidState ? "button-disabled" : ""
              }`}
              onClick={() => handleAddAssignment(false)}
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
              onClick={() => handleAddAssignment(true)}
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
        <div className="container-left-assign">
          <span className="title-span">
            {isAddByLecture
              ? "Detail exercise"
              : isAddByCourse
              ? "Detail test"
              : "Detail assignment"}
          </span>
          <div className="assign-info">
            <div className="info">
              <span>
                Title<span className="required">*</span>
              </span>
              <input
                type="text"
                className="input-form-pi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {!isAddByCourse && !isAddByLecture && (
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
                    onClick={() => handleDropdownClick("course")}
                    // onChange={(e) => setTitle(e.target.value)}
                  />

                  <FaChevronDown className="arrow-icon" />
                </div>

                {isDropdownCourseVisible && (
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

            {selectedCourse && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {!isAddByCourse && !isAddByLecture && (
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
                          <input
                            style={{ cursor: "default" }}
                            type="text"
                            className="input-form-pi"
                            value={
                              selectedSection
                                ? selectedSection.title
                                : "Select a section"
                            }
                            disabled={isTest}
                            onClick={() => handleDropdownClick("section")}
                          />
                          <FaChevronDown className="arrow-icon" />
                        </div>
                        {isDropdownSectionVisible && (
                          <div className="list-options-container section">
                            {listSection.map((section, index) => (
                              <div
                                key={index}
                                className="option-course-container"
                                onClick={() => handleSectionSelect(section)}
                              >
                                <div>{section.title}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="select-container">
                          <input
                            style={{ cursor: "default" }}
                            type="text"
                            className="input-form-pi"
                            value={
                              selectedLecture
                                ? selectedLecture.titleLecture
                                : "Select a lecture"
                            }
                            onClick={() => handleDropdownClick("lecture")}
                            disabled={isTest}
                          />
                          <FaChevronDown className="arrow-icon" />
                        </div>
                        {isDropdownLectureVisible && (
                          <div className="list-options-container lecture">
                            {listLecture.map((lecture, index) => (
                              <div
                                key={index}
                                className="option-course-container"
                                onClick={() => handleLectureSelect(lecture)}
                              >
                                <div>{lecture.titleLecture}</div>
                                <span className="section-lecture">
                                  {lecture.titleSection}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
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
                        <select
                          className="input-form-pi"
                          onChange={(e) => {
                            const selectedValue = +e.target.value;
                            setTypeAssignment(selectedValue);

                            if (selectedValue === AssignmentType.code) {
                              setQuestions({
                                problem: "",
                                examples: [
                                  {
                                    input: "",
                                    output: "",
                                  },
                                ],
                                isPassTestCase: true,
                                isPerformanceOnTime: false,
                                timeValue: 0,
                                isPerformanceOnMemory: false,
                                memoryValue: 0,
                                testCases: [
                                  {
                                    input: "",
                                    expectedOutput: "",
                                  },
                                ],
                              });
                            } else {
                              setQuestions([]);
                            }

                            setErrorAddQuestionMessage("");
                          }}
                        >
                          <option value="" disabled selected hidden>
                            Select a type
                          </option>
                          <option value={AssignmentType.quiz}>Quiz</option>

                          {isLimitedTimeCourse && (
                            <option value={AssignmentType.manual}>
                              Manual
                            </option>
                          )}

                          <option value={AssignmentType.code}>Code</option>
                        </select>
                        <FaChevronDown className="arrow-icon" />
                      </div>
                    </div>
                    {isLimitedTimeCourse && (
                      <div className="info">
                        <div className="container-validate">
                          <span>Start date</span>
                        </div>
                        <input
                          type="datetime-local"
                          className="input-form-pi"
                          value={startDate}
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
                          value={duration}
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
                    {isLimitedTimeCourse && (
                      <div className="info">
                        <div className="container-validate">
                          <span>Due date</span>
                        </div>

                        <input
                          type="datetime-local"
                          className="input-form-pi"
                          value={endDate}
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
                                textAlign: "right",
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
            )}
            {Number(typeAssignment) !== AssignmentType.code && (
              <div className="info">
                <span className="overall-span">
                  {totalQuestions}{" "}
                  {totalQuestions <= 1 ? "question" : "questions"} |{" "}
                  {totalMarks || 0} {totalMarks <= 1 ? "mark" : "marks"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          <div className="container-right-assign">
            <span className="title-span">
              Questions
              {+typeAssignment === AssignmentType.quiz && (
                <LuAlignJustify
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowOptionQuiz(!showOptionQuiz)}
                />
              )}
              {+typeAssignment === AssignmentType.manual && (
                <div className="info">
                  <span>Question shuffling</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isShufflingQuestion}
                      onChange={(e) => {
                        setIsShufflingQuestion(e.target.checked);
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              )}
              {+typeAssignment === AssignmentType.code && (
                <div className="info">
                  <span>Show test cases on submission</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isShowTestCases}
                      onChange={(e) => {
                        setIsShowTestCases(e.target.checked);
                      }}
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
                        checked={isShufflingQuestion}
                        onChange={(e) => {
                          setIsShufflingQuestion(e.target.checked);
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="item">
                    <span>Answer shuffling</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isShufflingAnswer}
                        onChange={(e) => {
                          setIsShufflingAnswer(e.target.checked);
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="item">
                    <span>Show answer on submission</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isShowAnswer}
                        onChange={(e) => {
                          setIsShowAnswer(e.target.checked);
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </span>
            {+typeAssignment === AssignmentType.manual && (
              <ManualQuestion
                questions={questions}
                setQuestions={setQuestions}
                inputFileRef={inputFileRef}
              />
            )}
            {+typeAssignment === AssignmentType.quiz && (
              <QuizQuestion
                questions={questions}
                setQuestions={setQuestions}
                inputFileRef={inputFileRef}
              />
            )}
            {+typeAssignment === AssignmentType.code && (
              <div className="assign-info">
                <div className="info">
                  <span>Problem</span>

                  <Form.Control
                    as="textarea"
                    className="input-area-form-pi"
                    placeholder="Type problem here..."
                    value={questions.problem}
                    onChange={(e) =>
                      setQuestions((prevQuestions) => ({
                        ...prevQuestions,
                        problem: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="info" style={{ width: "50%" }}>
                  <span>Language</span>
                  <div className="select-container">
                    <select
                      className="input-form-pi"
                      onChange={handleLanguageChange}
                    >
                      <option value="" disabled selected hidden>
                        {selectedLanguage
                          ? selectedLanguage.languageName
                          : "Select a section"}
                      </option>
                      {listLanguagesCode.map((language, index) => (
                        <option
                          value={language.languageName}
                          key={index}
                          className="option-container"
                        >
                          {language.languageName}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="arrow-icon" />
                  </div>
                </div>
                <div className="info">
                  <span>Example</span>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Input</th>
                        <th>Output</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.examples.map((example, index) => (
                        <tr key={index}>
                          <td style={{ width: "64px" }}> {index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={example.input}
                              onChange={(e) =>
                                handleTableCodeChange(
                                  "examples",
                                  index,
                                  "input",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={example.output}
                              onChange={(e) =>
                                handleTableCodeChange(
                                  "examples",
                                  index,
                                  "output",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td style={{ width: "64px" }}>
                            <button
                              className="del-question btn"
                              style={{ border: "none" }}
                              onClick={() =>
                                handleDeleteRecord("examples", index)
                              }
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4}>
                          <button
                            className="btn add-new-record"
                            onClick={() => handleAddNewRecord("examples")}
                          >
                            <LuPlus />
                            Add new record
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <span
              className={"warning-error"}
              style={{
                color: "var(--red-color)",
                marginLeft: "60px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {errorAddQuestionMessage}
            </span>
            {!(Number(typeAssignment) === AssignmentType.code) && (
              <button className="btn circle-btn" onClick={handleAddQuestion}>
                <TiPlus className="icon" />
              </button>
            )}
          </div>
          {Number(typeAssignment) === AssignmentType.code && (
            <>
              <div className="container-right-assign test-case-scoring">
                <span className="title-span">Test Cases and Scoring Rules</span>{" "}
                <div className="assign-info">
                  <div className="info">
                    <span>Test case</span>
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Input</th>
                          <th>Output</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.testCases.map((testCase, index) => (
                          <tr key={index}>
                            <td style={{ width: "64px" }}> {index + 1}</td>
                            <td>
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) =>
                                  handleTableCodeChange(
                                    "testCases",
                                    index,
                                    "input",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) =>
                                  handleTableCodeChange(
                                    "testCases",
                                    index,
                                    "expectedOutput",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td style={{ width: "64px" }}>
                              <button
                                className="del-question btn"
                                style={{ border: "none" }}
                                onClick={() =>
                                  handleDeleteRecord("testCases", index)
                                }
                              >
                                <FaTrashAlt />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={4}>
                            <button
                              className="btn add-new-record"
                              onClick={() => handleAddNewRecord("testCases")}
                            >
                              <LuPlus />
                              Add new record
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="info" style={{ width: "50%" }}>
                    <span>Scoring rules</span>
                    {/* <div className="check-container">
                      <input
                        type="checkbox"
                        name="isPassTestCase"
                        checked={questions.isPassTestCase || false}
                        onChange={(e) => {
                          setQuestions((prevQuestions) => ({
                            ...prevQuestions,
                            isPassTestCase: e.target.checked,
                          }));
                        }}
                      />
                      <span style={{ color: "var(--black-color)" }}>
                        Pass test cases
                      </span>
                    </div> */}
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isPerformanceOnTime"
                        checked={questions.isPerformanceOnTime || false}
                        onChange={(e) => {
                          setQuestions((prevQuestions) => ({
                            ...prevQuestions,
                            isPerformanceOnTime: e.target.checked,
                          }));
                        }}
                      />
                      <span style={{ color: "var(--black-color)" }}>
                        Performance on time
                      </span>
                    </div>
                    {questions.isPerformanceOnTime && (
                      <div className="select-container">
                        <input
                          type="text"
                          className="input-form-pi"
                          value={questions.timeValue}
                          onChange={handleTimeChange}
                        />
                        <label className="arrow-icon">s</label>
                      </div>
                    )}

                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isPerformanceOnMemory"
                        checked={questions.isPerformanceOnMemory || false}
                        onChange={(e) => {
                          setQuestions((prevQuestions) => ({
                            ...prevQuestions,
                            isPerformanceOnMemory: e.target.checked,
                          }));
                        }}
                      />
                      <span style={{ color: "var(--black-color)" }}>
                        Performance on memory
                      </span>
                    </div>
                    {questions.isPerformanceOnMemory && (
                      <div className="select-container">
                        <input
                          type="number"
                          className="input-form-pi"
                          value={questions.memoryValue}
                          onChange={(e) =>
                            setQuestions((prevQuestions) => ({
                              ...prevQuestions,
                              memoryValue: e.target.value,
                            }))
                          }
                        />
                        <label className="arrow-icon">kb</label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <RunCode
                selectedLanguage={selectedLanguage}
                testCases={questions.testCases}
                isPassTestCase={questions.isPassTestCase}
                isPerformanceOnTime={questions.isPerformanceOnTime}
                timeValue={questions.timeValue}
                isPerformanceOnMemory={questions.isPerformanceOnMemory}
                memoryValue={questions.memoryValue}
              />
            </>
          )}
        </div>
      </div>
      <DiagNotiWarning
        isOpen={isModalInvalidOpen}
        onClose={closeInvalidModal}
        invalidHeader={invalidHeader}
        invalidMsg={invalidMsg}
      />
    </div>
  );
};

export default AddNewAssign;
