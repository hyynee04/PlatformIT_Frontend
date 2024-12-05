import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { IoDuplicateSharp } from "react-icons/io5";
import {
  LuCalendar,
  LuCheckSquare,
  LuChevronDown,
  LuChevronRight,
  LuClock4,
  LuFileEdit,
  LuFilter,
  LuMinusCircle,
  LuMoreHorizontal,
  LuX,
} from "react-icons/lu";
import { MdPublish } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import DiagPublishAssign from "../../components/diag/DiagPublishAssign";
import {
  APIStatus,
  AssignmentStatus,
  AssignmentType,
} from "../../constants/constants";
import { formatDateTime } from "../../functions/function";
import {
  deleteAssignment,
  getAllAssignmentCardOfTeacher,
} from "../../services/courseService";

const TeacherAssignMgmt = () => {
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [activeStatus, setActiveStatus] = useState(AssignmentStatus.publish);

  const [searchTerm, setSearchTerm] = useState("");

  //FILTER
  const [filterVisble, setFilterVisble] = useState(false);
  const filterRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterVisble(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const [isTest, setIsTest] = useState("all");
  const [assignmentType, setAssignmentType] = useState("all");

  const [tempIsTest, setTempIsTest] = useState("all");
  const [tempAssignmentType, setTempAssignmentType] = useState("all");

  //SORT BY
  const [sortByVisible, setSortByVisible] = useState(false);
  const sortByRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortByRef.current && !sortByRef.current.contains(event.target)) {
        setSortByVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortByRef]);
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const [tempSortField, setTempSortField] = useState("createdDate");
  const [tempSortOrder, setTempSortOrder] = useState("desc");
  //LIST ASSIGNMENT
  const [listAssignment, setListAssigment] = useState([]);

  const navigate = useNavigate();
  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const response = await getAllAssignmentCardOfTeacher();
      if (response.status === APIStatus.success) {
        setListAssigment(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };
  useEffect(() => {
    fetchAssignment();
  }, []);

  useEffect(() => {
    if (activeStatus === 0 || activeStatus) {
      setClassName("slide-to-right");
      // Reset the class after 1 second
      const timer = setTimeout(() => {
        setClassName("");
      }, 850);
      // Cleanup timer in case activeStatus changes before timeout
      return () => clearTimeout(timer);
    }
  }, [activeStatus]);

  const filteredAssignments = listAssignment
    .filter((assignment) => {
      if (activeStatus === AssignmentStatus.publish) {
        return assignment.isPublish === 1;
      }
      if (activeStatus === AssignmentStatus.unpublish) {
        return assignment.isPublish === 0;
      }
      if (activeStatus === AssignmentStatus.pastDue) {
        return (
          assignment.isPastDue === 1 ||
          (assignment.endDate && new Date(assignment.endDate) < new Date())
        );
      }
      return true;
    })
    .filter((assignment) => {
      if (isTest !== "all" && assignment.isTest !== Number(isTest)) {
        return false;
      }
      if (
        assignmentType !== "all" &&
        assignment.assignmentType !== assignmentType
      ) {
        return false;
      }

      return true;
    })
    .filter((assignment) => {
      // Tìm kiếm theo searchTerm (theo tiêu đề)
      const searchLower = searchTerm.toLowerCase().trim();
      if (
        searchTerm &&
        !(
          (assignment.nameLecture &&
            assignment.nameLecture.toLowerCase().includes(searchLower)) ||
          (assignment.nameCourse &&
            assignment.nameCourse.toLowerCase().includes(searchLower)) ||
          (assignment.assignmentType &&
            (assignment.assignmentType === AssignmentType.manual
              ? "Manual"
              : assignment.assignmentType === AssignmentType.quiz
                ? "Quiz"
                : "Code"
            )
              .toLowerCase()
              .includes(searchTerm)) ||
          assignment.title.toLowerCase().includes(searchLower) ||
          (assignment.duration &&
            String(assignment.duration).includes(searchLower)) ||
          (assignment.questionQuantity &&
            String(assignment.questionQuantity).includes(searchLower)) ||
          (assignment.startDate &&
            formatDateTime(assignment.startDate)
              .toLowerCase()
              .includes(searchLower)) ||
          (assignment.dueDate &&
            formatDateTime(assignment.dueDate)
              .toLowerCase()
              .includes(searchLower)) ||
          (assignment.isTest === 1 ? "Test" : "Exercise")
            .toLowerCase()
            .includes(searchLower)
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "createdDate") {
        aValue = new Date(a.createdDate) || new Date(0);
        bValue = new Date(b.createdDate) || new Date(0);
      } else if (sortField === "startDate") {
        aValue = new Date(a.startDate) || new Date(0);
        bValue = new Date(b.startDate) || new Date(0);
      } else if (sortField === "dueDate") {
        aValue = new Date(a.dueDate) || new Date(0);
        bValue = new Date(b.dueDate) || new Date(0);
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  const formatDate = (date) => {
    const options = { weekday: "long" };
    const weekday = new Date(date).toLocaleDateString("en-US", options); // Lấy tên ngày

    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Tháng (bắt đầu từ 0 nên +1)
    const day = dateObj.getDate().toString().padStart(2, "0"); // Ngày
    const year = dateObj.getFullYear(); // Năm

    return `${weekday}, ${month}/${day}/${year}`;
  };

  //CREATED DATE
  const groupedAssignments = useMemo(() => {
    if (filteredAssignments.length === 0) return [];

    // Nhóm assignments theo ngày
    const grouped = filteredAssignments.reduce((acc, assignment) => {
      const formattedDate = formatDate(
        assignment.updatedDate || assignment.createdDate
      ); // Định dạng ngày
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(assignment); // Thêm assignment vào nhóm có ngày giống nhau
      return acc;
    }, {});

    // Chuyển grouped thành mảng có thứ tự theo ngày
    return Object.entries(grouped)
      .map(([date, assignments]) => ({
        date,
        assignments,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Sắp xếp từ ngày gần nhất đến xa nhất
      });
  }, [filteredAssignments]);

  const handleStatusClick = (status) => {
    setActiveStatus(status);
    setSearchTerm("");
    setSortField("createdDate");
    setTempSortField("createdDate");

    setSortOrder("desc");
    setTempSortOrder("desc");

    setIsTest("all");
    setTempIsTest("all");

    setAssignmentType("all");
    setTempAssignmentType("all");
  };
  const [selectedAssignment, setSelectedAssignment] = useState({});
  //PUBLISH ASSIGNMENT
  const [isModalPublishOpen, setIsModalPublishOpen] = useState(false);

  const openPublishModal = () => setIsModalPublishOpen(true);
  const closePublishModal = () => setIsModalPublishOpen(false);

  const [diagDeleteVisible, setDiagDeleteVisible] = useState(false);
  const optionRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target) &&
        !diagDeleteVisible &&
        !isModalPublishOpen
      ) {
        setSelectedAssignment({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionRef, diagDeleteVisible, isModalPublishOpen]);
  const handleMoreIconClick = (assignment) => {
    setSelectedAssignment((prevSelected) =>
      prevSelected === assignment ? {} : assignment
    );
  };

  //DELETE ASSIGNMENT
  const handleOpenDeleteDiag = () => {
    setDiagDeleteVisible(true);
  };
  const handleDeleteAssignment = async () => {
    try {
      const response = await deleteAssignment(selectedAssignment.idAssignment);
      if (response.status === APIStatus.success) {
        fetchAssignment();
        setDiagDeleteVisible(false);
        setSelectedAssignment({});
      }
    } catch (error) {
      throw error;
    }
  };
  const handlePublishSuccess = () => {
    fetchAssignment();
    setSelectedAssignment({});
  };

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div>
      <div className="page-list-container">
        <div className="handle-page-container">
          <div className="status-assign-btns">
            <button
              className={`status-btn ${activeStatus === AssignmentStatus.publish ? "active" : ""
                }`}
              onClick={() => handleStatusClick(AssignmentStatus.publish)}
            >
              Publish
            </button>
            <button
              className={`status-btn ${activeStatus === AssignmentStatus.unpublish ? "active" : ""
                }`}
              onClick={() => handleStatusClick(AssignmentStatus.unpublish)}
            >
              Unpublish
            </button>
            <button
              className={`status-btn ${activeStatus === AssignmentStatus.pastDue ? "active" : ""
                }`}
              onClick={() => handleStatusClick(AssignmentStatus.pastDue)}
            >
              Past due
            </button>
          </div>
          <div className="filter-search-assign">
            <div className="filter-sort-btns">
              <div
                className="btn"
                onClick={() => {
                  setFilterVisble(!filterVisble);
                }}
              >
                <LuFilter className="icon" />
                <span>Filter</span>
              </div>
              {filterVisble && (
                <div ref={filterRef} className="filter-container user">
                  <div className="title-filter">
                    <span>Filter</span>
                  </div>
                  <div className="main-filter">
                    <div className="field-filter">
                      <span className="label-field">Test/Assignment</span>
                      <label className="radio-container gender">
                        <input
                          type="radio"
                          value="exercise"
                          checked={tempIsTest === 0}
                          onChange={() => setTempIsTest(0)}
                        />
                        Exercise
                      </label>
                      <label className="radio-container gender">
                        <input
                          type="radio"
                          value="test"
                          checked={tempIsTest === 1}
                          onChange={() => setTempIsTest(1)}
                        />
                        Test
                      </label>
                      <label className="radio-container gender">
                        <input
                          type="radio"
                          value="all"
                          checked={tempIsTest === "all"}
                          onChange={() => setTempIsTest("all")}
                          selected
                        />
                        All
                      </label>
                    </div>

                    <div className="field-filter">
                      <span className="label-field">Assignment type</span>
                      <label className="radio-container status">
                        <input
                          type="radio"
                          value="manual"
                          checked={tempAssignmentType === AssignmentType.manual}
                          onChange={() =>
                            setTempAssignmentType(AssignmentType.manual)
                          }
                        />
                        Manual
                      </label>
                      <label className="radio-container status">
                        <input
                          type="radio"
                          value="quiz"
                          checked={tempAssignmentType === AssignmentType.quiz}
                          onChange={() =>
                            setTempAssignmentType(AssignmentType.quiz)
                          }
                        />
                        Quiz
                      </label>
                      <label className="radio-container status">
                        <input
                          type="radio"
                          value="code"
                          checked={tempAssignmentType === AssignmentType.code}
                          onChange={() =>
                            setTempAssignmentType(AssignmentType.code)
                          }
                        />
                        Code
                      </label>
                      <label className="radio-container status">
                        <input
                          type="radio"
                          value="all"
                          checked={tempAssignmentType === "all"}
                          onChange={() => setTempAssignmentType("all")}
                        />
                        All
                      </label>
                    </div>
                  </div>
                  <div className="btn-filter">
                    <button
                      className="btn cancel-filter"
                      onClick={() => setFilterVisble(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn save-filter"
                      onClick={() => {
                        setIsTest(tempIsTest);
                        setAssignmentType(tempAssignmentType);
                        setFilterVisble(false);
                      }}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              )}
              <div
                className="btn"
                onClick={() => {
                  setSortByVisible(!sortByVisible);
                }}
              >
                <span>Sort by</span>
                <LuChevronDown className="icon" />
              </div>
              {sortByVisible && (
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
                          value={tempSortField}
                          onChange={(e) => setTempSortField(e.target.value)}
                        >
                          <option value="startDate">Start date</option>
                          <option value="dueDate">Due date</option>
                        </select>
                      </div>
                      <div className="select-sort-container">
                        <select
                          className="input-sortby"
                          value={tempSortOrder}
                          onChange={(e) => setTempSortOrder(e.target.value)}
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="btn-filter">
                    <button
                      className="btn cancel-filter"
                      onClick={() => setSortByVisible(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn save-filter"
                      onClick={() => {
                        setSortField(tempSortField);
                        setSortOrder(tempSortOrder);
                        setSortByVisible(false);
                      }}
                    >
                      Sort
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="search-container">
              <input
                type="text"
                className="search-field"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="circle-btn"
              onClick={() => navigate("/addAssignment")}
            >
              <TiPlus className="icon" />
            </button>
          </div>
        </div>
        <div className={`list-assign-container ${className}`}>
          {groupedAssignments.map(({ date, assignments }, index) => {
            return (
              <div className="time-assign-container" key={index}>
                <span className="create-time-assign ">{date}</span>
                {assignments.map((assignment, idx) => (
                  <div
                    className="assign-item"
                    key={idx}
                    onClick={() => {
                      if (assignment.isPublish === 1) {
                        navigate("/teacherAssignDetail", {
                          state: {
                            idAssignment: assignment.idAssignment,
                          },
                        });
                      } else {
                        navigate("/updateAssignment", {
                          state: {
                            idAssignment: assignment.idAssignment,
                          },
                        });
                      }
                    }}
                  >
                    <div className="row-item">
                      <span
                        className="title-assign"
                        style={{ fontWeight: "bold" }}
                      >
                        {assignment.title}
                      </span>
                      <button
                        className="btn-option"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreIconClick(assignment);
                        }}
                      >
                        <LuMoreHorizontal className="icon" />
                      </button>
                    </div>
                    <div className="attribute-container">
                      <div className="attribute-item">
                        <LuFileEdit className="icon-attribute-assign" />
                        <label htmlFor="">
                          {assignment.assignmentType === AssignmentType.code
                            ? "Code"
                            : assignment.assignmentType === AssignmentType.quiz
                              ? "Quiz"
                              : "Manual"}
                        </label>
                      </div>
                      {assignment.duration > 0 && (
                        <div className="attribute-item">
                          <LuClock4 className="icon-attribute-assign" />
                          <label htmlFor="">
                            {assignment.duration} minutes
                          </label>
                        </div>
                      )}
                      <div className="attribute-item">
                        <LuCheckSquare className="icon-attribute-assign" />
                        <label htmlFor="">
                          {assignment.questionQuantity}{" "}
                          {assignment.questionQuantity > 1
                            ? " questions"
                            : "question"}
                        </label>
                      </div>
                      {assignment.startDate && (
                        <div className="attribute-item">
                          <LuCalendar className="icon-attribute-assign" />
                          <label htmlFor="">
                            Start date: {formatDateTime(assignment.startDate)}
                          </label>
                        </div>
                      )}
                      {assignment.dueDate && (
                        <div className="attribute-item">
                          <LuCalendar className="icon-attribute-assign" />
                          <label htmlFor="">
                            Due date: {formatDateTime(assignment.dueDate)}
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="row-item">
                      <span
                        style={{
                          fontWeight: "400",
                          color: "var(--text-gray)",
                          fontSize: "15px",
                        }}
                      >
                        Course: {assignment.nameCourse}
                        {assignment.nameLecture && (
                          <>
                            <LuChevronRight
                              className="icon"
                              style={{ width: "18px", height: "auto" }}
                            />
                            {assignment.nameLecture}
                          </>
                        )}
                      </span>
                      <span className="isExam-label">
                        {assignment.isTest ? "Test" : "Exercise"}
                      </span>
                    </div>
                    {selectedAssignment.idAssignment ===
                      assignment.idAssignment && (
                        <div
                          ref={optionRef}
                          className="container-options assignment-option"
                        >
                          {assignment.isPublish === 0 && (
                            <button
                              className="op-buts"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPublishModal();
                              }}
                            >
                              <span>Publish</span>
                              <MdPublish />
                            </button>
                          )}
                          <button
                            className="op-buts"
                            //onClick={handleOpenDeleteDiag}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/duplicateAssignment", {
                                state: {
                                  idAssignment: assignment.idAssignment,
                                },
                              });
                            }}
                          >
                            <span>Duplicate</span>
                            <IoDuplicateSharp />
                          </button>
                          <button
                            className="op-buts"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDiag();
                            }}
                          >
                            <span>Delete</span>
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {diagDeleteVisible && (
        <div
          className="modal-overlay"
          onClick={() => setDiagDeleteVisible(false)}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="diag-header"
              style={{ backgroundColor: "var(--red-color)" }}
            >
              <div className="container-title">
                <LuMinusCircle className="diag-icon" />
                <span className="diag-title">Delete Assignment</span>
              </div>
              <LuX
                className="diag-icon"
                onClick={() => setDiagDeleteVisible(false)}
              />
            </div>
            <div className="diag-body">
              {selectedAssignment.isPublish === 1 ? (
                <span
                  style={{
                    lineHeight: "1.75",
                    textAlign: "justify",
                  }}
                >
                  This assignment has been <strong>published</strong>.
                  <br />
                  Deleting it will remove all associated information, including
                  <strong> submitted work</strong>.
                  <br /> Please consider carefully before proceeding.
                </span>
              ) : (
                <span>Are you sure you want to delete this assignment?</span>
              )}

              <div className="str-btns">
                <div className="act-btns">
                  <button
                    className="btn diag-btn cancel"
                    onClick={() => setDiagDeleteVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn diag-btn signout"
                    style={{ backgroundColor: "var(--red-color)" }}
                    onClick={() => {
                      handleDeleteAssignment();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DiagPublishAssign
        isOpen={isModalPublishOpen}
        onClose={closePublishModal}
        idAssignment={selectedAssignment.idAssignment}
        onPublishSuccess={handlePublishSuccess}
      />
    </div>
  );
};

export default TeacherAssignMgmt;
