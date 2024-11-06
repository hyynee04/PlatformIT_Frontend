import React, { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/scss/card/FilterCard.css";
import { UserStatus } from "../constants/constants";
const FilterUserOfCenter = ({ onFilterChange }) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState("all");
  const handleFilterChange = () => {
    onFilterChange({
      dateRange,
      status: status === "all" ? null : status,
    });
  };
  if (!isFilterFormVisible) return null;
  return (
    <>
      <div className="filter-container user">
        <div className="title-filter">
          <span>Filter</span>
        </div>
        <div className="main-filter">
          <div className="field-filter">
            <span className="label-field">Date Joined</span>
            <input
              type="date"
              className="date-picker"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
            <LuArrowRight />
            <input
              type="date"
              className="date-picker"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
          <div className="field-filter">
            <span className="label-field">Status</span>
            <label className="radio-container status">
              <input
                type="radio"
                value="active"
                checked={status === UserStatus.active}
                onChange={() => setStatus(UserStatus.active)}
              />
              Active
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="inactive"
                checked={status === UserStatus.inactive}
                onChange={() => setStatus(UserStatus.inactive)}
              />
              Inactive
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="all"
                checked={status === "all"}
                onChange={() => setStatus("all")}
              />
              All
            </label>
          </div>
        </div>
        <div className="btn-filter">
          <button
            className="btn cancel-filter"
            onClick={() => setIsFilterFormVisible(false)}
          >
            Cancel
          </button>
          <button
            className="btn save-filter"
            onClick={() => {
              handleFilterChange();
              setIsFilterFormVisible(false);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterUserOfCenter;
