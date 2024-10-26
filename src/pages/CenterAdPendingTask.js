import React, { useState } from "react";
import { LuChevronDown, LuFilter, LuSearch } from "react-icons/lu";
const CenterAdPendingTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div>
      <div className="title-info">
        <b>Admin Tasks Overview</b>
      </div>
      <div className="filter-search">
        <div className="filter-sort-btns">
          <div className="btn">
            <LuFilter className="icon" />
            <span>Filter</span>
          </div>
          <div className="btn">
            <span>Sort by</span>
            <LuChevronDown className="icon" />
          </div>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-field"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LuSearch className="icon search-icon" />
        </div>
      </div>
      <div className="title-info">
        <b>Lectures</b>
      </div>
      <div className="title-info">
        <b>Teacher Qualifications</b>
      </div>
    </div>
  );
};

export default CenterAdPendingTask;
