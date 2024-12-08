import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, fromZonedTime } from "date-fns-tz";
import {
  getDetailAssignmentForStudent,
  getDetailAssignmentItemForStudent,
  postSubmitQuizAssignment,
} from "../../services/courseService";
import {
  APIStatus,
  AssignmentItemAnswerType,
  AssignmentResultStatus,
  AssignmentType,
} from "../../constants/constants";
import { getPagination } from "../../functions/function";
import { LuCheckCircle, LuX } from "react-icons/lu";
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

          if (assignmentRes.data.assignmentType === AssignmentType.quiz) {
            updatedQuestions = updatedQuestions.map((question) => {
              const updatedItems = question.items.map((item) => ({
                ...item,
                isSelected: false,
              }));

              return {
                ...question,
                items: updatedItems,
              };
            });
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
  }, [location]);

  //COUNTDOWN
  const [timeLeft, setTimeLeft] = useState(assignmentInfo?.duration * 60);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const durationInSeconds = assignmentInfo?.duration * 60;
    setTimeLeft(durationInSeconds);
    setTotalDuration(durationInSeconds); // Gán tổng thời gian ban đầu
  }, [assignmentInfo?.duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [diagSubmitVisible, setDiagSubmitVisible] = useState(false);
  const [isQuestionsValid, setIsQuestionsValid] = useState(false); // Kiểm tra câu hỏi hợp lệ
  const [diagMessage, setDiagMessage] = useState(
    "Are you sure you want to submit?"
  ); // Thông báo

  const handleOpenDiag = () => {
    const hasInvalidQuestions = questions.some((question) => {
      return !question.items.some((item) => item.isSelected === true); // Không có đáp án nào được chọn
    });

    if (hasInvalidQuestions) {
      setIsQuestionsValid(false);
      setDiagMessage(
        "Please ensure all questions have at least one answer selected."
      );
    } else {
      setIsQuestionsValid(true);
      setDiagMessage("Are you sure you want to submit?");
    }
    setDiagSubmitVisible(true); // Hiển thị modal
  };
  //HANDLE OUT OF PAGE
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue =
  //       "Are you sure you want to leave? Your progress may not be saved!";

  //     // Nộp bài khi tắt trình duyệt hoặc reload
  //     handleSubmitAssignment();
  //   };

  //   const handlePopState = () => {
  //     // Kiểm tra hành động Back/Forward
  //     if (
  //       window.confirm("Are you sure you want to leave without submitting?")
  //     ) {
  //       handleSubmitAssignment(); // Nộp bài trước khi rời trang
  //       navigate(-1); // Quay lại trang trước
  //     } else {
  //       // Giữ nguyên trạng thái hiện tại
  //       window.history.pushState(null, null, window.location.href);
  //     }
  //   };

  //   // Đẩy trạng thái vào lịch sử để phát hiện sự kiện popstate
  //   window.history.pushState(null, null, window.location.href);

  //   // Thêm sự kiện xử lý
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [navigate]);

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
      if (submittedDateObj > dueDate || submittedDateObj > courseEndDate) {
        return AssignmentResultStatus.late;
      }
      return AssignmentResultStatus.onTime;
    }

    return AssignmentResultStatus.onTime;
  };

  const handleSubmitAssignment = async () => {
    const timeSpent = totalDuration - timeLeft;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const localDate = new Date();
    const utcDate = fromZonedTime(localDate, timezone);

    const submittedDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    const dueDate = new Date(assignmentInfo.dueDate); // Ngày hết hạn bài tập
    const courseEndDate = assignmentInfo.courseEndDate
      ? new Date(assignmentInfo.courseEndDate)
      : null; // Ngày kết thúc khóa học (nếu có)
    const submittedDateObj = new Date(submittedDate);

    const answers = questions.map((question) => {
      const selectedOptions = question.items
        .filter((item) => item.isSelected === true)
        .map((item) => item.idMultipleAssignmentItem);

      return {
        idAssignmentItem: question.idAssignmentItem,
        selectedOptions,
      };
    });

    const assignmentResultStatus = handleAssignmentResultStatus(
      dueDate,
      courseEndDate,
      submittedDateObj
    );

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
      const response = await postSubmitQuizAssignment(requestData);
      if (response.status === APIStatus.success) {
        console.log("Assignment submitted successfully.");
        navigate("/studentTest");
      } else {
        console.error("Failed to submit assignment:", response);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  //COUNTDOWN
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  //PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = questions.slice(firstIndex, lastIndex);
  const npage = Math.ceil(questions.length / recordsPerPage);

  //QUIZ
  const handleChoiceChange = (e, choiceIdx, questionIndex) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[questionIndex];
    const currentChoices = currentQuestion.items;

    const selectedChoices = currentChoices.filter(
      (choice) => choice.isSelected === true
    );

    if (currentQuestion.totalCorrect === 1) {
      currentChoices.forEach((choice, idx) => {
        choice.isSelected = idx === choiceIdx;
      });
    } else {
      if (e.target.checked) {
        if (selectedChoices.length < currentQuestion.totalCorrect) {
          currentChoices[choiceIdx].isSelected = true;
        } else {
          const firstSelectedChoiceIndex = currentChoices.findIndex(
            (choice) => choice.isSelected
          );
          if (firstSelectedChoiceIndex !== -1) {
            currentChoices[firstSelectedChoiceIndex].isSelected = false;
          }
          currentChoices[choiceIdx].isSelected = true;
        }
      } else {
        currentChoices[choiceIdx].isSelected = false;
      }
    }
    setQuestions(updatedQuestions);
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
                    index + 1
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
                            //   value={tempUserPI.description || ""}
                            //   onChange={(e) =>
                            //     handleInputChange("description", e.target.value)
                            //   }
                          />
                        </div>
                      )}
                      {question.assignmentItemAnswerType ===
                        AssignmentItemAnswerType.attached_file && (
                        <div className="info">
                          <span>Your answer: </span>
                          <Form.Control
                            as="textarea"
                            className="input-area-form-pi"
                            //   value={tempUserPI.description || ""}
                            //   onChange={(e) =>
                            //     handleInputChange("description", e.target.value)
                            //   }
                          />
                        </div>
                      )}
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
                                onChange={(e) =>
                                  handleChoiceChange(e, choiceIdx, index)
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
