import React from "react";
import { useNavigate } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";

const CenterAdCourseMgmt = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="add-btn">
        <div className="btn" onClick={() => navigate("/addCourse")}>
          <LuUserPlus className="icon" />
          <span>Add course</span>
        </div>
      </div>
    </div>
  );
};

export default CenterAdCourseMgmt;
