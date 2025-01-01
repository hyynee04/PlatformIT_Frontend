import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  LuArrowRight,
  LuChevronDown,
  LuFilter,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { TbCurrencyDong } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import "../assets/css/ViewAll.css";
import CenterCard from "../components/Card/CenterCard";
import CourseCard from "../components/Card/CourseCard";
import TeacherCard from "../components/Card/TeacherCard";
import { Object } from "../constants/constants";
import { getPagination } from "../functions/function";
import { getAllCenterCards } from "../services/centerService";
import { getAllCourseCards, getAllTagModel } from "../services/courseService";
import { getAllTeacherCards } from "../services/userService";

const ViewAll = () => {
  const location = useLocation();
  const idUser = +localStorage.getItem("idUser");
  const [loading, setLoading] = useState(false);
  const [statusPage, setStatusPage] = useState(1);
  const [menuIndex, setMenuIndex] = useState(1);
  const menuItems = [
    { label: "Courses", index: 1 },
    { label: "Teachers", index: 2 },
    { label: "Centers", index: 3 },
  ];
  const [activeFilter, setActiveFilter] = useState(false);
  const [activeSortby, setActiveSortby] = useState(false);
  const [tagPopup, setTagPopup] = useState(false);

  // Course conditions
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

  //Center conditions
  const [tagNameCenter, setTagNameCenter] = useState("");
  const [selectedTagsCenter, setSelectedTagsCenter] = useState([]);
  const [minCourseNumber, setMinCourseNumber] = useState("");
  const [maxCourseNumber, setMaxCourseNumber] = useState("");

  const [sortConditionCourse, setSortConditionCourse] = useState({
    field: "",
    direction: "",
  });
  const [sortConditionTeacher, setSortConditionTeacher] = useState({
    field: "",
    direction: "",
  });
  const [sortConditionCenter, setSortConditionCenter] = useState({
    field: "",
    direction: "",
  });

  const [searchCourse, setSearchCourse] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchCenter, setSearchCenter] = useState("");

  const [courseList, setCourseList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [centerList, setCenterList] = useState([]);

  const [currentPage, setCurrentPage] = useState({
    coursePage: 1,
    teacherPage: 1,
    centerPage: 1,
  });
  const itemsPerPage = 24;
  const [currentCourses, setCurrentCourses] = useState([]);
  const [currentTeachers, setCurrentTeachers] = useState([]);
  const [currentCenters, setCurrentCenters] = useState([]);

  const paginationNumbers = {
    course: getPagination(
      currentPage.coursePage,
      Math.ceil(currentCourses.length / itemsPerPage)
    ),
    teacher: getPagination(
      currentPage.teacherPage,
      Math.ceil(currentTeachers.length / itemsPerPage)
    ),
    center: getPagination(
      currentPage.centerPage,
      Math.ceil(currentCenters.length / itemsPerPage)
    ),
  };

  useEffect(() => {
    handleChangeData(
      menuIndex === 1
        ? searchCourse
        : menuIndex === 2
        ? searchTeacher
        : searchCenter
    );
  }, [menuIndex]);

  // Separate refs for each box
  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const filterBoxRef = useRef(null);
  const sortBoxRef = useRef(null);
  const tagBoxRef = useRef(null);
  const tagButtonRef = useRef(null);

  const fetchAllTagModels = async () => {
    let response = await getAllTagModel();
    setTagList(response.data);
  };

  const fetchAllCourseCards = async () => {
    let response = await getAllCourseCards(idUser);
    setCourseList(response.data);
    setCurrentCourses(response.data);
  };

  const fetchAllTeacherCards = async () => {
    let response = await getAllTeacherCards();
    setTeacherList(response.data);
    setCurrentTeachers(response.data);
  };

  const fetchAllCenterCards = async () => {
    let response = await getAllCenterCards();
    setCenterList(response.data);
    setCurrentCenters(response.data);
  };

  const handleSelectTag = (tag) => {
    if (menuIndex === 1) {
      if (!selectedTags.find((selected) => selected.idTag === tag.idTag)) {
        setSelectedTags([...selectedTags, tag]);
      }
      setTagPopup(false);
    } else {
      if (
        !selectedTagsCenter.find((selected) => selected.idTag === tag.idTag)
      ) {
        setSelectedTagsCenter([...selectedTagsCenter, tag]);
      }
      setTagPopup(false);
    }
  };

  const handleRemoveTag = (idTag) => {
    if (menuIndex === 1) {
      setSelectedTags(selectedTags.filter((tag) => tag.idTag !== idTag));
    } else
      setSelectedTagsCenter(
        selectedTagsCenter.filter((tag) => tag.idTag !== idTag)
      );
  };

  const handleFieldChange = (e) => {
    if (menuIndex === 1)
      setSortConditionCourse({ ...sortConditionCourse, field: e.target.value });
    else if (menuIndex === 2)
      setSortConditionTeacher({
        ...sortConditionTeacher,
        field: e.target.value,
      });
    else
      setSortConditionCenter({ ...sortConditionCenter, field: e.target.value });
  };

  const handleDirectionChange = (e) => {
    if (menuIndex === 1)
      setSortConditionCourse({
        ...sortConditionCourse,
        direction: e.target.value,
      });
    else if (menuIndex === 2)
      setSortConditionTeacher({
        ...sortConditionTeacher,
        direction: e.target.value,
      });
    else
      setSortConditionCenter({
        ...sortConditionCenter,
        direction: e.target.value,
      });
  };

  const handleResetFilter = () => {
    if (menuIndex === 1) {
      setTagName("");
      setSelectedTags([]);
      setStartPrice("");
      setEndPrice("");
      setCourseType("All");
      setStartDate("");
      setEndDate("");
      setStartRegistration("");
      setEndRegistration("");
    } else {
      setTagNameCenter("");
      setMinCourseNumber("");
      setMaxCourseNumber("");
    }
  };

  const handleResetSort = () => {
    if (menuIndex === 1) setSortConditionCourse({ field: "", direction: "" });
    else if (menuIndex === 2)
      setSortConditionTeacher({ field: "", direction: "" });
    else setSortConditionCenter({ field: "", direction: "" });
  };

  const handleChangeData = (content) => {
    if (courseList && menuIndex === 1) {
      const filteredCourse = courseList
        .filter(
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
              (courseType === "Limited" && course.isLimitedTime === 1) ||
              (courseType === "Unlimited" && course.isLimitedTime === 0)) &&
            ((courseType !== "Limited" && courseType !== "All") ||
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
            course.courseTitle
              ?.toLowerCase()
              .includes(content?.toLowerCase()) ||
            course.centerName?.toLowerCase().includes(content?.toLowerCase()) ||
            course.introduction
              ?.toLowerCase()
              .includes(content?.toLowerCase()) ||
            course.price?.toString().includes(content)
        );
      setCurrentCourses(filteredCourse);
    } else if (teacherList && menuIndex === 2) {
      const filteredTeacher = teacherList
        .sort((a, b) => {
          // Ensure sortConditionCourse has valid values
          if (!sortConditionTeacher.field || !sortConditionTeacher.direction) {
            return 0; // If no sort condition is provided, return the list as is
          }
          const { field, direction } = sortConditionTeacher;
          const dirMultiplier = direction === "asc" ? 1 : -1;

          const aValue =
            field === "courseCount"
              ? a.courseCount || a.coursesCount
              : field === "name"
              ? a.name || a.fullName || ""
              : field === "teachingMajor"
              ? a.teachingMajor || ""
              : a[field];

          const bValue =
            field === "courseCount"
              ? b.courseCount || b.coursesCount
              : field === "name"
              ? b.name || b.fullName || ""
              : field === "teachingMajor"
              ? b.teachingMajor || ""
              : b[field];

          // Comparison logic with direction
          if (aValue < bValue) return -1 * dirMultiplier;
          if (aValue > bValue) return 1 * dirMultiplier;
          return 0; // If values are the same, return 0
        })
        .filter(
          (teacher) =>
            teacher.name
              ?.toLowerCase()
              .includes(content?.toLocaleLowerCase()) ||
            teacher.fullName
              ?.toLowerCase()
              .includes(content?.toLocaleLowerCase()) ||
            teacher.teachingMajor
              ?.toLowerCase()
              .includes(content?.toLocaleLowerCase()) ||
            teacher.courseCount?.toString().includes(content) ||
            teacher.coursesCount?.toString().includes(content)
        );
      setCurrentTeachers(filteredTeacher);
    } else {
      const filteredCenter = centerList
        .filter(
          (center) =>
            (selectedTagsCenter.length === 0 ||
              center.listTagCourses.some((tag) =>
                selectedTagsCenter.some(
                  (selected) => selected.tagName === tag.tagName
                )
              )) &&
            ((!parseInt(minCourseNumber) && !parseInt(maxCourseNumber)) ||
              (center.coursesCount >= parseInt(minCourseNumber) &&
                center.coursesCount <= parseInt(maxCourseNumber)))
        )
        .sort((a, b) => {
          // Ensure sortConditionCourse has valid values
          if (!sortConditionTeacher.field || !sortConditionTeacher.direction) {
            return 0; // If no sort condition is provided, return the list as is
          }
          const { field, direction } = sortConditionTeacher;
          const dirMultiplier = direction === "asc" ? 1 : -1;

          const aValue = a[field];
          const bValue = b[field];

          // Comparison logic with direction
          if (aValue < bValue) return -1 * dirMultiplier;
          if (aValue > bValue) return 1 * dirMultiplier;
          return 0; // If values are the same, return 0
        })
        .filter(
          (center) =>
            center.centerName
              ?.toLocaleLowerCase()
              .includes(content?.toLocaleLowerCase()) ||
            center.description
              ?.toLocaleLowerCase()
              .includes(content?.toLocaleLowerCase()) ||
            center.studentsCount?.toString().includes(content) ||
            center.coursesCount?.toString().includes(content)
        );
      setCurrentCenters(filteredCenter);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAllTagModels();
    setLoading(true);
    const fetchAllCards = async () => {
      try {
        await fetchAllCourseCards();
        await fetchAllTeacherCards();
        await fetchAllCenterCards();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const state = location.state;
    if (state && state.listContent && state.object) {
      setStatusPage(2);
      if (state.object === Object.course) {
        setMenuIndex(1);
        setCourseList(state.listContent);
        setCurrentCourses(state.listContent);
      } else if (state.object === Object.teacher) {
        setMenuIndex(2);
        setTeacherList(state.listContent);
        setCurrentTeachers(state.listContent);
      } else {
        setMenuIndex(3);
        setCenterList(state.listContent);
        setCurrentCenters(state.listContent);
      }
      setLoading(false);
    } else if (state && state.object) {
      setStatusPage(1);
      if (state.object === Object.course) {
        setMenuIndex(1);
        localStorage.setItem("menuIndex", 1);
      } else if (state.object === Object.teacher) {
        setMenuIndex(2);
        localStorage.setItem("menuIndex", 2);
      } else {
        setMenuIndex(3);
        localStorage.setItem("menuIndex", 3);
      }
      fetchAllCards();
    }
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

  // Pagination
  let currentItemsPage = {
    coursePage: [],
    teacherPage: [],
    centerPage: [],
  };
  if (menuIndex === 1) {
    currentItemsPage.coursePage = currentCourses.slice(
      currentPage.coursePage * itemsPerPage - itemsPerPage,
      currentPage.coursePage * itemsPerPage
    );
  } else if (menuIndex === 2) {
    currentItemsPage.teacherPage = currentTeachers.slice(
      currentPage.teacherPage * itemsPerPage - itemsPerPage,
      currentPage.teacherPage * itemsPerPage
    );
  } else {
    currentItemsPage.centerPage = currentCenters.slice(
      currentPage.centerPage * itemsPerPage - itemsPerPage,
      currentPage.centerPage * itemsPerPage
    );
  }
  return (
    <div className="viewall-container">
      {statusPage && statusPage === 1 && (
        <div className="viewall-menu-section">
          {menuItems.map((item) => (
            <button
              key={item.index}
              className={`menu-button ${
                menuIndex === item.index ? "active" : ""
              }`}
              onClick={() => {
                setMenuIndex(item.index);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="filter-search-section">
        <div className="filter-sort-btns">
          {menuIndex && menuIndex !== 2 && (
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
          )}

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
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-field"
            placeholder="Search"
            value={
              menuIndex === 1
                ? searchCourse
                : menuIndex === 2
                ? searchTeacher
                : searchCenter
            }
            onChange={(event) => {
              if (menuIndex === 1) setSearchCourse(event.target.value);
              else if (menuIndex === 2) setSearchTeacher(event.target.value);
              else setSearchCenter(event.target.value);
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
          {menuIndex && menuIndex === 1 ? (
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
                  <TbCurrencyDong color="#757575" />
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
                  <TbCurrencyDong color="#757575" />
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
                  Limit
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
          ) : (
            <div className="main-box">
              <div className="field tag">
                <label className="field-name">Tags</label>
                <div className="tag-field">
                  <input
                    type="text"
                    placeholder="Find tag name"
                    value={tagNameCenter}
                    onInput={(event) => {
                      const value = event.target.value;
                      setTagNameCenter(value);
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
                  {selectedTagsCenter && selectedTagsCenter !== 0 && (
                    <div className="tag-container">
                      {selectedTagsCenter.map((tag) => (
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
                            .includes(tagNameCenter.toLowerCase())
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
                <label className="field-name">Number of courses</label>
                <div className="input-number-container">
                  <input
                    className="input-number"
                    type="number"
                    value={minCourseNumber}
                    placeholder="E.g. 0"
                    onChange={(event) => setMinCourseNumber(event.target.value)}
                  />
                </div>
                <LuArrowRight />
                <div className="input-number-container">
                  <input
                    className="input-number"
                    type="number"
                    value={maxCourseNumber}
                    placeholder="E.g. 100"
                    onChange={(event) => setMaxCourseNumber(event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

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
                handleChangeData(
                  menuIndex === 1
                    ? searchCourse
                    : menuIndex === 2
                    ? searchTeacher
                    : searchCenter
                );
                setActiveFilter(false);
              }}
            >
              Filter
            </button>
          </div>
        </div>

        {/*Sort Box*/}
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
                onChange={(e) => handleFieldChange(e)}
              >
                {menuIndex && menuIndex === 1 ? (
                  <>
                    <option value="">Field</option>
                    <option value="courseTitle">Course name</option>
                    <option value="price">Price</option>
                    <option value="courseStartDate">Start date</option>
                  </>
                ) : menuIndex === 2 ? (
                  <>
                    <option value="">Field</option>
                    <option value="name">Teacher name</option>
                    <option value="teachingMajor">Teaching major</option>
                    <option value="coursesCount">Course number</option>
                  </>
                ) : (
                  <>
                    <option value="">Field</option>
                    <option value="centername">Center name</option>
                    <option value="studentsCount">Student number</option>
                    <option value="coursesCount">Course number</option>
                  </>
                )}
              </select>
              <select
                className="select-sortby"
                onChange={(e) => handleDirectionChange(e)}
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
                handleChangeData(
                  menuIndex === 1
                    ? searchCourse
                    : menuIndex === 2
                    ? searchTeacher
                    : searchCenter
                );
                setActiveFilter(false);
              }}
            >
              Sort
            </button>
          </div>
        </div>
      </div>

      <div className="viewall-main-section">
        {loading ? (
          <div className="loading-page component">
            <ImSpinner2 color="#397979" />
          </div>
        ) : (
          <>
            {menuIndex && menuIndex === 1 ? (
              <>
                <div
                  key={menuIndex}
                  className="all-cards-container course slide-to-right"
                >
                  {currentCourses.length !== 0 &&
                    currentItemsPage.coursePage.map((course) => (
                      <div className="one-card-container">
                        <CourseCard
                          key={"course" + course.idCourse}
                          course={course}
                        />
                      </div>
                    ))}
                </div>
                <div className="pagination">
                  {paginationNumbers.course.map((number, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof number === "number" &&
                        setCurrentPage({ ...currentPage, coursePage: number })
                      }
                      className={
                        number === currentPage.coursePage ? "active" : ""
                      }
                      disabled={number === "..."}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </>
            ) : menuIndex === 2 ? (
              <>
                <div
                  key={menuIndex}
                  className="all-cards-container teacher slide-to-right"
                >
                  {currentTeachers.length !== 0 &&
                    currentItemsPage.teacherPage.map((teacher) => (
                      <div className="one-card-container">
                        <TeacherCard
                          key={"teacher" + teacher.idUser}
                          teacher={teacher}
                        />
                      </div>
                    ))}
                </div>
                <div className="pagination">
                  {paginationNumbers.teacher.map((number, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof number === "number" &&
                        setCurrentPage({ ...currentPage, teacherPage: number })
                      }
                      className={
                        number === currentPage.teacherPage ? "active" : ""
                      }
                      disabled={number === "..."}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div
                  key={menuIndex}
                  className="all-cards-container center slide-to-right"
                >
                  {currentCenters.length !== 0 &&
                    currentItemsPage.centerPage.map((center) => (
                      <div className="one-card-container">
                        <CenterCard
                          key={"center" + center.idCenter}
                          center={center}
                        />
                      </div>
                    ))}
                </div>
                <div className="pagination">
                  {paginationNumbers.center.map((number, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof number === "number" &&
                        setCurrentPage({ ...currentPage, centerPage: number })
                      }
                      className={
                        number === currentPage.centerPage ? "active" : ""
                      }
                      disabled={number === "..."}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAll;
