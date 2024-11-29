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

  // Hàm xử lý cập nhật thông tin
  const handleUpdateAssignment = (key, value) => {
    setAssignmentInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  };
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
  return <div></div>;
};

export default TeacherAssignDetail;
