import React, { useState } from "react";
import { LuChevronDown, LuFilter } from "react-icons/lu";
import { TiPlus } from "react-icons/ti";
import { AssignmentStatus } from "../../constants/constants";
import FilterUser from "../../components/FilterUser";
import SortByUser from "../../components/SortByUser";
import { useNavigate } from "react-router-dom";

const TeacherAssignMgmt = () => {
  const [activeStatus, setActiveStatus] = useState(AssignmentStatus.publish);
  const handleStatusClick = (status) => {
    setActiveStatus(status);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisble, setFilterVisble] = useState(false);
  const [sortByVisible, setSortByVisible] = useState(false);
  const navigate = useNavigate();
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
      </div>
    </div>
  );
};

export default TeacherAssignMgmt;
