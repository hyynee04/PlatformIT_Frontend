import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { postRunCodeTest } from "../../services/assignmentService";
import { APIStatus } from "../../constants/constants";
const RunCode = ({ selectedLanguage, testCases }) => {
  const [sourceCode, setSourceCode] = useState("");
  const [resultOfExecution, setResultOfExecution] = useState([]);
  const handleRunTestCode = async () => {
    const requestData = {
      idLanguage: selectedLanguage.idLanguage,
      testCases: testCases,
      sourceCode: sourceCode,
    };
    const response = await postRunCodeTest(requestData);
    if (response.status === APIStatus.success) {
      setResultOfExecution(response.data);
    }
  };
  return (
    <div className="container-right-assign testing-code">
      <span className="title-span">
        Testing with your code
        <button className="btn" onClick={() => handleRunTestCode()}>
          Run code
        </button>
      </span>
      <div className="assign-info">
        <div className="info">
          <span>Your code</span>
          <Form.Control
            as="textarea"
            className="input-code-area-form-pi"
            placeholder="Type problem here..."
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

        <div className="info">
          <span>Result</span>
          <table className="result-table">
            <thead>
              <tr>
                <th></th>
                <th>Input</th>
                <th>Output</th>
                <th>Pass test case</th>
                <th>Time</th>
                <th>Memory</th>
              </tr>
            </thead>
            <tbody>
              {testCases?.map((result, index) => (
                <tr key={index}>
                  <td style={{ width: "64px" }}> Case {index + 1}</td>
                  <td>
                    <input type="text" value={testCases.input} readOnly />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={testCases.expectedOutput}
                      readOnly
                    />
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RunCode;
