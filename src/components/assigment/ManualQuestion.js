import React from "react";
import { FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { AssignmentItemAnswerType } from "../../constants/constants";
import Form from "react-bootstrap/Form";

const ManualQuestion = ({ questions, setQuestions, inputFileRef }) => {
  const handleDeleteQuestion = (idx) => {
    const updatedQuestions = questions.filter((_, index) => index !== idx);
    setQuestions(updatedQuestions);
  };

  const handleDeleteFile = (idx) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx].attachedFile = null;
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
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[idx][field] = value;
    setQuestions(updatedQuestions);
  };
  return (
    <div className="new-manual-questions" style={{ width: "100%" }}>
      {questions.map((question, idx) => (
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
                  {question.attachedFile ? (
                    <div className="select-container">
                      <input
                        type="text"
                        className="input-form-pi"
                        value={question.attachedFile.name}
                        disabled
                      />
                      <FaTrashAlt
                        className="arrow-icon del-question"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                        onClick={() => handleDeleteFile(idx)}
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
