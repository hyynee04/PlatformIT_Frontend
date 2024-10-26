import React, { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import "../assets/scss/card/FilterCard.css";
import { CenterAdminLevel, Status, UserGender } from "../constants/constants";

const FilterUser = ({ onFilterChange }) => {
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(true);
  const [gender, setGender] = useState("all");
  const [level, setLevel] = useState("all");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState("all");

  const handleFilterChange = () => {
    onFilterChange({
      gender: gender === "all" ? null : gender,
      level: level === "all" ? null : level,
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
                checked={level === CenterAdminLevel.main}
                onChange={() => setLevel(CenterAdminLevel.main)}
              />
              Main
            </label>
            <label className="radio-container level">
              <input
                type="radio"
                value="mem"
                checked={level === CenterAdminLevel.mem}
                onChange={() => setLevel(CenterAdminLevel.mem)}
              />
              Sub
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
                checked={status === Status.active}
                onChange={() => setStatus(Status.active)}
              />
              Active
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="pending"
                checked={status === Status.pending}
                onChange={() => setStatus(Status.pending)}
              />
              Pending
            </label>
            <label className="radio-container status">
              <input
                type="radio"
                value="inactive"
                checked={status === Status.inactive}
                onChange={() => setStatus(Status.inactive)}
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

export default FilterUser;
