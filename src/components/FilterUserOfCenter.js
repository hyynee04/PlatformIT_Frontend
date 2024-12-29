import React, { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/css/card/FilterCard.css";
import { UserStatus } from "../constants/constants";
const FilterUserOfCenter = ({
  dateRange: parentDateRange,
  status: parentStatus,
  onFilterChange,
  onClose,
  filterButtonRef,
}) => {
  const [localDateRange, setLocalDateRange] = useState(parentDateRange);
  const [localStatus, setLocalStatus] = useState(parentStatus);
  const handleSave = () => {
    onFilterChange({ dateRange: localDateRange, status: localStatus });
    onClose();
  };
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <>
      <div ref={filterRef} className="filter-container user">
        <div className="title-filter">
          <span>Filter</span>
        </div>
        <div className="main-filter">
          <div className="field-filter">
            <span className="label-field">Date Joined</span>
            <input
              type="date"
              className="date-picker"
              value={localDateRange.startDate}
              onChange={(e) =>
                setLocalDateRange((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
            />
            <LuArrowRight />
            <input
              type="date"
              className="date-picker"
              value={localDateRange.endDate}
              onChange={(e) =>
                setLocalDateRange((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-filter">
            <span className="label-field">Status</span>
            <label className="radio-container status">
              <input
                type="radio"
                value="active"
                checked={localStatus === UserStatus.active}
                onChange={() => setLocalStatus(UserStatus.active)}
              />
              Active
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="inactive"
                checked={localStatus === UserStatus.inactive}
                onChange={() => setLocalStatus(UserStatus.inactive)}
              />
              Inactive
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="all"
                checked={localStatus === null}
                onChange={() => setLocalStatus(null)}
              />
              All
            </label>
          </div>
        </div>
        <div className="btn-filter">
          <button className="btn cancel-filter" onClick={onClose}>
            Cancel
          </button>
          <button className="btn save-filter" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterUserOfCenter;
