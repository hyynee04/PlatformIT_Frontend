import React, { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/css/card/FilterCard.css";
import { UserGender, UserStatus } from "../constants/constants";

const FilterUser = ({
  gender: parentGender,
  level: parentLevel,
  dateRange: parentDateRange,
  status: parentStatus,
  onFilterChange,
  onClose,
  filterButtonRef,
}) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [localGender, setLocalGender] = useState(parentGender);
  const [localLevel, setLocalLevel] = useState(parentLevel);
  const [localDateRange, setLocalDateRange] = useState(parentDateRange);
  const [localStatus, setLocalStatus] = useState(parentStatus);
  const filterRef = useRef(null);

  const handleFilterChange = () => {
    onFilterChange({
      gender: localGender,
      level: localLevel,
      dateRange: localDateRange,
      status: localStatus,
    });
  };
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
            <span className="label-field">Gender</span>
            <label className="radio-container gender">
              <input
                type="radio"
                value="male"
                checked={localGender === UserGender.male}
                onChange={() => setLocalGender(UserGender.male)}
              />
              Male
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value="female"
                checked={localGender === UserGender.female}
                onChange={() => setLocalGender(UserGender.female)}
              />
              Female
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value="other"
                checked={localGender === UserGender.other}
                onChange={() => setLocalGender(UserGender.other)}
              />
              Other
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value={null}
                checked={localGender === null}
                onChange={() => setLocalGender(null)}
                selected
              />
              All
            </label>
          </div>
          <div className="field-filter">
            <span className="label-field">Center Admin Level </span>
            <label className="radio-container level">
              <input
                type="radio"
                value="main"
                checked={localLevel === "main"}
                onChange={() => setLocalLevel("main")}
              />
              Main
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="mem"
                checked={localLevel === "mem"}
                onChange={() => setLocalLevel("mem")}
              />
              Mem
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="pending"
                checked={localLevel === "pending"}
                onChange={() => setLocalLevel("pending")}
              />
              Pending
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="rejected"
                checked={localLevel === "rejected"}
                onChange={() => setLocalLevel("rejected")}
              />
              Rejected
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value={null}
                checked={localLevel === null}
                onChange={() => setLocalLevel(null)}
              />
              All
            </label>
          </div>
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
                value="pending"
                checked={localStatus === UserStatus.pending}
                onChange={() => setLocalStatus(UserStatus.pending)}
              />
              Pending
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
                value="locked"
                checked={localStatus === UserStatus.locked}
                onChange={() => setLocalStatus(UserStatus.locked)}
              />
              Locked
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value={null}
                checked={localStatus === null}
                onChange={() => setLocalStatus(null)}
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

export default FilterUser;
