import React, { useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import {
  LuArrowRight,
  LuChevronDown,
  LuDollarSign,
  LuFilter,
  LuPlus,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import "../assets/css/ViewAll.css";
import { Role } from "../constants/constants";
import {
  getAllCourseCards,
  getAllCourseCardsByIdCenter,
  getAllCourseCardsByIdStudent,
  getAllCourseCardsByIdTeacher,
  getAllTagModel,
} from "../services/courseService";
import CourseCard from "./Card/CourseCard";

const CourseMgmt = (props) => {
  const { role, id } = props;
  // console.log(id);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const filterBoxRef = useRef(null);
  const sortBoxRef = useRef(null);
  const tagBoxRef = useRef(null);
  const tagButtonRef = useRef(null);

  const [courseList, setCourseList] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);

  const [activeFilter, setActiveFilter] = useState(false);
  const [activeSortby, setActiveSortby] = useState(false);
  const [tagPopup, setTagPopup] = useState(false);

  // Filter Condition
  const [tagName, setTagName] = useState("");
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [courseType, setCourseType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startRegistration, setStartRegistration] = useState("");
  const [endRegistration, setEndRegistration] = useState("");

  // Sort Condition
  const [sortConditionCourse, setSortConditionCourse] = useState({
    field: "",
    direction: "",
  });

  // Search Condition
  const [searchCourse, setSearchCourse] = useState("");

  const fetchAllTagModels = async () => {
    let response = await getAllTagModel();
    setTagList(response.data);
  };

  const fetchAllCourseCards = async () => {
    setLoading(true);
    try {
      let response;
      if (id && role === Role.centerAdmin) {
        response = await getAllCourseCardsByIdCenter(id);
      } else if (id && role === Role.teacher) {
        response = await getAllCourseCardsByIdTeacher(id);
      } else if (id && role === Role.student) {
        response = await getAllCourseCardsByIdStudent(id);
      } else {
        response = await getAllCourseCards();
      }
      setCourseList(response.data);
      setCurrentCourses(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const handleSelectTag = (tag) => {
    if (!selectedTags.find((selected) => selected.idTag === tag.idTag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagPopup(false);
  };

  const handleRemoveTag = (idTag) => {
    setSelectedTags(selectedTags.filter((tag) => tag.idTag !== idTag));
  };

  const handleResetFilter = () => {
    setTagName("");
    setSelectedTags([]);
    setStartPrice("");
    setEndPrice("");
    setCourseType("All");
    setStartDate("");
    setEndDate("");
    setStartRegistration("");
    setEndRegistration("");
    setCurrentCourses(courseList);
  };

  const handleResetSort = () => {
    setSortConditionCourse({ field: "", direction: "" });
    setCurrentCourses(courseList);
  };

  const handleChangeData = (content) => {
    const filteredCourse = courseList
      ?.filter(
        (course) =>
          // Check if item tags contain any of the selected tags
          (selectedTags.length === 0 ||
            course.tags.some((tag) =>
              selectedTags.some((selected) => selected.tagName === tag)
            )) &&
          ((!parseInt(startPrice) && !parseInt(endPrice)) ||
            (course.price >= parseInt(startPrice) &&
              course.price <= parseInt(endPrice))) &&
          (courseType === "All" ||
            (courseType === "Limit" && course.isLimitedTime === 1) ||
            (courseType === "Unlimited" && course.isLimitedTime === 0)) &&
          ((courseType !== "limit" && courseType !== "all") ||
            ((!startDate ||
              new Date(course.courseStartDate) >= new Date(startDate)) &&
              (!endDate ||
                new Date(course.courseEndDate) <= new Date(endDate)) &&
              (!startRegistration ||
                new Date(course.registStartDate) >=
                new Date(startRegistration)) &&
              (!endRegistration ||
                new Date(course.registEndDate) <= new Date(endRegistration))))
      )
      .sort((a, b) => {
        // Ensure sortConditionCourse has valid values
        if (!sortConditionCourse.field || !sortConditionCourse.direction) {
          return 0; // If no sort condition is provided, return the list as is
        }
        const { field, direction } = sortConditionCourse;
        const dirMultiplier = direction === "asc" ? 1 : -1;

        // Get values directly and handle date fields by converting to timestamps if necessary
        const aValue = field.includes("Date")
          ? new Date(a[field]).getTime()
          : a[field];
        const bValue = field.includes("Date")
          ? new Date(b[field]).getTime()
          : b[field];

        // Comparison logic with direction
        if (aValue < bValue) return -1 * dirMultiplier;
        if (aValue > bValue) return 1 * dirMultiplier;
        return 0; // If values are the same, return 0
      })
      .filter(
        (course) =>
          course.courseTitle?.toLowerCase().includes(content?.toLowerCase()) ||
          course.centerName?.toLowerCase().includes(content?.toLowerCase()) ||
          course.introduction?.toLowerCase().includes(content?.toLowerCase()) ||
          course.price?.toString().includes(content)
      );
    setCurrentCourses(filteredCourse);
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  let currentItemsPage = [];
  currentItemsPage = currentCourses.slice(
    currentPage * itemsPerPage - itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchAllTagModels();
    fetchAllCourseCards();
  }, []);

  useEffect(() => {
    const handleClickOutsideTagBox = (event) => {
      if (
        tagBoxRef.current &&
        !tagBoxRef.current.contains(event.target) &&
        !tagButtonRef.current.contains(event.target)
      )
        setTagPopup(false);
    };

    const handleClickOutside = (event) => {
      if (
        filterBoxRef.current &&
        !filterBoxRef.current.contains(event.target) &&
        (!filterButtonRef.current ||
          (filterButtonRef.current.style.display !== "none" &&
            filterButtonRef.current.style.visibility !== "hidden" &&
            !filterButtonRef.current.contains(event.target))) &&
        sortBoxRef.current &&
        !sortBoxRef.current.contains(event.target) &&
        (!sortButtonRef.current ||
          (sortButtonRef.current.style.display !== "none" &&
            sortButtonRef.current.style.visibility !== "hidden" &&
            !sortButtonRef.current.contains(event.target)))
      ) {
        setActiveFilter(false);
        setActiveSortby(false);
      }
    };
    // Attach both event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideTagBox);
    // Cleanup both event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideTagBox);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div className="viewall-container">
      <div className="filter-search-section">
        <div className="filter-sort-btns">
          <div
            ref={filterButtonRef}
            className="button"
            onClick={() => {
              setActiveFilter(!activeFilter);
              setActiveSortby(false);
            }}
          >
            <LuFilter color="#397979" />
            <span>Filter</span>
          </div>
          <div
            ref={sortButtonRef}
            className="button"
            onClick={() => {
              setActiveSortby(!activeSortby);
              setActiveFilter(false);
            }}
          >
            <span>Sort by</span>
            <LuChevronDown color="#397979" />
          </div>
          {role && role === Role.centerAdmin && (
            <div className="button add" onClick={() => navigate("/addCourse")}>
              <LuPlus color="#397979" />
              <span>Add course</span>
            </div>
          )}
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-field"
            placeholder="Search"
            value={searchCourse}
            onChange={(event) => {
              setSearchCourse(event.target.value);
              handleChangeData(event.target.value);
            }}
          />
          <LuSearch color="#397979" />
        </div>

        {/*Filter Box*/}
        <div
          ref={filterBoxRef}
          className={`filter-sort-box ${activeFilter ? "active" : ""}`}
        >
          <span className="box-title">Filter</span>
          <div className="main-box">
            <div className="field tag">
              <label className="field-name">Tags</label>
              <div className="tag-field">
                <input
                  type="text"
                  placeholder="Find tag name"
                  value={tagName}
                  onInput={(event) => {
                    const value = event.target.value;
                    setTagName(value);
                    if (!value) {
                      setTagPopup(false);
                    } else {
                      setTagPopup(true);
                    }
                  }}
                />
                <button
                  ref={tagButtonRef}
                  onClick={() => setTagPopup(!tagPopup)}
                >
                  <LuChevronDown color="#397979" />
                </button>
                {selectedTags && selectedTags !== 0 && (
                  <div className="tag-container">
                    {selectedTags.map((tag) => (
                      <div key={tag.idTag} className="tag-showed">
                        <span>{tag.tagName}</span>
                        <button onClick={() => handleRemoveTag(tag.idTag)}>
                          <LuX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div
                  ref={tagBoxRef}
                  className={`tag-popup ${tagPopup ? "active" : ""}`}
                >
                  {tagList &&
                    tagList.length !== 0 &&
                    tagList
                      .filter((tag) =>
                        tag.tagName
                          .toLowerCase()
                          .includes(tagName.toLowerCase())
                      ) // Filter tags based on input
                      .map((tag) => (
                        <button
                          key={tag.idTag}
                          onClick={() => handleSelectTag(tag)}
                        >
                          {tag.tagName}
                        </button>
                      ))}
                </div>
              </div>
            </div>
            <div className="field">
              <label className="field-name">Price</label>
              <div className="input-number-container">
                <input
                  className="input-number"
                  type="number"
                  value={startPrice}
                  placeholder="E.g. 50"
                  onChange={(event) => setStartPrice(event.target.value)}
                />
                <LuDollarSign color="#757575" />
              </div>
              <LuArrowRight />
              <div className="input-number-container">
                <input
                  className="input-number"
                  type="number"
                  value={endPrice}
                  placeholder="E.g. 50"
                  onChange={(event) => setEndPrice(event.target.value)}
                />
                <LuDollarSign color="#757575" />
              </div>
            </div>

            <div className="field">
              <label className="field-name">Course type</label>
              <div className="course-type">
                <input
                  name="course-type"
                  type="radio"
                  value="All"
                  checked={courseType === "All"}
                  onChange={(event) => setCourseType(event.target.value)}
                />{" "}
                All
              </div>
              <div className="course-type">
                <input
                  name="course-type"
                  type="radio"
                  value="Limited"
                  checked={courseType === "Limited"}
                  onChange={(event) => setCourseType(event.target.value)}
                />{" "}
                Limited
              </div>
              <div className="course-type">
                <input
                  name="course-type"
                  type="radio"
                  value="Unlimited"
                  checked={courseType === "Unlimited"}
                  onChange={(event) => setCourseType(event.target.value)}
                />{" "}
                Unlimited
              </div>
            </div>
            {courseType &&
              (courseType === "All" || courseType === "Limited") && (
                <>
                  <div className="field">
                    <label className="field-name">Registration date</label>
                    <div className="input-number-container">
                      <input
                        className="input-number date"
                        type="date"
                        value={startRegistration}
                        onChange={(event) =>
                          setStartRegistration(event.target.value)
                        }
                      />
                    </div>
                    <LuArrowRight />
                    <div className="input-number-container">
                      <input
                        className="input-number date"
                        type="date"
                        value={endRegistration}
                        onChange={(event) =>
                          setEndRegistration(event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-name">Course duration</label>
                    <div className="input-number-container">
                      <input
                        className="input-number date"
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                      />
                    </div>
                    <LuArrowRight />
                    <div className="input-number-container">
                      <input
                        className="input-number date"
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
          </div>
          <div className="box-footer">
            <button
              className="cancel"
              onClick={() => {
                handleResetFilter();
                setActiveFilter(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                handleChangeData(searchCourse);
                setActiveFilter(false);
              }}
            >
              Filter
            </button>
          </div>
        </div>

        <div
          ref={sortBoxRef}
          className={`filter-sort-box ${activeSortby ? "active" : ""}`}
        >
          <span className="box-title">Sort</span>
          <div className="main-box">
            <div className="field">
              <label className="field-name">Sort by</label>
              <select
                className="select-sortby"
                onChange={(e) =>
                  setSortConditionCourse({
                    ...sortConditionCourse,
                    field: e.target.value,
                  })
                }
              >
                <option value="">Field</option>
                <option value="courseTitle">Course name</option>
                <option value="price">Price</option>
                <option value="courseStartDate">Start date</option>
              </select>
              <select
                className="select-sortby"
                onChange={(e) =>
                  setSortConditionCourse({
                    ...sortConditionCourse,
                    direction: e.target.value,
                  })
                }
              >
                <option value="">Direction</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="box-footer">
            <button
              className="cancel"
              onClick={() => {
                handleResetSort();
                setActiveSortby(false);
              }}
            >
              Clear
            </button>
            <button
              className="save"
              onClick={() => {
                handleChangeData(searchCourse);
                setActiveFilter(false);
              }}
            >
              Sort
            </button>
          </div>
        </div>
      </div>
      <div className="viewall-main-section">
        <div className="all-cards-container course">
          {currentCourses.length !== 0 &&
            currentItemsPage.map((course) => (
              <div className="one-card-container">
                <CourseCard key={"course" + course.idCourse} course={course} />
                {role === Role.centerAdmin && (
                  <div className="edit-course-btn">
                    <button>
                      <FiEdit /> Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(currentCourses.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseMgmt;
