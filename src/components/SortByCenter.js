import React, { useEffect, useRef, useState } from "react";

const SortByCenter = ({ onSortByChange, onClose, sortByButtonRef }) => {
  const [isSortByFormVisible, setIsSortByFormVisible] = useState(true);
  const [sortField, setSortField] = useState("fullname");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSave = () => {
    onSortByChange({ field: sortField, order: sortOrder });
    setIsSortByFormVisible(false);
  };
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
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="tin">TIN</option>
                <option value="date">Date</option>
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

export default SortByCenter;
