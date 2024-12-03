import React from "react";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { AssignmentItemAnswerType } from "../../constants/constants";
import Form from "react-bootstrap/Form";

const ManualQuestion = ({
  questions,
  setQuestions,
  inputFileRef,
  isUpdate,
}) => {
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
    updatedQuestions[idx].attachedFile = null;
    updatedQuestions[idx].fileUrl = null;
    updatedQuestions[idx].isDeletedFile = 1;
    updatedQuestions[idx].nameFile = "";
    setQuestions(updatedQuestions);
    if (inputFileRef.current[idx]) {
      inputFileRef.current[idx].value = "";
    }
  };

  const handleOpenReferenceQuestion = (idx) => {
    inputFileRef.current[idx]?.click();
  };

  const handleReferenceFileChange = (e, idx) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx].attachedFile = e.target.files[0];
    updatedQuestions[idx].isDeletedFile = 0;
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx][field] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="new-manual-questions" style={{ width: "100%" }}>
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
                  <div className="info">
                    <span>Reference material (maximum 1 file)</span>
                    {question.attachedFile || question.nameFile ? (
                      <div className="select-container">
                        <input
                          type="text"
                          style={{ cursor: "pointer" }}
                          className="input-form-pi"
                          title={
                            question.attachedFile?.name || question.nameFile
                          }
                          value={
                            (question.attachedFile?.name || question.nameFile)
                              ?.length > 54
                              ? (
                                  question.attachedFile?.name ||
                                  question.nameFile
                                ).slice(0, 54) + "..."
                              : question.attachedFile?.name || question.nameFile
                          }
                          onClick={() => {
                            if (typeof question.attachedFile === "string") {
                              // Kiểm tra nếu attachedFile là URL
                              const fileUrl = question.attachedFile;
                              window.open(fileUrl, "_blank");
                            }
                          }}
                          readOnly
                        />
                        <FaTrashAlt
                          className="arrow-icon del-question"
                          style={{ cursor: "pointer", pointerEvents: "all" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(idx);
                          }}
                        />
                      </div>
                    ) : (
                      <button
                        className="file-btn"
                        onClick={() => handleOpenReferenceQuestion(idx)}
                      >
                        <RiAttachment2 className="icon" />
                        Attach file
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={(el) => (inputFileRef.current[idx] = el)}
                    style={{ display: "none" }}
                    accept="*"
                    onChange={(e) => handleReferenceFileChange(e, idx)}
                  />
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
                  <div className="info">
                    <span>Type of answer</span>
                    <div className="select-container">
                      <select
                        className="input-form-pi"
                        value={question.assignmentItemAnswerType}
                        onChange={(e) =>
                          handleQuestionChange(
                            idx,
                            "assignmentItemAnswerType",
                            e.target.value
                          )
                        }
                      >
                        <option value={AssignmentItemAnswerType.text}>
                          Text
                        </option>
                        <option value={AssignmentItemAnswerType.attached_file}>
                          Attach File
                        </option>
                      </select>
                      <FaChevronDown className="arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ManualQuestion;
