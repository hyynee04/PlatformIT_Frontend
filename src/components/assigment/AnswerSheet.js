import React, { useEffect, useState } from "react";
import {
  getAssignmentAnswer,
  getCodeAssignmentResult,
  getDetailAssignmentForStudent,
  postGradingManualAssignment,
} from "../../services/assignmentService";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentResultStatus,
  AssignmentType,
} from "../../constants/constants";
import {
  formatDateTime,
  formatDuration,
  getPagination,
} from "../../functions/function";
import { ImSpinner2 } from "react-icons/im";
import { LuChevronLeft } from "react-icons/lu";
import Form from "react-bootstrap/Form";
import default_image from "../../assets/img/default_image.png";

const AnswerSheet = ({
  idAssignment,
  selectedStudent,
  onClose,
  fetchOverview,
}) => {
  const [loadingAnswerSheet, setLoadingAnswerSheet] = useState(false);
  const [answerInfo, setAnswerInfo] = useState({});
  const [answerItems, setAnswerItems] = useState([]);
  const [codeResult, setCodeResult] = useState({});
  const [idAssignmentResult, setIdAssignmentResult] = useState(null);
  const [gradingManualAssign, setGradingManualAssign] = useState({});

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setLoadingAnswerSheet(true);
      try {
        const response = await getDetailAssignmentForStudent(
          idAssignment,
          selectedStudent.idStudent
        );

        if (response?.status === APIStatus.success) {
          setAnswerInfo(response.data);
          if (response.data.assignmentType === AssignmentType.code) {
            const responseCode = await getCodeAssignmentResult(
              idAssignment,
              selectedStudent.idStudent
            );
            if (responseCode.status === APIStatus.success) {
              setCodeResult(responseCode.data);
            }
          } else {
            const responseAnswerItem = getAssignmentAnswer(
              idAssignment,
              selectedStudent.idStudent
            );
            if (responseAnswerItem.status === APIStatus.success) {
              setAnswerItems(responseAnswerItem.data.detailQuestionResponses);
              setIdAssignmentResult(responseAnswerItem.data.idAssignmentResult);

              setGradingManualAssign({
                ...gradingManualAssign,
                idAssignmentResult: responseAnswerItem.data.idAssignmentResult,
                manualItems:
                  responseAnswerItem.data.detailQuestionResponses.map(
                    (item) => ({
                      idAssignmentResultItem: item.idAssignmentResultItem,
                      mark: item.studentMark || 0,
                    })
                  ),
              });
            }
          }
        } else {
          throw new Error("Failed to fetch assignment data.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAnswerSheet(false); // Tắt loading sau khi hoàn tất công việc
      }
    };

    if (idAssignment && selectedStudent?.idStudent) {
      fetchAndProcessData();
    }
  }, [idAssignment, selectedStudent?.idStudent]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = answerItems.slice(firstIndex, lastIndex);
  const npage = Math.ceil(answerItems.length / recordsPerPage);
  const handleGradeManualAssignment = async () => {
    setLoadingAnswerSheet(true);
    try {
      const response = await postGradingManualAssignment(gradingManualAssign);

      if (response.status === APIStatus.success) {
        fetchOverview();
        onClose();
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingAnswerSheet(false);
    }
  };
  if (loadingAnswerSheet) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div>
      <div className="handle-button result-assign" style={{ border: "none" }}>
        <div
          className="handle-button start"
          style={{
            border: "none",
            justifyContent: "space-between",
            padding: "0",
          }}
        >
          {" "}
          <div className="name-container" style={{ cursor: "pointer" }}>
            <LuChevronLeft strokeWidth="4" onClick={onClose} />
            <label style={{ fontWeight: "bold" }}>Answer sheet</label>
          </div>
          {answerInfo.assignmentType === AssignmentType.manual && (
            <button
              className="btn submit"
              onClick={() => handleGradeManualAssignment()}
            >
              Save Grade
            </button>
          )}
        </div>
        <div className="detail-info name">
          <label style={{ fontSize: "24px", fontWeight: "bold" }}>
            {selectedStudent.nameStudent}
          </label>
        </div>
        <div className="detail-info field-value-container">
          {answerInfo.assignmentType === AssignmentType.code ? (
            <>
              {codeResult.submittedDate && (
                <div className="field-value">
                  <label className="field">Submitted Date</label>
                  <label className="value">
                    {formatDateTime(codeResult.submittedDate)}
                  </label>
                </div>
              )}
              <div className="field-value">
                <label className="field">Status</label>
                <label
                  className={`value status ${
                    codeResult.submissionStatus ===
                      AssignmentResultStatus.onTime ||
                    codeResult.submissionStatus ===
                      AssignmentResultStatus.submitted
                      ? "active"
                      : codeResult.submissionStatus ===
                        AssignmentResultStatus.late
                      ? "pending"
                      : "inactive"
                  }`}
                >
                  {codeResult.submissionStatus === AssignmentResultStatus.onTime
                    ? "On time"
                    : codeResult.submissionStatus ===
                      AssignmentResultStatus.late
                    ? "Late"
                    : codeResult.submissionStatus ===
                      AssignmentResultStatus.submitted
                    ? "Submitted"
                    : "Not submitted"}
                </label>
              </div>
              {codeResult.totalMark && (
                <div className="field-value">
                  <label className="field">Result</label>
                  <label className="value">{codeResult.totalMark * 100}%</label>
                </div>
              )}
              {codeResult.duration && (
                <div className="field-value">
                  <label className="field">Duration</label>
                  <label className="value">
                    {formatDuration(codeResult.duration)}
                  </label>
                </div>
              )}
            </>
          ) : (
            <>
              {answerInfo.submittedDate && (
                <div className="field-value">
                  <label className="field">Submitted Date</label>
                  <label className="value">
                    {formatDateTime(answerInfo.submittedDate)}
                  </label>
                </div>
              )}

              <div className="field-value">
                <label className="field">Status</label>
                <label
                  className={`value status ${
                    answerInfo.resultStatus === AssignmentResultStatus.onTime ||
                    answerInfo.resultStatus === AssignmentResultStatus.submitted
                      ? "active"
                      : answerInfo.resultStatus === AssignmentResultStatus.late
                      ? "pending"
                      : "inactive"
                  }`}
                >
                  {answerInfo.resultStatus === AssignmentResultStatus.onTime
                    ? "On time"
                    : answerInfo.resultStatus === AssignmentResultStatus.late
                    ? "Late"
                    : answerInfo.resultStatus ===
                      AssignmentResultStatus.submitted
                    ? "Submitted"
                    : "Not submitted"}
                </label>
              </div>
              {answerInfo.totalMark && (
                <div className="field-value">
                  <label className="field">Marks</label>
                  <label className="value">{answerInfo.totalMark}</label>
                </div>
              )}
              {answerInfo.resultDuration && (
                <div className="field-value">
                  <label className="field">Duration</label>
                  <label className="value">
                    {formatDuration(answerInfo.resultDuration)}
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="questions-overview-container">
        <div className="questions-container">
          {answerInfo.assignmentType === AssignmentType.code ? (
            <>
              <div className="question-item">
                <div className="info-row">
                  <label className="question-idx" style={{ fontSize: "20px" }}>
                    Problem
                  </label>
                </div>
                <div
                  className="info-row question-text"
                  style={{ width: "100%" }}
                >
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {codeResult.problem.trim()}
                  </p>
                </div>
                <div className="info-row">
                  <span>
                    <label>
                      Language: <strong>{codeResult.languageName}</strong>
                    </label>
                  </span>
                </div>
                <div className="info-row container-right-assign">
                  <div className="info" style={{ flex: "1" }}>
                    <span>
                      <label style={{ color: "var(--black-color)" }}>
                        Example
                      </label>
                    </span>
                    <table className="result-table">
                      <thead>
                        <tr>
                          <th>Input</th>
                          <th>Output</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codeResult.examples.map((example, index) => (
                          <tr key={index}>
                            <td>{example.input}</td>
                            <td>{example.output}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="question-item">
                <div className="container-right-assign testing-code">
                  <div className="assign-info" style={{ padding: 0 }}>
                    <div className="info">
                      <span>Answer: </span>
                      <Form.Control
                        as="textarea"
                        className="input-code-area-form-pi"
                        placeholder="Type source code here..."
                        value={codeResult.sourceCode}
                        readOnly
                      />
                    </div>
                    <div className="info" style={{ width: "50%" }}>
                      <span>Language</span>
                      <div className="select-container">
                        <input
                          style={{ cursor: "default" }}
                          type="text"
                          className="input-form-pi"
                          value={codeResult.languageName}
                          placeholder="Please select a language at questions."
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="info">
                      <span>Result</span>
                      <table className="result-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Pass test case</th>
                            <th>Time</th>
                            <th>Memory</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {codeResult.testCases.map((testcase, index) => (
                            <tr key={index}>
                              <td style={{ width: "64px" }}>
                                {" "}
                                Case {index + 1}
                              </td>
                              <td
                                className={`isPassTestCase ${
                                  testcase.isPassTestCase ? "passed" : "failed"
                                }`}
                              >
                                {testcase.isPassTestCase ? "Passed" : "Failed"}
                              </td>
                              <td
                                className={`${
                                  codeResult.isPerformanceOnTime
                                    ? testcase.isTimeOut
                                      ? "passed"
                                      : "failed"
                                    : ""
                                }`}
                              >
                                {testcase.timeExecuted
                                  ? `${testcase.timeExecuted}kb`
                                  : ""}
                              </td>
                              <td
                                className={`${
                                  codeResult.isPerformanceOnMemory
                                    ? testcase.isOverMemory
                                      ? "passed"
                                      : "failed"
                                    : ""
                                }`}
                              >
                                {testcase.memoryExecuted
                                  ? `${testcase.memoryExecuted}kb`
                                  : ""}
                              </td>
                              <td>{testcase.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            records.map((question, index) => (
              <div className="question-item" key={index}>
                <div className="info-row">
                  <label className="question-idx">{`Question ${
                    firstIndex + index + 1
                  }`}</label>
                  {answerInfo.assignmentType === AssignmentType.manual ? (
                    <label className="question-mark">
                      {`${question.questionMark} ${
                        question.questionMark <= 1 ? "mark" : "marks"
                      }`}
                    </label>
                  ) : (
                    <label className="question-mark">{`${
                      question.studentMark
                    } / ${question.questionMark}  ${
                      question.questionMark <= 1 ? "mark" : "marks"
                    }`}</label>
                  )}
                </div>
                <div className="info-row question-text">
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {question.question.trim()}
                  </p>
                  {answerInfo.assignmentType === AssignmentType.quiz &&
                    question.attachedFile && (
                      <img
                        className="question-img"
                        src={question.attachedFile || default_image}
                        alt=""
                      />
                    )}
                </div>
                {answerInfo.assignmentType === AssignmentType.manual && (
                  <>
                    {question.attachedFile && (
                      <div className="info-row">
                        <div className="info">
                          <>
                            <span>Reference material:</span>

                            <div className="select-container">
                              <input
                                type="text"
                                style={{ cursor: "pointer" }}
                                className="input-form-pi"
                                title={question.nameFile}
                                value={
                                  question.nameFile?.length > 54
                                    ? question.nameFile.slice(0, 54) + "..."
                                    : question.nameFile
                                }
                                onClick={() => {
                                  if (
                                    typeof question.attachedFile === "string"
                                  ) {
                                    const fileUrl = question.attachedFile;
                                    window.open(fileUrl, "_blank");
                                  }
                                }}
                                readOnly
                              />
                            </div>
                          </>
                        </div>
                      </div>
                    )}
                    <div className="info-row manual-answer-marked">
                      <div className="info" style={{ flex: "0.92 1" }}>
                        <span>Answer: </span>
                        {question.answerText && (
                          <Form.Control
                            as="textarea"
                            className="input-area-form-pi"
                            value={question.answerText || ""}
                          />
                        )}
                        {question.answerAttachedFile && (
                          <div className="select-container">
                            <input
                              type="text"
                              style={{ cursor: "pointer" }}
                              className="input-form-pi"
                              title={question.answerNameFile}
                              value={
                                question.answerNameFile.length > 54
                                  ? question.answerNameFile.slice(0, 54) + "..."
                                  : question.answerNameFile
                              }
                              onClick={() => {
                                if (question.answerAttachedFile) {
                                  // Kiểm tra nếu answer chứa URL
                                  window.open(
                                    question.answerAttachedFile,
                                    "_blank"
                                  );
                                }
                              }}
                              readOnly
                            />
                          </div>
                        )}
                      </div>
                      <div className="info" style={{ flex: "0.08 1" }}>
                        <span style={{ textAlign: "right", fontSize: "14px" }}>
                          Marked
                        </span>
                        <input
                          type="text"
                          style={{ textAlign: "right" }}
                          className="input-form-pi"
                          value={
                            gradingManualAssign.manualItems.find(
                              (item) =>
                                item.idAssignmentResultItem ===
                                question.idAssignmentResultItem
                            )?.mark || 0
                          }
                          onChange={(e) => {
                            const newMark = Math.min(
                              Math.max(parseFloat(e.target.value) || 0, 0),
                              question.questionMark
                            );

                            setGradingManualAssign((prev) => ({
                              ...prev,
                              manualItems: prev.manualItems.map((item) =>
                                item.idAssignmentResultItem ===
                                question.idAssignmentResultItem
                                  ? { ...item, mark: newMark }
                                  : item
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
                {answerInfo.assignmentType === AssignmentType.quiz && (
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
                                checked={question.selectedOptions.includes(
                                  choice.idMultipleAssignmentItem
                                )}
                                readOnly
                              />
                            </label>
                            <div className="info" style={{ flex: "1" }}>
                              <input
                                type="text"
                                className="input-form-pi"
                                placeholder="Type a choice"
                                defaultValue={choice.content}
                                style={{
                                  backgroundColor:
                                    question.correctOptions.includes(
                                      choice.idMultipleAssignmentItem
                                    )
                                      ? "#B2E0C8"
                                      : question.selectedOptions.includes(
                                          choice.idMultipleAssignmentItem
                                        )
                                      ? question.correctOptions.includes(
                                          choice.idMultipleAssignmentItem
                                        )
                                        ? "#B2E0C8"
                                        : "#E6B1B0"
                                      : "rgba(217, 217, 217, 0.3)",
                                }}
                                readOnly
                              />
                            </div>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {answerInfo.assignmentType !== AssignmentType.code && (
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
        )}
      </div>
      <div className="assign-info"></div>
    </div>
  );
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default AnswerSheet;
