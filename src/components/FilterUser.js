import React, { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/css/card/FilterCard.css";
import { UserGender, UserStatus } from "../constants/constants";

const FilterUser = ({ onFilterChange, onClose, filterButtonRef }) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [gender, setGender] = useState("all");
  const [level, setLevel] = useState("all");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState("all");
  const filterRef = useRef(null);

  const handleFilterChange = () => {
    onFilterChange({
      gender: gender === "all" ? null : gender,
      level: level === "all" ? null : level,
      dateRange,
      status: status === "all" ? null : status,
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
                checked={gender === UserGender.male}
                onChange={() => setGender(UserGender.male)}
              />
              Male
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value="female"
                checked={gender === UserGender.female}
                onChange={() => setGender(UserGender.female)}
              />
              Female
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value="other"
                checked={gender === UserGender.other}
                onChange={() => setGender(UserGender.other)}
              />
              Other
            </label>
            <label className="radio-container gender">
              <input
                type="radio"
                value="all"
                checked={gender === "all"}
                onChange={() => setGender("all")}
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
                checked={level === "main"}
                onChange={() => setLevel("main")}
              />
              Main
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="mem"
                checked={level === "mem"}
                onChange={() => setLevel("mem")}
              />
              Sub
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="pending"
                checked={level === "pending"}
                onChange={() => setLevel("pending")}
              />
              Pending
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="rejected"
                checked={level === "rejected"}
                onChange={() => setLevel("rejected")}
              />
              Rejected
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="all"
                checked={level === "all"}
                onChange={() => setLevel("all")}
              />
              All
            </label>
          </div>
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
                value="pending"
                checked={status === UserStatus.pending}
                onChange={() => setStatus(UserStatus.pending)}
              />
              Pending
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
                value="locked"
                checked={status === UserStatus.locked}
                onChange={() => setStatus(UserStatus.locked)}
              />
              Locked
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

export default FilterUser;
