import React, { useEffect, useState } from "react";
import {
  getAssignmentAnswer,
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
  const [idAssignmentResult, setIdAssignmentResult] = useState(null);
  const [gradingManualAssign, setGradingManualAssign] = useState({});
  // useEffect(() => {
  //   const fetchAssignmentData = async () => {
  //     setLoading(true);
  //     try {
  //       const [response, responseAnswerItem] = await Promise.all([
  //         getDetailAssignmentForStudent(
  //           idAssignment,
  //           selectedStudent.idStudent
  //         ),
  //         getAssignmentAnswer(idAssignment, selectedStudent.idStudent),
  //       ]);

  //       if (response?.status === APIStatus.success) {
  //         setAnswerInfo(response.data);
  //       } else {
  //         throw new Error("Failed to fetch assignment data.");
  //       }

  //       if (responseAnswerItem?.status === APIStatus.success) {
  //         setAnswerItems(responseAnswerItem.data.detailQuestionResponses);
  //         setIdAssignmentResult(responseAnswerItem.data.idAssignmentResult);
  //       } else {
  //         throw new Error("Failed to fetch answer items.");
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (idAssignment && selectedStudent?.idStudent) {
  //     fetchAssignmentData();
  //   }
  // }, [idAssignment, selectedStudent?.idStudent]);
  // useEffect(() => {
  //   setGradingManualAssign({
  //     ...gradingManualAssign,
  //     idAssignmentResult: idAssignmentResult,
  //     manualItems: answerItems.map((item) => ({
  //       idAssignmentResultItem: item.idAssignmentResultItem, // Lấy từ answerItems
  //       mark: item.studentMark || 0,
  //     })),
  //   });
  // }, [answerItems, idAssignmentResult]);
  //PAGINATION
  useEffect(() => {
    const fetchAndProcessData = async () => {
      setLoadingAnswerSheet(true); // Bật loading trước khi fetch
      try {
        const [response, responseAnswerItem] = await Promise.all([
          getDetailAssignmentForStudent(
            idAssignment,
            selectedStudent.idStudent
          ),
          getAssignmentAnswer(idAssignment, selectedStudent.idStudent),
        ]);

        // Xử lý dữ liệu nếu fetch thành công
        if (response?.status === APIStatus.success) {
          setAnswerInfo(response.data);
        } else {
          throw new Error("Failed to fetch assignment data.");
        }

        if (responseAnswerItem?.status === APIStatus.success) {
          setAnswerItems(responseAnswerItem.data.detailQuestionResponses);
          setIdAssignmentResult(responseAnswerItem.data.idAssignmentResult);

          // Tiến hành cập nhật `gradingManualAssign` sau khi lấy đủ thông tin
          setGradingManualAssign({
            ...gradingManualAssign,
            idAssignmentResult: responseAnswerItem.data.idAssignmentResult,
            manualItems: responseAnswerItem.data.detailQuestionResponses.map(
              (item) => ({
                idAssignmentResultItem: item.idAssignmentResultItem,
                mark: item.studentMark || 0,
              })
            ),
          });
        } else {
          throw new Error("Failed to fetch answer items.");
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
                : answerInfo.resultStatus === AssignmentResultStatus.submitted
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
        </div>
      </div>
      <div className="questions-overview-container">
        <div className="questions-container">
          {records.map((question, index) => (
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
                                if (typeof question.attachedFile === "string") {
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
                                question.isMultipleAnswer ? "checkbox" : "radio"
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
                              // style={{
                              //   backgroundColor:
                              //     question.selectedOptions.includes(
                              //       choice.idMultipleAssignmentItem
                              //     )
                              //       ? question.selectedOptions.includes(
                              //           choice.idMultipleAssignmentItem
                              //         ) &&
                              //         question.selectedOptions.includes(
                              //           choice.idMultipleAssignmentItem
                              //         ) ===
                              //           question.correctOptions.includes(
                              //             choice.idMultipleAssignmentItem
                              //           )
                              //         ? "#B2E0C8"
                              //         : "#E6B1B0"
                              //       : "rgba(217, 217, 217, 0.3)",
                              // }}
                              style={{
                                backgroundColor:
                                  question.correctOptions.includes(
                                    choice.idMultipleAssignmentItem
                                  )
                                    ? "#B2E0C8" // Luôn hiển thị đáp án đúng màu xanh
                                    : question.selectedOptions.includes(
                                        choice.idMultipleAssignmentItem
                                      )
                                    ? question.correctOptions.includes(
                                        choice.idMultipleAssignmentItem
                                      )
                                      ? "#B2E0C8" // Người dùng chọn đúng
                                      : "#E6B1B0" // Người dùng chọn sai
                                    : "rgba(217, 217, 217, 0.3)", // Các lựa chọn khác
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
          ))}
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
      <div className="assign-info"></div>
    </div>
  );
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default AnswerSheet;
