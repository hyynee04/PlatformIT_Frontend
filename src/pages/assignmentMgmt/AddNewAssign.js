import React, { useEffect, useRef, useState } from "react";
import { FaCalendar, FaChevronDown, FaSave } from "react-icons/fa";
import { LuAlignJustify, LuChevronLeft, LuChevronRight } from "react-icons/lu";
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
import { formatDate } from "../../functions/function";
import {
  postAddManualAssignment,
  postAddQuizAssignment,
} from "../../services/assignmentService";
import {
  getAllActiveCourseOfTeacher,
  getAllActiveLecturesOfCoure,
  getAllActiveSectionOfCourse,
} from "../../services/courseService";

const AddNewAssign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingBtn, setLoadingBtn] = useState({
    save: false,
    publish: false,
  });

  const [title, setTitle] = useState("");
  //IS TEST
  const [isTest, setIsTest] = useState(false);
  //COURSE
  const [isAddByCourse, setIsAddByCourse] = useState(false);
  const [isAddByLecture, setIsAddByLecture] = useState(false);
  const [listCourse, setListCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLimitedTimeCourse, setIsLimitedTimeCourse] = useState(false);
  useEffect(() => {
    const state = location.state;
    if (state) {
      if (state.idLecture) {
        setIsAddByLecture(true);
        setSelectedLecture(state.idLecture);
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
  // const handleCourseChange = (event) => {
  //   const selectedCourseTitle = event.target.value;
  //   const course = listCourse.find(
  //     (c) => c.courseTitle === selectedCourseTitle
  //   );
  //   setSelectedCourse(course);
  // };
  const [isDropdownCourseVisible, setDropdownCourseVisible] = useState(false);

  // const handleInputCourseClick = () => {
  //   setDropdownCourseVisible(!isDropdownCourseVisible);
  // };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSection(null);
    setSelectedLecture(null);
    setDropdownCourseVisible(false);
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
  const [listSection, setListSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isDropdownSectionVisible, setDropdownSectionVisible] = useState(false);

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
  const [listLecture, setListLecture] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isDropdownLectureVisible, setDropdownLectureVisible] = useState(false);
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
  //TYPE ASSIGNMENT
  const [typeAssignment, setTypeAssignment] = useState(null);

  //TIME
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
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
  const [isShufflingQuestion, setIsShufflingQuestion] = useState(false);
  const [isShufflingAnswer, setIsShufflingAnswer] = useState(false);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
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
  //QUESTION
  const [questions, setQuestions] = useState([]);
  const inputFileRef = useRef([]);
  // const [selectedFile, setSelectedFile] = useState([]);
  const [errorAddQuestionMessage, setErrorAddQuestionMessage] = useState("");
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

  const totalMarks = questions.reduce(
    (acc, question) => acc + Number(question.mark),
    0
  );
  //HANDLE ADD ASSIGNMENT
  const isFormValid = () => {
    if (title === "") return false;
    if (!selectedCourse) return false;
    if (!isLimitedTimeCourse && (!selectedLecture || !selectedLecture))
      return false;
    if (!typeAssignment) return false;
    if (errorMessage !== "") return false;
    if (questions.length <= 0) return false;
    for (const question of questions) {
      if (!question.question || question.question.trim() === "") return false;
      if (!question.mark || question.mark <= 0) return false;
      if (+typeAssignment === AssignmentType.quiz) {
        if (question.items.length < 2) return false;
        const hasCorrectAnswer = question.items.some((item) => item.isCorrect);
        if (!hasCorrectAnswer) return false;
        for (const item of question.items) {
          if (!item.content || item.content.trim() === "") return false; // Kiểm tra content của từng item
        }
      }
    }
    if (!isTest && (!selectedSection || !selectedLecture)) return false;
    return true;
  };
  const handleAddAssignment = async (isPublish) => {
    const dataToSubmit = {
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

      if (+typeAssignment === AssignmentType.manual) {
        response = await postAddManualAssignment(dataToSubmit);
      } else if (+typeAssignment === AssignmentType.quiz) {
        response = await postAddQuizAssignment(dataToSubmit);
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
          navigate("/teacherAssignment");
        }
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

  return (
    <div>
      <div className="assign-span">
        <div className="left-assign-span">
          <span
            style={{ fontWeight: "800", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          >
            <LuChevronLeft stroke-width="4" />
            Create new assignment
          </span>
          <div className="name-container">
            {isAddByCourse && (
              <span className="name-course">{selectedCourse.courseTitle}</span>
            )}
            {isAddByLecture && (
              <div className="name-sub-container">
                <span className="name-course">Name Course</span>
                <LuChevronRight className="icon" />
                <span className="name-course">Name Section</span>
                <LuChevronRight className="icon" />
                <span className="name-course">Name Lecture</span>
              </div>
            )}
          </div>
        </div>

        <div className="action-btns-form">
          <div className="container-button">
            <button
              className="btn save"
              disabled={!isFormValid()}
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
              className="btn publish"
              disabled={!isFormValid()}
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
            {!isAddByCourse && (
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
                {!isAddByCourse && (
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
                            setTypeAssignment(e.target.value);
                            setQuestions([]);
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
            {+typeAssignment === AssignmentType.quiz ? (
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
                    checked={isShufflingQuestion}
                    onChange={(e) => {
                      setIsShufflingQuestion(e.target.checked);
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
          <button className="btn circle-btn" onClick={handleAddQuestion}>
            <TiPlus className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAssign;
