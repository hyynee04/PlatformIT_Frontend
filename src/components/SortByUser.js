import React, { useEffect, useRef, useState } from "react";
import "../assets/css/card/FilterCard.css";

const SortByUser = ({ onSortByChange, onClose, sortByButtonRef }) => {
  const [isSortByFormVisible, setIsSortByFormVisible] = useState(true);
  const [sortField, setSortField] = useState("fullname");
  const [sortOrder, setSortOrder] = useState("asc");
  const sortByRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortByRef.current &&
        !sortByRef.current.contains(event.target) &&
        sortByButtonRef.current &&
        !sortByButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, sortByButtonRef]);
  if (!isSortByFormVisible) return null;
  const handleSave = () => {
    onSortByChange({ field: sortField, order: sortOrder });
    setIsSortByFormVisible(false);
  };
  return (
    <>
      <div ref={sortByRef} className="filter-container user">
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
                <option value="dateJoined">Date Joined</option>
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

export default SortByUser;
