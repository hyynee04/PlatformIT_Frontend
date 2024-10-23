import React, { useState } from "react";

const SortByUserOfCenter = ({ onSortByChange, sortCenterAdmin }) => {
  const [isSortByFormVisible, setIsSortByFormVisible] = useState(true);
  const [sortField, setSortField] = useState("fullname");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSave = () => {
    onSortByChange({ field: sortField, order: sortOrder });
    setIsSortByFormVisible(false);
  };
  if (!isSortByFormVisible) return null;
  return (
    <>
      <div className="filter-container user">
        <div className="title-filter">
          <span>Sort</span>
        </div>
        <div className="main-filter">
          <div className="field-filter">
            <span className="label-field">Sort by</span>
            <div className="select-sort-container">
              <select
                className="input-sortby"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="fullname">Fullname</option>
                <option value="phoneNumber">Phone Number</option>
                <option value="email">Email</option>
                <option value="dateJoined">Date Joined</option>
                {!sortCenterAdmin && (
                  <option value="teachingMajor">Teaching Major</option>
                )}
              </select>
            </div>
            <div className="select-sort-container">
              <select
                className="input-sortby"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
          </div>
        </div>
        <div className="btn-filter">
          <button
            className="btn cancel-filter"
            onClick={() => setIsSortByFormVisible(false)}
          >
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

export default SortByUserOfCenter;
