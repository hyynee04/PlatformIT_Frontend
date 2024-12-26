import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { ImSpinner2 } from "react-icons/im";
import { postRunCodeTest } from "../../services/assignmentService";
import { APIStatus, Role } from "../../constants/constants";
import DiagNotiWarning from "../diag/DiagNotiWarning";
const RunCode = ({
  selectedLanguage,
  testCases,
  isPassTestCase,
  isAllowRunCode,
  isPerformanceOnTime,
  timeValue,
  isPerformanceOnMemory,
  memoryValue,
  updateParentSourceCode,
}) => {
  const idRole = Number(localStorage.getItem("idRole"));
  const [sourceCode, setSourceCode] = useState("");
  const [resultOfExecution, setResultOfExecution] = useState([]);
  const [executingLoading, setExecutingLoading] = useState(false);
  const [invalidHeader, setInvalidHeader] = useState("");
  const [invalidMsg, setInvalidMessage] = useState("");
  const [isModalInvalidOpen, setIsModalInvalidOpen] = useState(false);

  const openInvalidModal = () => setIsModalInvalidOpen(true);
  const closeInvalidModal = () => setIsModalInvalidOpen(false);
  const handleOpenInvalidDiag = (header, msgBody) => {
    setInvalidHeader(header);
    setInvalidMessage(msgBody);
    openInvalidModal();
  };
  useEffect(() => {
    updateParentSourceCode(sourceCode);
  }, [sourceCode, updateParentSourceCode]);

  const handleRunTestCode = async () => {
    if (!selectedLanguage?.idLanguage) {
      handleOpenInvalidDiag(
        "Missing Programming Language",
        "Please select a programming language before running the test code."
      );
      return;
    }
    if (!sourceCode) {
      handleOpenInvalidDiag(
        "Missing Source Code",
        "Source code is required to execute the test cases. Please provide your code."
      );
      return;
    }
    if (isPassTestCase && idRole === Role.teacher) {
      if (testCases.length === 0) {
        handleOpenInvalidDiag(
          "Missing Test Case",
          "You must add at least one test case to validate the code execution."
        );
        return;
      }
      for (const testCase of testCases) {
        if (!testCase.input || testCase.input.trim() === "") {
          handleOpenInvalidDiag(
            "Invalid Test Case Input",
            "Each test case must have valid input."
          );
          return;
        }

        if (!testCase.expectedOutput || testCase.expectedOutput.trim() === "") {
          handleOpenInvalidDiag(
            "Invalid Test Case Expected Output",
            "Each test case must have a valid expected output."
          );
          return;
        }
      }
    }

    const requestData = {
      idLanguage: selectedLanguage.idLanguage,
      testCases: testCases,
      sourceCode: sourceCode,
    };
    setExecutingLoading(true);
    try {
      const response = await postRunCodeTest(requestData);
      if (response.status === APIStatus.success) {
        setResultOfExecution(response.data);
      }
    } catch (error) {
      throw error;
    } finally {
      setExecutingLoading(false);
    }
  };
  return (
    <div className="container-right-assign testing-code">
      <span className="title-span">
        {idRole === Role.teacher ? "Testing with your code" : "Your answer"}
        {isAllowRunCode && (
          <button className="btn" onClick={() => handleRunTestCode()}>
            {executingLoading && (
              <ImSpinner2 className="icon-spin" color="#d9d9d9" />
            )}
            Run code
          </button>
        )}
      </span>
      <div
        className="assign-info"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          alignItems: "normal",
        }}
      >
        <div className="info">
          <span>Your code</span>
          <Form.Control
            as="textarea"
            className="input-code-area-form-pi"
            placeholder="Type source code here..."
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
          />
        </div>
        <div className="info" style={{ width: "50%" }}>
          <span>Language</span>
          <div className="select-container">
            <input
              style={{ cursor: "default" }}
              type="text"
              className="input-form-pi"
              value={selectedLanguage.languageName}
              placeholder="Please select a language at questions."
              readOnly
            />
          </div>
        </div>
        {resultOfExecution.length > 0 && (
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
                {resultOfExecution.map((result, index) => (
                  <tr key={index}>
                    <td style={{ width: "64px" }}> Case {index + 1}</td>
                    <td
                      className={`isPassTestCase ${
                        isPassTestCase
                          ? result.isPassTestCase
                            ? "passed"
                            : "failed"
                          : ""
                      }`}
                    >
                      {result.isPassTestCase ? "Passed" : "Failed"}
                    </td>
                    <td
                      className={`${
                        isPerformanceOnTime
                          ? result.timeExecuted < timeValue
                            ? "passed"
                            : "failed"
                          : ""
                      }`}
                    >
                      {result.timeExecuted ? `${result.timeExecuted}kb` : ""}
                    </td>
                    <td
                      className={`${
                        isPerformanceOnMemory
                          ? result.memoryExecuted < memoryValue
                            ? "passed"
                            : "failed"
                          : ""
                      }`}
                    >
                      {result.memoryExecuted
                        ? `${result.memoryExecuted}kb`
                        : ""}
                    </td>
                    <td>{result.failDescriptionCode_NOUSE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DiagNotiWarning
        isOpen={isModalInvalidOpen}
        onClose={closeInvalidModal}
        invalidHeader={invalidHeader}
        invalidMsg={invalidMsg}
      />
    </div>
  );
};

export default RunCode;
