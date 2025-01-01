import React, { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/css/card/FilterCard.css";

const FilterCenter = ({
  dateRange: parentDateRange,
  onFilterChange,
  onClose,
  filterButtonRef,
}) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [localDateRange, setLocalDateRange] = useState(parentDateRange);
  const handleFilterChange = () => {
    onFilterChange({ dateRange: localDateRange });
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
  if (!isFilterFormVisible) return null;
  return (
    <>
      <div ref={filterRef} className="filter-container user">
        <div className="title-filter">
          <span>Filter</span>
        </div>
        <div className="main-filter">
          <div className="field-filter">
            <span className="label-field">Date</span>
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
