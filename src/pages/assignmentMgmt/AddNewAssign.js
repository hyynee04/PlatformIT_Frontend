import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentType,
} from "../../constants/constants";
import "../../assets/scss/Assignment.css";
import {
  getAllActiveCourseOfTeacher,
  postAddManualAssignment,
} from "../../services/courseService";
import NewManualQuestion from "../../components/assigment/NewManualQuestion";

const AddNewAssign = () => {
  const [title, setTitle] = useState("");
  //COURSE
  const [listCourse, setListCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLimitedTimeCourse, setIsLimitedTimeCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getAllActiveCourseOfTeacher();
      if (response.status === APIStatus.success) {
        const sortedCourses = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setListCourse(sortedCourses);
      }
    };
    fetchCourses();
  }, []);
  const handleCourseChange = (event) => {
    const selectedCourseTitle = event.target.value;
    const course = listCourse.find((c) => c.title === selectedCourseTitle);
    setSelectedCourse(course);
  };

  useEffect(() => {
    if (selectedCourse) {
      //get all lecture of course

      //unlimited course setting: không có manual assignment, bắc buộc phải thuộc 1 lecture nào đó
      if (selectedCourse.isLimitedTime === 1) {
        setIsLimitedTimeCourse(true);
      } else {
        setIsLimitedTimeCourse(false);
      }
    }
  }, [selectedCourse]);
  //IS TEST
  const [isTest, setIsTest] = useState(false);

  //SECTION
  const [selectedSection, setSelectedSection] = useState(null);

  //LECTURE
  const [selectedLecture, setSelectedLecture] = useState(null);

  //TYPE ASSIGNMENT
  const [typeAssignment, setTypeAssignment] = useState(null);

  //TIME
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Hàm kiểm tra endDate không được sớm hơn startDate cộng duration
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
    setIsValid(validateForm(value, endDate, duration, selectedCourse.endDate));
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    setIsValid(
      validateForm(startDate, value, duration, selectedCourse.endDate)
    );
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;
    setDuration(value);
    setIsValid(validateForm(startDate, endDate, value, selectedCourse.endDate));
  };

  //ISSHUFFLINGQUESTION
  const [isShufflingQuestion, setIsShufflingQuestion] = useState(false);

  //QUESTION
  const [questions, setQuestions] = useState([]);
  const inputFileRef = useRef([]);
  // const [selectedFile, setSelectedFile] = useState([]);

  const handleAddQuestion = () => {
    if (+typeAssignment === AssignmentType.manual) {
      setQuestions([
        ...questions,
        {
          question: "", //Question
          mark: "", //Mark
          assignmentItemAnswerType: AssignmentItemAnswerType.text, //AssignmentItemAnswerType
          attachedFile: null, //AttachedFile
        },
      ]);
    }
    console.log("Question added:", questions);
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
    if (!isLimitedTimeCourse && (!selectedSection || !selectedLecture))
      return false;
    if (!typeAssignment) return false;
    if (errorMessage !== "") return false;
    if (questions.length <= 0) return false;
    for (const question of questions) {
      if (!question.question || question.question.trim() === "") return false;
      if (!question.mark || question.mark <= 0) return false;
    }
    if (!isTest && (!selectedSection || !selectedLecture)) return false;
    return true;
  };
  const handleAddAssignment = async (isPublish) => {
    const dataToSubmit = {
      title: title,
      idCourse: selectedCourse.idCourse,
      isTest: isTest,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      assignmentType: Number(typeAssignment),
      isPublish: isPublish,
      isShufflingQuestion: isShufflingQuestion,
      questions: questions,
    };
    console.log(dataToSubmit);
    try {
      await postAddManualAssignment(dataToSubmit);
      // await dispatchInfo(fetchCenterProfile());
      // setUpdateStr("Center information has been updated successfully!");

      // setTimeout(() => {
      //   setUpdateStr("");
      // }, 3000);
    } catch (error) {
      // setUpdateStr("There was an error updating center information.");
      throw error;
    }
  };
  return (
    <div>
      <div className="container-pi">
        <div className="container-left-assign">
          <span className="title-span">Create new assignment</span>
          <div className="assign-info">
            <div className="info">
              <span>
                Title<span class="required">*</span>
              </span>
              <input
                type="text"
                className="input-form-pi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="info">
              <span>
                Add to course<span class="required">*</span>
              </span>
              <div className="select-container">
                <select className="input-form-pi" onChange={handleCourseChange}>
                  <option value="" disabled selected hidden>
                    Select a course
                  </option>
                  {listCourse.map((course, index) => (
                    <option value={course.title} key={index}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="arrow-icon" />
              </div>
            </div>
            {selectedCourse && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div className="info">
                  <div className="check-container">
                    <input
                      type="checkbox"
                      name="isAttendLimited"
                      checked={!isLimitedTimeCourse || !isTest} // Nếu không phải limitedTimeCourse thì luôn checked, nếu có thì dựa vào !isTest
                      disabled={!isLimitedTimeCourse} // Vô hiệu hóa checkbox nếu không phải limitedTimeCourse
                      onChange={(e) => {
                        if (isLimitedTimeCourse) {
                          setIsTest(!e.target.checked); // Cập nhật isTest ngược lại với trạng thái checked của checkbox
                        }
                      }}
                    />
                    <span style={{ color: "var(--black-color)" }}>
                      This is an exercise of a lecture.
                      {!isLimitedTimeCourse && <span class="required">*</span>}
                    </span>
                  </div>
                  <div className="select-container">
                    <select className="input-form-pi">
                      <option value="" disabled selected hidden>
                        Section
                      </option>
                    </select>
                    <FaChevronDown className="arrow-icon" />
                  </div>
                  <div className="select-container">
                    <select className="input-form-pi">
                      <option value="" disabled selected hidden>
                        Lecture
                      </option>
                    </select>
                    <FaChevronDown className="arrow-icon" />
                  </div>
                </div>
                <div className="container-field">
                  <div className="container-left">
                    <div className="info">
                      <span>
                        Type<span class="required">*</span>
                      </span>
                      <div className="select-container">
                        <select
                          className="input-form-pi"
                          onChange={(e) => setTypeAssignment(e.target.value)}
                        >
                          <option value="" disabled selected hidden></option>
                          {isLimitedTimeCourse && (
                            <option value={AssignmentType.manual}>
                              Manual
                            </option>
                          )}
                          <option value={AssignmentType.quiz}>Quiz</option>
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
                          class="input-form-pi"
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
          <div className="action-btns-form">
            <div className="container-button">
              <button
                className="btn publish"
                disabled={!isFormValid()}
                onClick={() => handleAddAssignment(true)}
              >
                Publish
              </button>
              <button
                className="btn save"
                disabled={!isFormValid()}
                onClick={() => handleAddAssignment(false)}
              >
                Save
              </button>
            </div>
            <div className="container-button">
              <button
                className="btn delete"
                // onClick={handleDiscardChanges}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="container-right-assign">
          <span className="title-span">
            Questions{" "}
            <div className="info">
              <span>Question shuffling</span>
              <label class="switch">
                <input
                  type="checkbox"
                  checked={isShufflingQuestion}
                  onChange={(e) => {
                    setIsShufflingQuestion(e.target.checked);
                  }}
                />
                <span class="slider"></span>
              </label>
            </div>
          </span>
          {+typeAssignment === AssignmentType.manual && (
            <NewManualQuestion
              questions={questions}
              setQuestions={setQuestions}
              inputFileRef={inputFileRef}
            />
          )}

          <button className="btn circle-btn" onClick={handleAddQuestion}>
            <TiPlus className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewAssign;
