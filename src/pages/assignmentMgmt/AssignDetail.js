import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAssignmentInfo,
  getDetailAssignmentForStudent,
  postUpdateAssignment,
} from "../../services/courseService";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentType,
  Role,
} from "../../constants/constants";
import {
  LuChevronRight,
  LuFilter,
  LuChevronDown,
  LuMoreHorizontal,
  LuCheckCircle,
  LuX,
} from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { ImSpinner2 } from "react-icons/im";

import { formatDateTime, getPagination } from "../../functions/function";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import default_image from "../../assets/img/default_image.png";
import "../../assets/css/AssignmentDetail.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AssignDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [idRole, setIdRole] = useState(Number(localStorage.getItem("idRole")));
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [questions, setQuestions] = useState([]);
  const [activeChoice, setActiveChoice] = useState("question");
  useEffect(() => {
    const fetchAssignmentData = async (idAssignment) => {
      setLoading(true);
      try {
        let response;
        if (idRole === Role.teacher) {
          response = await getAssignmentInfo(idAssignment);
        } else if (idRole === Role.student) {
          response = await getDetailAssignmentForStudent(idAssignment);
        }
        if (response.status === APIStatus.success) {
          const fetchedAssignmentInfo = response.data;
          setAssignmentInfo(fetchedAssignmentInfo);
          if (idRole === Role.teacher) {
            setQuestions(fetchedAssignmentInfo.assignmentItems);
          }
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
  }, [location]);
  const totalQuestions = questions.length;

  const totalMarks = questions.reduce(
    (acc, question) => acc + Number(question.mark),
    0
  );

  const handleChoiceClick = (choice) => {
    setActiveChoice(choice);
  };
  const data = {
    labels: ["Not Submitted", "Submitted Late", "Submitted on Time"], // Labels for your chart
    datasets: [
      {
        data: [8, 10, 30], // Data for each category
        backgroundColor: ["#d9d9d9", "#ffcc00", "#14ae5c"], // Colors for the segments
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };
  const [searchTerm, setSearchTerm] = useState("");

  //FILTER
  const [filterVisble, setFilterVisble] = useState(false);
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterVisble(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const [isTest, setIsTest] = useState("all");
  const [assignmentType, setAssignmentType] = useState("all");

  const [tempIsTest, setTempIsTest] = useState("all");
  const [tempAssignmentType, setTempAssignmentType] = useState("all");

  //SORT BY
  const [sortByVisible, setSortByVisible] = useState(false);
  const sortByRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortByRef.current && !sortByRef.current.contains(event.target)) {
        setSortByVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortByRef]);
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const [tempSortField, setTempSortField] = useState("createdDate");
  const [tempSortOrder, setTempSortOrder] = useState("desc");
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = questions.slice(firstIndex, lastIndex);
  const npage = Math.ceil(questions.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  //OPTION QUIZ
  const [showOption, setShowOption] = useState(false);
  const optionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Kiểm tra nếu nhấp bên ngoài cả optionRef và buttonRef
      if (
        optionRef.current &&
        !optionRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleUpdateAssignment = async (field, value) => {
    const updatedAssignmentInfo = { ...assignmentInfo, [field]: value };
    setAssignmentInfo(updatedAssignmentInfo);

    const dataToSubmit = {
      idAssignment: updatedAssignmentInfo.idAssignment,
      title: updatedAssignmentInfo.title,
      isTest: isTest,
      startDate: updatedAssignmentInfo.startDate || "",
      endDate: updatedAssignmentInfo.dueDate || "",
      duration: updatedAssignmentInfo.duration || "",
      assignmentType: Number(updatedAssignmentInfo.assignmentType),
      isPublish: 1,
      isShufflingQuestion: updatedAssignmentInfo.isShufflingQuestion,
      isShufflingAnswer: updatedAssignmentInfo.isShufflingAnswer,
      isShowAnswer: updatedAssignmentInfo.isShowAnswer,
      assignmentStatus: updatedAssignmentInfo.assignmentStatus,
      questions: questions,
    };
    // setLoading(true);
    try {
      const response = await postUpdateAssignment(dataToSubmit);

      if (response.status === APIStatus.success) {
        console.log("Updated successfully!");
      } else {
        console.error("Error updating assignment:", response?.message);
      }
    } catch (error) {
      console.error("Failed to update assignment:", error);
    } finally {
      // setLoading(false);
      // setShowOption(false);
    }
  };
  const [diagStartAssign, setDiagStartAssign] = useState(false);
  const handleOpenStartAssign = () => {
    setDiagStartAssign(true);
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
      <div className="main-contain-assign">
        <div className="assign-info">
          <div>
            <div className="info-row">
              <div className="detail-info name">
                <label>{assignmentInfo.title}</label>
              </div>
              <div className="detail-info">
                <span className="marks-questions">
                  {idRole === Role.teacher && (
                    <>
                      <label>
                        {totalMarks || 0} {totalMarks <= 1 ? "mark" : "marks"}
                      </label>

                      <GoDotFill strokeWidth={1} />
                      <label>
                        {totalQuestions}{" "}
                        {totalQuestions <= 1 ? "question" : "questions"}
                      </label>

                      <button
                        ref={buttonRef}
                        className="btn"
                        onClick={() => setShowOption(!showOption)}
                      >
                        <LuMoreHorizontal />
                      </button>
                    </>
                  )}
                  {idRole === Role.student && (
                    <label>
                      {assignmentInfo.questionQuantity}{" "}
                      {assignmentInfo.questionQuantity <= 1
                        ? "question"
                        : "questions"}
                    </label>
                  )}
                </span>
              </div>
              {showOption && (
                <div
                  className="container-options assign-setting-option published"
                  ref={optionRef}
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
                            "isShowAnswer",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="info-row">
              <div className="name-container">
                <label className="name-course">
                  {assignmentInfo.courseTitle}
                </label>
                {assignmentInfo.idSection && (
                  <>
                    <LuChevronRight className="icon" />
                    <label className="name-course">
                      {assignmentInfo.nameSection}
                    </label>
                  </>
                )}
                {assignmentInfo.idLecture && (
                  <>
                    <LuChevronRight className="icon" />
                    <label className="name-course">
                      {assignmentInfo.nameLecture}
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="detail-info field-value-container">
              <div className="field-value">
                <label className="field">Type</label>
                <label className="value">
                  {assignmentInfo.assignmentType === AssignmentType.code
                    ? "Code"
                    : assignmentInfo.assignmentType === AssignmentType.quiz
                    ? "Quiz"
                    : "Manual"}
                </label>
              </div>
              {assignmentInfo.duration > 0 && (
                <div className="field-value">
                  <label className="field">Duration</label>
                  <label className="value">
                    {`${assignmentInfo.duration} ${
                      assignmentInfo.duration === 1 ? "minute" : "minutes"
                    }`}
                  </label>
                </div>
              )}
              {assignmentInfo.startDate && (
                <div className="field-value">
                  <label className="field">Start date</label>
                  <label className="value">
                    {formatDateTime(assignmentInfo.startDate)}
                  </label>
                </div>
              )}
              {assignmentInfo.dueDate && (
                <div className="field-value">
                  <label className="field">Due date</label>
                  <label className="value">
                    {formatDateTime(assignmentInfo.dueDate)}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        {idRole === Role.teacher && (
          <div className="handle-button">
            <button
              className={`btn ${activeChoice === "question" ? "active" : ""}`}
              onClick={() => handleChoiceClick("question")}
            >
              Questions
            </button>
            <button
              className={`btn ${activeChoice === "overview" ? "active" : ""}`}
              onClick={() => handleChoiceClick("overview")}
            >
              Overview
            </button>
          </div>
        )}
        {idRole === Role.student && !assignmentInfo.submittedDate && (
          <div className="handle-button start">
            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenStartAssign();
              }}
            >
              Start
            </button>
          </div>
        )}

        <div className="questions-overview-container">
          {idRole === Role.teacher && (
            <>
              {activeChoice === "question" && (
                <div className="questions-container">
                  {records.map((question, index) => (
                    <div className="question-item" key={index}>
                      <div className="info-row">
                        <label className="question-idx">{`Question ${
                          index + 1
                        }`}</label>
                        <label className="question-mark">{`${question.mark} ${
                          question.mark <= 1 ? "mark" : "marks"
                        }`}</label>
                      </div>
                      <div className="info-row question-text">
                        <p style={{ whiteSpace: "pre-wrap" }}>
                          {question.question.trim()}
                        </p>
                        {assignmentInfo.assignmentType ===
                          AssignmentType.quiz &&
                          question.attachedFile && (
                            <img
                              className="question-img"
                              src={question.attachedFile || default_image}
                              alt=""
                            />
                          )}
                      </div>
                      {assignmentInfo.assignmentType ===
                        AssignmentType.manual && (
                        <>
                          <div className="info-row">
                            <div className="info">
                              {question.attachedFile && (
                                <>
                                  <span>Reference material:</span>

                                  <div className="select-container">
                                    <input
                                      type="text"
                                      style={{ cursor: "pointer" }}
                                      className="input-form-pi"
                                      title={question.nameFile}
                                      defaultValue={
                                        question.nameFile?.length > 54
                                          ? question.nameFile.slice(0, 54) +
                                            "..."
                                          : question.nameFile
                                      }
                                      onClick={() => {
                                        if (
                                          typeof question.attachedFile ===
                                          "string"
                                        ) {
                                          // Kiểm tra nếu attachedFile là URL
                                          const fileUrl = question.attachedFile;
                                          window.open(fileUrl, "_blank");
                                        }
                                      }}
                                      readOnly
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="info-row answer-manual-type">
                            <span>
                              <label style={{ color: "var(--text-gray)" }}>
                                Type of anwer:{" "}
                              </label>
                              <label>
                                {question.assignmentItemAnswerType ===
                                AssignmentItemAnswerType.attached_file
                                  ? " Attach file"
                                  : " Text"}
                              </label>
                            </span>
                          </div>
                        </>
                      )}
                      {assignmentInfo.assignmentType ===
                        AssignmentType.quiz && (
                        <div className="info-row choices-container">
                          <label style={{ fontSize: "14px", fontWeight: 800 }}>
                            Choices
                          </label>
                          {question.items.map(
                            (choice, choiceIdx) =>
                              choice.multipleAssignmentItemStatus === 1 && (
                                <div
                                  className="info-in-row"
                                  key={choiceIdx}
                                  style={{ width: "100%" }}
                                >
                                  <label className="radio-choice">
                                    <input
                                      type={
                                        question.isMultipleAnswer
                                          ? "checkbox"
                                          : "radio"
                                      }
                                      name={`question_${index}`}
                                      defaultChecked={choice.isCorrect}
                                    />
                                  </label>
                                  <div className="info" style={{ flex: "1" }}>
                                    <input
                                      type="text"
                                      className="input-form-pi"
                                      placeholder="Type a choice"
                                      defaultValue={choice.content}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeChoice === "overview" && (
                <div className="overview-container">
                  <div className="chart-detail-container">
                    <div>
                      <div className="chart">
                        <Doughnut data={data} options={options} />
                      </div>
                      <span>
                        <label className="number">48</label>
                        <label style={{ color: "var(--text-gray)" }}>
                          Attendees
                        </label>
                      </span>
                    </div>

                    <div className="chart-detail">
                      <div className="detail">
                        <label className="number">48</label>
                        <label>
                          <GoDotFill className="status-submit-dot not-submitted" />
                          Not submitted
                        </label>
                      </div>
                      <div className="detail">
                        <label className="number">48</label>
                        <label>
                          <GoDotFill className="status-submit-dot submitted" />
                          Submmitted
                        </label>
                      </div>
                      <div className="detail">
                        <label className="number">48</label>
                        <label>
                          <GoDotFill className="status-submit-dot submitted-late" />
                          Submitted late
                        </label>
                      </div>
                      <div className="detail">
                        <label className="number">48</label>
                        <label>
                          <GoDotFill className="status-submit-dot submitted" />
                          Submitted on time
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="attendee-list">
                    <div className="handle-page-container">
                      <label style={{ fontSize: "24px", fontWeight: "bold" }}>
                        Attendees
                      </label>
                      <div className="filter-search-assign">
                        <div className="filter-sort-btns">
                          <button
                            className="btn"
                            onClick={() => {
                              setFilterVisble(!filterVisble);
                            }}
                          >
                            <LuFilter className="icon" />
                            <span>Filter</span>
                          </button>
                          {filterVisble && (
                            <div
                              ref={filterRef}
                              className="filter-container attendees"
                            >
                              <div className="title-filter">
                                <span>Filter</span>
                              </div>
                              <div className="main-filter">
                                <div className="field-filter">
                                  <span className="label-field">Status</span>
                                  <label className="radio-container status">
                                    <input
                                      type="radio"
                                      value="manual"
                                      checked={
                                        tempAssignmentType ===
                                        AssignmentType.manual
                                      }
                                      onChange={() =>
                                        setTempAssignmentType(
                                          AssignmentType.manual
                                        )
                                      }
                                    />
                                    On time
                                  </label>
                                  <label className="radio-container status">
                                    <input
                                      type="radio"
                                      value="quiz"
                                      checked={
                                        tempAssignmentType ===
                                        AssignmentType.quiz
                                      }
                                      onChange={() =>
                                        setTempAssignmentType(
                                          AssignmentType.quiz
                                        )
                                      }
                                    />
                                    Late
                                  </label>
                                  <label className="radio-container status">
                                    <input
                                      type="radio"
                                      value="code"
                                      checked={
                                        tempAssignmentType ===
                                        AssignmentType.code
                                      }
                                      onChange={() =>
                                        setTempAssignmentType(
                                          AssignmentType.code
                                        )
                                      }
                                    />
                                    Not submitted
                                  </label>
                                  <label className="radio-container status">
                                    <input
                                      type="radio"
                                      value="all"
                                      checked={tempAssignmentType === "all"}
                                      onChange={() =>
                                        setTempAssignmentType("all")
                                      }
                                    />
                                    All
                                  </label>
                                </div>
                              </div>
                              <div className="btn-filter">
                                <button
                                  className="btn cancel-filter"
                                  onClick={() => setFilterVisble(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn save-filter"
                                  onClick={() => {
                                    setIsTest(tempIsTest);
                                    setAssignmentType(tempAssignmentType);
                                    setFilterVisble(false);
                                  }}
                                >
                                  Filter
                                </button>
                              </div>
                            </div>
                          )}
                          <button
                            className="btn"
                            onClick={() => {
                              setSortByVisible(!sortByVisible);
                            }}
                          >
                            <span>Sort by</span>
                            <LuChevronDown className="icon" />
                          </button>
                          {sortByVisible && (
                            <div
                              ref={sortByRef}
                              className="filter-container attendees"
                            >
                              <div className="title-filter">
                                <span>Sort</span>
                              </div>
                              <div className="main-filter">
                                <div className="field-filter">
                                  <span className="label-field">Sort by</span>
                                  <div className="select-sort-container">
                                    <select
                                      className="input-sortby"
                                      value={tempSortField}
                                      onChange={(e) =>
                                        setTempSortField(e.target.value)
                                      }
                                    >
                                      <option value="student">Student</option>
                                      <option value="submittedDate">
                                        Subimitted date
                                      </option>
                                      <option value="duration">Duration</option>
                                      <option value="marks">Marks</option>
                                    </select>
                                  </div>
                                  <div className="select-sort-container">
                                    <select
                                      className="input-sortby"
                                      value={tempSortOrder}
                                      onChange={(e) =>
                                        setTempSortOrder(e.target.value)
                                      }
                                    >
                                      <option value="asc">Ascending</option>
                                      <option value="desc">Descending</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className="btn-filter">
                                <button
                                  className="btn cancel-filter"
                                  onClick={() => setSortByVisible(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn save-filter"
                                  onClick={() => {
                                    setSortField(tempSortField);
                                    setSortOrder(tempSortOrder);
                                    setSortByVisible(false);
                                  }}
                                >
                                  Sort
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="search-container">
                          <input
                            type="text"
                            className="search-field"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="list-container"
                      style={{ margin: "0", width: "100%" }}
                    >
                      <table>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Student</th>
                            <th>Submitted Date</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                          </tr>
                          <tr>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                            <td>name</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="pagination">
          {getPagination(currentPage, npage).map((n, i) => (
            <button
              key={i}
              className={`page-item ${currentPage === n ? "active" : ""}`}
              onClick={() => changeCPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      {diagStartAssign && (
        <div
          className="modal-overlay"
          onClick={() => setDiagStartAssign(false)}
        >
          <div
            className="modal-container slide-to-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="diag-header">
              <div className="container-title">
                <LuCheckCircle className="diag-icon" />
                <span className="diag-title">Confirmation</span>
              </div>
              <LuX
                className="diag-icon"
                onClick={() => setDiagStartAssign(false)}
              />
            </div>
            <div className="diag-body">
              <span>
                You have only <b style={{ color: "var(--red-color)" }}>1</b>{" "}
                attempt to complete this assignment.
                <br />
                Are you sure you want to start?
              </span>

              <div className="str-btns">
                <div className="act-btns">
                  <button
                    className="btn diag-btn cancel"
                    onClick={() => setDiagStartAssign(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn diag-btn signout"
                    onClick={() =>
                      navigate("/startAssignment", {
                        state: {
                          idAssignment: assignmentInfo.idAssignment,
                        },
                      })
                    }
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default AssignDetail;
