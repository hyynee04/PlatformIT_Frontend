import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuMoreHorizontal,
  LuClock4,
  LuFileEdit,
  LuCheckSquare,
  LuCalendar,
} from "react-icons/lu";
import { TiPlus } from "react-icons/ti";
import {
  APIStatus,
  AssignmentStatus,
  AssignmentType,
} from "../../constants/constants";
import FilterUser from "../../components/FilterUser";
import SortByUser from "../../components/SortByUser";
import { useNavigate } from "react-router-dom";
import { getAllAssignmentCardOfTeacher } from "../../services/courseService";

const TeacherAssignMgmt = () => {
  const [activeStatus, setActiveStatus] = useState(AssignmentStatus.publish);
  const handleStatusClick = (status) => {
    setActiveStatus(status);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);
  const [listAssignment, setListAssigment] = useState([]);
  const navigate = useNavigate();
  const fetchAssignment = async () => {
    const response = await getAllAssignmentCardOfTeacher();
    if (response.status === APIStatus.success) {
      setListAssigment(response.data);
    }
  };
  useEffect(() => {
    fetchAssignment();
  }, []);
  const filteredAssignments = listAssignment.filter((assignment) => {
    if (activeStatus === AssignmentStatus.publish) {
      return assignment.isPublish === 1;
    }
    if (activeStatus === AssignmentStatus.unpublish) {
      return assignment.isPublish === 0;
    }
    if (activeStatus === AssignmentStatus.pastDue) {
      return assignment.endDate && new Date(assignment.endDate) < new Date();
    }
    return true;
  });
  return (
    <div>
      <div className="page-list-container">
        <div className="handle-page-container">
          <div className="status-assign-btns">
            <button
              className={`status-btn ${
                activeStatus === AssignmentStatus.publish ? "active" : ""
              }`}
              onClick={() => handleStatusClick(AssignmentStatus.publish)}
            >
              Publish
            </button>
            <button
              className={`status-btn ${
                activeStatus === AssignmentStatus.unpublish ? "active" : ""
              }`}
              onClick={() => handleStatusClick(AssignmentStatus.unpublish)}
            >
              Unpublish
            </button>
            <button
              className={`status-btn ${
                activeStatus === AssignmentStatus.pastDue ? "active" : ""
              }`}
              onClick={() => handleStatusClick(AssignmentStatus.pastDue)}
            >
              Past due
            </button>
          </div>
          <div className="filter-search-assign">
            <div className="filter-sort-btns">
              <div
                className="btn"
                onClick={() => {
                  // setFilterVisble(!filterVisble);
                  // setSortByVisible(false);
                }}
              >
                <LuFilter className="icon" />
                <span>Filter</span>
              </div>
              {filterVisble && (
                <FilterUser
                  // onFilterChange={handleFilterChange}
                  onClose={() => setFilterVisble(false)}
                />
              )}
              <div
                className="btn"
                onClick={() => {
                  setSortByVisible(!sortByVisible);
                  setFilterVisble(false);
                }}
              >
                <span>Sort by</span>
                <LuChevronDown className="icon" />
              </div>
              {sortByVisible && (
                <SortByUser
                //   onSortByChange={handleSortByChange}
                />
              )}
            </div>

            <div className="search-container">
              <input
                type="text"
                className="search-field"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="circle-btn">
              <TiPlus
                className="icon"
                onClick={() => navigate("/addAssignment")}
              />
            </button>
          </div>
        </div>
        <div className="list-assign-container">
          {filteredAssignments.map((assignment, index) => (
            <div className="assign-item" key={index}>
              <div className="row-item">
                <span className="title-assign" style={{ fontWeight: "bold" }}>
                  {assignment.title}
                </span>
                <button className="btn">
                  <LuMoreHorizontal />
                </button>
              </div>
              <div className="attribute-container">
                <div className="attribute-item">
                  <LuFileEdit className="icon-attribute-assign" />
                  <label htmlFor="">
                    {assignment.assignmentType === AssignmentType.code
                      ? "Code"
                      : assignment.assignmentType === AssignmentType.quiz
                      ? "Quiz"
                      : "Manual"}
                  </label>
                </div>
                {assignment.duration > 0 && (
                  <div className="attribute-item">
                    <LuClock4 className="icon-attribute-assign" />
                    <label htmlFor="">{assignment.duration} minutes</label>
                  </div>
                )}
                {assignment.startDate && (
                  <div className="attribute-item">
                    <LuCalendar className="icon-attribute-assign" />
                    <label htmlFor="">Due date: {assignment.startDate}</label>
                  </div>
                )}
                {assignment.dueDate && (
                  <div className="attribute-item">
                    <LuCalendar className="icon-attribute-assign" />
                    <label htmlFor="">Due date: {assignment.dueDate}</label>
                  </div>
                )}
                <div className="attribute-item">
                  <LuCheckSquare className="icon-attribute-assign" />
                  <label htmlFor="">
                    {assignment.questionQuantity}{" "}
                    {assignment.questionQuantity > 1
                      ? " questions"
                      : "question"}
                  </label>
                </div>
              </div>
              <div className="row-item">
                <span
                  style={{
                    fontWeight: "400",
                    color: "var(--text-gray)",
                    fontSize: "15px",
                  }}
                >
                  Course: {assignment.nameCourse}
                </span>
                <span className="isExam-label">
                  {assignment.isExam ? "Test" : "Exercise"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignMgmt;
