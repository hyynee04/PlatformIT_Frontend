import React, { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/css/card/FilterCard.css";

const FilterCenter = ({ onFilterChange }) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const handleFilterChange = () => {
    onFilterChange({
      dateRange,
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
            <span className="label-field">Date</span>
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

export default FilterCenter;
