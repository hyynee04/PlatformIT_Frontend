import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, fromZonedTime } from "date-fns-tz";
import {
  getDetailAssignmentForStudent,
  getDetailAssignmentItemForStudent,
  postSubmitManualQuestion,
  postSubmitQuizAssignment,
} from "../../services/assignmentService";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentResultStatus,
  AssignmentType,
} from "../../constants/constants";
import { getPagination, shuffleArray } from "../../functions/function";
import { LuCheckCircle, LuX } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import Form from "react-bootstrap/Form";
import default_image from "../../assets/img/default_image.png";
import "../../assets/css/AssignmentDetail.css";

const StartAssign = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async (idAssignment) => {
      setLoading(true);
      try {
        const [assignmentRes, questionsRes] = await Promise.all([
          getDetailAssignmentForStudent(idAssignment),
          getDetailAssignmentItemForStudent(idAssignment),
        ]);

        if (assignmentRes.status === APIStatus.success) {
          setAssignmentInfo(assignmentRes.data);
        }
        if (questionsRes.status === APIStatus.success) {
          let updatedQuestions = questionsRes.data;
          if (assignmentRes.data.isShufflingQuestion === 1) {
            updatedQuestions = shuffleArray(updatedQuestions);
          }

          if (assignmentRes.data.assignmentType === AssignmentType.quiz) {
            updatedQuestions = updatedQuestions.map((question) => {
              let updatedItems = question.items.map((item) => ({
                ...item,
                isSelected: false,
              }));
              if (assignmentRes.data.isShufflingAnswer === 1) {
                updatedItems = shuffleArray(updatedItems);
              }

              return {
                ...question,
                items: updatedItems,
              };
            });
          }
          if (assignmentRes.data.assignmentType === AssignmentType.manual) {
            updatedQuestions = updatedQuestions.map((question) => ({
              ...question,
              answer: "",
            }));
          }
          setQuestions(updatedQuestions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const state = location.state;
    if (state?.idAssignment) {
      fetchData(state.idAssignment);
    }
    const queryParams = new URLSearchParams(window.location.search);
    const idAssignment = queryParams.get("idAssignment");
    if (idAssignment) {
      fetchData(idAssignment);
    }
  }, [location]);

  // COUNTDOWN
  const [timeLeft, setTimeLeft] = useState(
    assignmentInfo?.duration ? assignmentInfo.duration * 60 : null
  );
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const durationInSeconds = assignmentInfo?.duration
      ? assignmentInfo.duration * 60
      : null;

    setTimeLeft(durationInSeconds);
    setTotalDuration(0);
  }, [assignmentInfo?.duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime !== null && prevTime > 0) {
          return prevTime - 1;
        } else if (prevTime === 0) {
          clearInterval(interval);
          handleSubmitAssignment();
          return 0;
        }
        return prevTime;
      });
      if (timeLeft === null) {
        setTotalDuration((prevTotal) => prevTotal + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);
  const minutes = Math.floor((timeLeft ?? totalDuration) / 60);
  const seconds = (timeLeft ?? totalDuration) % 60;

  const [diagSubmitVisible, setDiagSubmitVisible] = useState(false);
  const [isQuestionsValid, setIsQuestionsValid] = useState(false);
  const [diagMessage, setDiagMessage] = useState(
    "Are you sure you want to submit?"
  );
  const handleOpenDiag = () => {
    const hasInvalidQuestions = questions.some((question) => {
      if (assignmentInfo.assignmentType === AssignmentType.manual) {
        return (
          !question.answer ||
          (question.assignmentItemAnswerType ===
            AssignmentItemAnswerType.text &&
            question.answer.trim() === "")
        );
      } else if (assignmentInfo.assignmentType === AssignmentType.quiz) {
        return !question.items.some((item) => item.isSelected === true);
      }
      return false;
    });

    if (hasInvalidQuestions) {
      setIsQuestionsValid(false);
      if (assignmentInfo.assignmentType === AssignmentType.quiz) {
        setDiagMessage(
          "Please ensure all questions have at least one answer selected."
        );
      }
      if (assignmentInfo.assignmentType === AssignmentType.manual) {
        setDiagMessage("Please ensure all questions have an answer.");
      }
    } else {
      setIsQuestionsValid(true);
      setDiagMessage("Are you sure you want to submit?");
    }
    setDiagSubmitVisible(true);
  };
  //HANDLE OUT OF PAGE
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     // Ngăn việc reload/trang bị rời bỏ
  //     event.preventDefault();
  //     event.returnValue =
  //       "Your assignment will automatically be submitted if you leave.";
  //     handleSubmitAssignment();
  //   };
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "hidden") {
  //       handleOpenDiag();
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // SUBMIT ASSIGNMENT
  const handleAssignmentResultStatus = (
    dueDate,
    courseEndDate,
    submittedDateObj
  ) => {
    if (isNaN(dueDate) || (courseEndDate && isNaN(courseEndDate))) {
      console.error("Invalid dueDate or courseEndDate");
      return AssignmentResultStatus.submitted;
    }

    if (!assignmentInfo.courseEndDate) {
      return AssignmentResultStatus.submitted;
    }

    if (!assignmentInfo.duration) {
      if (
        (dueDate && submittedDateObj > dueDate) ||
        (courseEndDate && submittedDateObj > courseEndDate)
      ) {
        return AssignmentResultStatus.late;
      }
      return AssignmentResultStatus.onTime;
    }

    return AssignmentResultStatus.onTime;
  };

  //PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = questions.slice(firstIndex, lastIndex);
  const npage = Math.ceil(questions.length / recordsPerPage);

  //QUIZ
  // const handleChoiceChange = (e, choiceIdx, questionIndex) => {
  //   const updatedQuestions = [...questions];
  //   const currentQuestion = updatedQuestions[questionIndex];
  //   const currentChoices = currentQuestion.items;

  //   const selectedChoices = currentChoices.filter(
  //     (choice) => choice.isSelected === true
  //   );

  //   if (currentQuestion.totalCorrect === 1) {
  //     currentChoices.forEach((choice, idx) => {
  //       choice.isSelected = idx === choiceIdx;
  //     });
  //   } else {
  //     if (e.target.checked) {
  //       if (selectedChoices.length < currentQuestion.totalCorrect) {
  //         currentChoices[choiceIdx].isSelected = true;
  //       } else {
  //         const firstSelectedChoiceIndex = currentChoices.findIndex(
  //           (choice) => choice.isSelected
  //         );
  //         if (firstSelectedChoiceIndex !== -1) {
  //           currentChoices[firstSelectedChoiceIndex].isSelected = false;
  //         }
  //         currentChoices[choiceIdx].isSelected = true;
  //       }
  //     } else {
  //       currentChoices[choiceIdx].isSelected = false;
  //     }
  //   }
  //   setQuestions(updatedQuestions);
  // };
  const handleChoiceChange = (e, choiceId, questionId) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions.find(
      (question) => question.idAssignmentItem === questionId
    );

    const currentChoices = currentQuestion.items;
    const selectedChoices = currentChoices.filter(
      (choice) => choice.isSelected === true
    );

    if (currentQuestion.totalCorrect === 1) {
      currentChoices.forEach((choice) => {
        choice.isSelected = choice.idMultipleAssignmentItem === choiceId;
      });
    } else {
      if (e.target.checked) {
        if (selectedChoices.length < currentQuestion.totalCorrect) {
          const choiceToSelect = currentChoices.find(
            (choice) => choice.idMultipleAssignmentItem === choiceId
          );
          choiceToSelect.isSelected = true;
        } else {
          const firstSelectedChoice = currentChoices.find(
            (choice) => choice.isSelected
          );
          if (firstSelectedChoice) {
            firstSelectedChoice.isSelected = false;
          }
          const choiceToSelect = currentChoices.find(
            (choice) => choice.idMultipleAssignmentItem === choiceId
          );
          choiceToSelect.isSelected = true;
        }
      } else {
        const choiceToDeselect = currentChoices.find(
          (choice) => choice.idMultipleAssignmentItem === choiceId
        );
        choiceToDeselect.isSelected = false;
      }
    }

    setQuestions(updatedQuestions);
  };

  //MANUAL
  const handleManualAnswerChange = (idx, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx][field] = value;
    setQuestions(updatedQuestions);
  };
  const inputFileRef = useRef([]);
  const handleOpenReferenceAnswerFile = (idx) => {
    inputFileRef.current[idx]?.click();
  };

  const handleReferenceFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const updatedQuestions = [...questions];
      updatedQuestions[idx].answer = {
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      };
      setQuestions(updatedQuestions);
    }
  };
  const handleDeleteFile = (idx) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx].answer = null; // Xoá file
    setQuestions(updatedQuestions);
  };

  //SUBMIT
  const handleSubmitAssignment = async () => {
    //duration
    const timeSpent = totalDuration - timeLeft;

    //submittedDate
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localDate = new Date();
    const utcDate = fromZonedTime(localDate, timezone);

    const submittedDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    const dueDate = assignmentInfo.dueDate
      ? new Date(assignmentInfo.dueDate)
      : null;
    const courseEndDate = assignmentInfo.courseEndDate
      ? new Date(assignmentInfo.courseEndDate)
      : null;
    const submittedDateObj = new Date(submittedDate);

    const assignmentResultStatus = handleAssignmentResultStatus(
      dueDate,
      courseEndDate,
      submittedDateObj
    );

    const answers =
      assignmentInfo.assignmentType === AssignmentType.quiz
        ? questions.map((question) => {
            const selectedOptions = question.items
              .filter((item) => item.isSelected === true)
              .map((item) => item.idMultipleAssignmentItem);

            return {
              idAssignmentItem: question.idAssignmentItem,
              selectedOptions,
            };
          })
        : questions;
    const requestData = {
      idAssignment: assignmentInfo.idAssignment,
      idStudent: Number(localStorage.getItem("idUser")),
      duration: timeSpent,
      assignmentResultStatus, // Trạng thái kết quả bài nộp
      submittedDate: submittedDate,
      answers: answers,
    };

    try {
      setLoading(true);
      let response;
      if (assignmentInfo.assignmentType === AssignmentType.quiz) {
        response = await postSubmitQuizAssignment(requestData);
      } else if (assignmentInfo.assignmentType === AssignmentType.manual) {
        response = await postSubmitManualQuestion(requestData);
      }

      if (response.status === APIStatus.success) {
        navigate(-1);
      } else {
        console.error("Failed to submit assignment:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
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
      <div className="start-assign-container">
        <div className="assign-info">
          <label htmlFor="">{assignmentInfo.title}</label>
          <div className="time-btn">
            <label className="timer">
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </label>

            <button className="btn submit" onClick={() => handleOpenDiag()}>
              Submit
            </button>
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
                </div>
                <div className="info-row">
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {question.question.trim()}
                  </p>
                  {assignmentInfo.assignmentType === AssignmentType.quiz &&
                    question.attachedFile && (
                      <img
                        className="question-img"
                        src={question.attachedFile || default_image}
                        alt=""
                      />
                    )}
                </div>
                {assignmentInfo.assignmentType === AssignmentType.manual && (
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
                                    // Kiểm tra nếu attachedFile là URL
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
                    <div className="info-row">
                      {question.assignmentItemAnswerType ===
                        AssignmentItemAnswerType.text && (
                        <div className="info">
                          <span>Your answer: </span>
                          <Form.Control
                            as="textarea"
                            className="input-area-form-pi"
                            value={question.answer || ""}
                            onChange={(e) =>
                              handleManualAnswerChange(
                                index,
                                "answer",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                      {question.assignmentItemAnswerType ===
                        AssignmentItemAnswerType.attached_file && (
                        <div className="info">
                          <span>Your answer: </span>
                          {question.answer ? (
                            <div className="select-container">
                              <input
                                type="text"
                                style={{ cursor: "pointer" }}
                                className="input-form-pi"
                                title={
                                  question.attachedFile?.name ||
                                  question.nameFile
                                }
                                value={
                                  question.answer.name.length > 54
                                    ? question.answer.name.slice(0, 54) + "..."
                                    : question.answer.name
                                }
                                onClick={() => {
                                  if (question.answer.url) {
                                    // Kiểm tra nếu answer chứa URL
                                    window.open(question.answer.url, "_blank");
                                  }
                                }}
                                readOnly
                              />
                              <FaTrashAlt
                                className="arrow-icon del-question"
                                style={{
                                  cursor: "pointer",
                                  pointerEvents: "all",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFile(index);
                                }}
                              />
                            </div>
                          ) : (
                            <button
                              className="file-btn"
                              onClick={() =>
                                handleOpenReferenceAnswerFile(index)
                              }
                            >
                              <RiAttachment2 className="icon" />
                              Attach file
                            </button>
                          )}
                        </div>
                      )}
                      <input
                        type="file"
                        ref={(el) => (inputFileRef.current[index] = el)}
                        style={{ display: "none" }}
                        accept="*"
                        onChange={(e) => handleReferenceFileChange(e, index)}
                      />
                    </div>
                  </>
                )}
                {assignmentInfo.assignmentType === AssignmentType.quiz && (
                  <div className="info-row choices-container">
                    <label style={{ fontSize: "14px", fontWeight: 800 }}>
                      Choices{" "}
                      {question.totalCorrect > 1 &&
                        `| Select exactly ${question.totalCorrect} correct answers.`}
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
                                  question.totalCorrect > 1
                                    ? "checkbox"
                                    : "radio"
                                }
                                name={`question_${index}`}
                                checked={choice.isSelected}
                                // onChange={(e) =>
                                //   handleChoiceChange(e, choiceIdx, index)
                                // }
                                onChange={(e) =>
                                  handleChoiceChange(
                                    e,
                                    choice.idMultipleAssignmentItem, // Truyền idMultipleAssignmentItem thay vì index
                                    question.idAssignmentItem // Truyền idAssignmentItem thay vì index
                                  )
                                }
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
      {/* Dialog thông báo nếu người dùng chưa nộp bài */}
      {diagSubmitVisible && (
        <div
          className="modal-overlay"
          onClick={() => setDiagSubmitVisible(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="diag-header">
              <div className="container-title">
                <LuCheckCircle className="diag-icon" />
                <span className="diag-title">Confirmation</span>
              </div>
              <LuX
                className="diag-icon"
                onClick={() => setDiagSubmitVisible(false)}
              />
            </div>
            <div className="diag-body">
              <span>{diagMessage}</span>

              <div className="str-btns">
                <div className="act-btns">
                  <button
                    className="btn diag-btn cancel"
                    onClick={() => setDiagSubmitVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn diag-btn signout"
                    onClick={() => handleSubmitAssignment()}
                    disabled={!isQuestionsValid}
                  >
                    Submit
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

export default StartAssign;
