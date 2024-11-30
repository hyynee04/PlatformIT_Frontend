import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAssignmentInfo } from "../../services/courseService";
import { APIStatus } from "../../constants/constants";

const TeacherAssignDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  // const [assignmentInfo, setAssignmentInfo] = useState({});
  const [assignmentInfo, setAssignmentInfo] = useState({});

  useEffect(() => {
    const fetchAssignmentData = async (idAssignment) => {
      setLoading(true);
      try {
        const response = await getAssignmentInfo(idAssignment);
        if (response.status === APIStatus.success) {
          setAssignmentInfo(response.data);
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
  return (
    <div>
      <div className="assign-span"></div>
      <div className="container-assign">
        <div className="container-right-assign">
          {" "}
          <span className="name-course">{assignmentInfo.courseTitle}</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignDetail;
