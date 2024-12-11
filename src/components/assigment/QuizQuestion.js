import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { BiPlus } from "react-icons/bi";
import Form from "react-bootstrap/Form";
import default_image from "../../assets/img/default_image.png";

const QuizQuestion = ({ questions, setQuestions, inputFileRef, isUpdate }) => {
  const handleDeleteQuestion = (idx) => {
    if (isUpdate) {
      const updatedQuestions = questions.map((question, index) => {
        if (index === idx) {
          return {
            ...question,
            assignmentItemStatus: 0,
          };
        }
        return question;
      });
      setQuestions(updatedQuestions);
    } else {
      const updatedQuestions = questions.filter((_, index) => index !== idx);
      setQuestions(updatedQuestions);
    }
  };

  const handleDeleteFile = (idx) => {
    const updatedQuestions = [...questions];

    // Giải phóng URL nếu có
    if (updatedQuestions[idx].attachedFilePreview) {
      URL.revokeObjectURL(updatedQuestions[idx].attachedFilePreview);
    }
    updatedQuestions[idx].isDeletedFile = 1;
    updatedQuestions[idx].attachedFile = null;
    updatedQuestions[idx].attachedFilePreview = null;
    setQuestions(updatedQuestions);

    // Reset input file
    if (inputFileRef.current[idx]) {
      inputFileRef.current[idx].value = "";
    }
  };
  const handleOpenReferenceQuestion = (idx) => {
    inputFileRef.current[idx]?.click();
  };

  const handleReferenceFileChange = (e, idx) => {
    const file = e.target.files[0];

    if (file) {
      // Kiểm tra MIME type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (e.g., .jpg, .png)");
        return;
      }
      const fileUrl = URL.createObjectURL(file);

      const updatedQuestions = [...questions];

      if (updatedQuestions[idx].attachedFilePreview) {
        URL.revokeObjectURL(updatedQuestions[idx].attachedFilePreview);
      }

      // updatedQuestions[idx].attachedFile = URL.createObjectURL(file); // Gắn URL của ảnh để hiển thị
      updatedQuestions[idx].attachedFilePreview = fileUrl;
      updatedQuestions[idx].attachedFile = file;
      updatedQuestions[idx].isDeletedFile = 0;
      setQuestions(updatedQuestions);
    }
  };

  const handleQuestionChange = (idx, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx][field] = value;
    setQuestions(updatedQuestions);
  };
  const handleAddChoice = (idx) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx].items = [
      ...updatedQuestions[idx].items,
      {
        idMultipleAssignmentItem: "",
        content: "",
        isCorrect: false,
        multipleAssignmentItemStatus: 1,
      },
    ];
    setQuestions(updatedQuestions);
  };

  const handleDeleteChoice = (questionIdx, choiceIdx) => {
    const updatedQuestions = [...questions];
    if (isUpdate) {
      updatedQuestions[questionIdx].items = updatedQuestions[
        questionIdx
      ].items.map((choice, index) =>
        index === choiceIdx
          ? { ...choice, multipleAssignmentItemStatus: 0 }
          : choice
      );
    } else {
      updatedQuestions[questionIdx].items = updatedQuestions[
        questionIdx
      ].items.filter((_, index) => index !== choiceIdx);
    }
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (questionIdx, choiceIdx, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIdx].items[choiceIdx][field] = value;
    setQuestions(updatedQuestions);
  };
  return (
    <div className="new-quiz-questions" style={{ width: "100%" }}>
      {questions
        .filter((question) => question.assignmentItemStatus === 1)
        .map((question, idx) => (
          <div className="row-item" key={idx}>
            <div className="num-del">
              <span className="num-question">{idx + 1}</span>
              <button
                className="del-question"
                onClick={() => handleDeleteQuestion(idx)}
              >
                <FaTrashAlt />
              </button>
            </div>
            <div className="question-info">
              <div className="row-info">
                <div className="left-question-info">
                  <div className="info">
                    <span>
                      <span style={{ fontWeight: "bold", color: "#1e1e1e" }}>
                        Question {idx + 1}
                      </span>
                      <span className="required">*</span>
                    </span>

                    <Form.Control
                      as="textarea"
                      className="input-area-form-pi"
                      placeholder="Question text"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(idx, "question", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="right-question-info">
                  <div className="img-container">
                    <img
                      className="question-img"
                      alt=""
                      src={
                        question.attachedFilePreview ||
                        question.attachedFile ||
                        default_image
                      }
                      style={{
                        cursor: question.attachedFile ? "pointer" : "default",
                      }}
                      onClick={() => window.open(question.attachedFile)}
                    />
                    <button
                      className="btn quiz-img-btn attach"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenReferenceQuestion(idx);
                      }}
                    >
                      <RiAttachment2
                        className="file-icon"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      />
                    </button>
                    <button
                      className="btn quiz-img-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(idx);
                      }}
                    >
                      <FaTrashAlt
                        className="del-question"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={(el) => (inputFileRef.current[idx] = el)}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleReferenceFileChange(e, idx)}
                  />
                </div>
              </div>
              <div className="row-info">
                <div className="left-question-info">
                  <span className="choices-setting">
                    <span>Choices</span>
                    <span>|</span>
                    <span>Multiple answers</span>
                    <label className="switch-mul-anw">
                      <input
                        type="checkbox"
                        checked={question.isMultipleAnswer}
                        onChange={(e) => {
                          handleQuestionChange(
                            idx,
                            "isMultipleAnswer",
                            e.target.checked
                          );
                          if (!question.isMultipleAnswer) {
                            // Nếu chuyển sang chế độ "Single Answer", đảm bảo chỉ có 1 đáp án đúng
                            const updatedItems = question.items.map(
                              (choice, choiceIdx) => ({
                                ...choice,
                                isCorrect: choiceIdx === 0, // Đặt đáp án đầu tiên là đúng
                              })
                            );
                            handleQuestionChange(idx, "items", updatedItems);
                          }
                        }}
                      />
                      <span className="slider-mul-anw"></span>
                    </label>
                  </span>
                  {question.items.map(
                    (choice, choiceIdx) =>
                      choice.multipleAssignmentItemStatus === 1 && (
                        <div className="info-in-row" key={choiceIdx}>
                          <label className="radio-choice">
                            <input
                              type={
                                question.isMultipleAnswer ? "checkbox" : "radio"
                              }
                              name={`question_${idx}`}
                              checked={choice.isCorrect}
                              // onChange={(e) =>
                              //   handleChoiceChange(
                              //     idx,
                              //     choiceIdx,
                              //     "isCorrect",
                              //     e.target.checked
                              //   )
                              // }
                              onChange={(e) => {
                                if (question.isMultipleAnswer) {
                                  // Multiple Answer Mode
                                  handleChoiceChange(
                                    idx,
                                    choiceIdx,
                                    "isCorrect",
                                    e.target.checked
                                  );
                                } else {
                                  // Single Answer Mode (Radio)
                                  const updatedItems = question.items.map(
                                    (item, index) => ({
                                      ...item,
                                      isCorrect: index === choiceIdx, // Đặt lựa chọn được chọn là true, các lựa chọn khác là false
                                    })
                                  );
                                  handleQuestionChange(
                                    idx,
                                    "items",
                                    updatedItems
                                  );
                                }
                              }}
                            />
                          </label>
                          <div className="info" style={{ flex: "1" }}>
                            <input
                              type="text"
                              className="input-form-pi"
                              placeholder="Type a choice"
                              value={choice.content}
                              onChange={(e) =>
                                handleChoiceChange(
                                  idx,
                                  choiceIdx,
                                  "content",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <button
                            className="btn del-question"
                            onClick={() => handleDeleteChoice(idx, choiceIdx)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )
                  )}

                  <div>
                    <button
                      className="btn add-new-choice"
                      onClick={() => handleAddChoice(idx)}
                    >
                      <BiPlus />
                      Add new choice
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="row-info"
                style={{ borderTop: "1px solid var(--border-gray)" }}
              >
                <div className="left-question-info">
                  <div className="info">
                    <span
                      style={{
                        color: "var(--black-color)",
                        fontSize: "14px",
                      }}
                    >
                      Answer explanation
                    </span>

                    <Form.Control
                      as="textarea"
                      className="input-area-form-pi"
                      placeholder="Explanation"
                      value={question.explanation}
                      onChange={(e) =>
                        handleQuestionChange(idx, "explanation", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="right-question-info">
                  <div className="info">
                    <span>
                      Mark<span className="required">*</span>
                    </span>
                    <input
                      type="number"
                      className="input-form-pi"
                      value={question.mark}
                      onChange={(e) =>
                        handleQuestionChange(idx, "mark", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default QuizQuestion;
