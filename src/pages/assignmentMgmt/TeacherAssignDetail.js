import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAssignmentInfo } from "../../services/courseService";
import { APIStatus, AssignmentType } from "../../constants/constants";
import {
  LuAlignJustify,
  LuChevronRight,
  LuChevronLeft,
  LuX,
  LuMinusCircle,
} from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { ImSpinner2 } from "react-icons/im";
import "../../assets/css/AssignmentDetail.css";

const TeacherAssignDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  // const [assignmentInfo, setAssignmentInfo] = useState({});
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchAssignmentData = async (idAssignment) => {
      setLoading(true);
      try {
        const response = await getAssignmentInfo(idAssignment);
        if (response.status === APIStatus.success) {
          const fetchedAssignmentInfo = response.data;
          setAssignmentInfo(fetchedAssignmentInfo);
          setQuestions(fetchedAssignmentInfo.assignmentItems);
          // setQuestions(assignmentInfo.assignmentItems);
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
                  <label>
                    {totalMarks || 0} {totalMarks <= 1 ? "mark" : "marks"}
                  </label>

                  <GoDotFill strokeWidth={1} />
                  <label>
                    {totalQuestions}{" "}
                    {totalQuestions <= 1 ? "question" : "questions"}
                  </label>
                </span>
              </div>
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
              {assignmentInfo.duration && (
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
                  <label className="value">{}</label>
                </div>
              )}

              <div className="field-value">
                <label className="field">Due date</label>
                <label className="value"></label>
              </div>
            </div>
          </div>
        </div>
        <div className="handle-button"></div>
        <div className="question-overview-container"></div>
      </div>
    </div>
  );
};

export default TeacherAssignDetail;
