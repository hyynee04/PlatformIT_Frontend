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
import { RiGroupLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  APIStatus,
  AssignmentStatus,
  AssignmentType,
  Role,
} from "../../constants/constants";
import {
  deleteAssignment,
  getAllAssignmentCardOfTeacher,
  getAllTestCardOfStudent,
} from "../../services/assignmentService";
import DiagPublishAssign from "../../components/diag/DiagPublishAssign";
import {
  formatDateTime,
  formatTime,
  getPagination,
} from "../../functions/function";

const ListAssignMgmt = () => {
  const idRole = Number(localStorage.getItem("idRole"));
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState({
    delete: false,
    publish: false,
  });
  const [activeStatus, setActiveStatus] = useState(
    idRole === Role.teacher
      ? AssignmentStatus.publish
      : AssignmentStatus.upComing
  );

  const [searchTerm, setSearchTerm] = useState("");

  //FILTER
  const [filterVisble, setFilterVisble] = useState(false);
  const filterRef = useRef(null);
  const filterBtnRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(event.target)
      ) {
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
  const sortByBtnRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortByRef.current &&
        !sortByRef.current.contains(event.target) &&
        sortByBtnRef.current &&
        !sortByBtnRef.current.contains(event.target)
      ) {
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
      if (idRole === Role.teacher) {
        let response = await getAllAssignmentCardOfTeacher();
        if (response.status === APIStatus.success) {
          setListAssigment(response.data);
        }
      } else if (idRole === Role.student) {
        let response = await getAllTestCardOfStudent();
        if (response.status === APIStatus.success) {
          setListAssigment(response.data);
        }
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

  const filteredAssignments = listAssignment
    .filter((assignment) => {
      if (idRole === Role.teacher) {
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
      } else if (idRole === Role.student) {
        if (activeStatus === AssignmentStatus.upComing) {
          return assignment.isPastDue === 0 && assignment.isCompleted === 0;
        }
        if (activeStatus === AssignmentStatus.pastDue) {
          return assignment.isPastDue === 1;
        }
        if (activeStatus === AssignmentStatus.completed) {
          return assignment.isCompleted === 1;
        }
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
      } else if (sortField === "title") {
        aValue = a.title.toLowerCase() || "";
        bValue = b.title.toLowerCase() || "";
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
    const weekday = new Date(date).toLocaleDateString("en-US", options);

    const dateObj = new Date(date);
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${weekday}, ${month}/${day}/${year}`;
  };

  //CREATED DATE
  const flatAssignments = useMemo(() => {
    if (filteredAssignments.length === 0) return [];

    const grouped = filteredAssignments.reduce((acc, assignment) => {
      let dateValue;
      if (idRole === Role.teacher) {
        dateValue = assignment.updatedDate || assignment.createdDate;
      } else if (idRole === Role.student) {
        if (activeStatus === AssignmentStatus.upComing) {
          dateValue = assignment.updatedDate || assignment.createdDate;
        } else if (activeStatus === AssignmentStatus.pastDue) {
          dateValue = assignment.dueDate || assignment.courseEndDate;
        } else if (activeStatus === AssignmentStatus.completed) {
          dateValue = assignment.submittedDate;
        }
      }

      const formattedDate = formatDate(dateValue);
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(assignment);
      return acc;
    }, {});

    // Chuyển grouped thành danh sách phẳng với ngày
    return Object.entries(grouped)
      .map(([date, assignments]) =>
        assignments.map((assignment) => ({
          date,
          ...assignment,
        }))
      )
      .flat();
  }, [filteredAssignments]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20; // Số lượng assignment trên mỗi trang
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const paginatedAssignments = flatAssignments.slice(firstIndex, lastIndex);

  // Số trang
  const npage = Math.ceil(flatAssignments.length / recordsPerPage);

  // Nhóm assignments theo ngày
  const groupedAssignments = paginatedAssignments.reduce(
    (groups, assignment) => {
      const date = assignment.date; // Thuộc tính `date` của assignment
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(assignment);
      return groups;
    },
    {}
  );
  //ANIMATION
  const [className, setClassName] = useState("slide-to-right");
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
    setLoadingBtn((prevState) => ({
      ...prevState,
      delete: true,
    }));
    try {
      const response = await deleteAssignment(selectedAssignment.idAssignment);
      if (response.status === APIStatus.success) {
        fetchAssignment();
        setDiagDeleteVisible(false);
        setSelectedAssignment({});
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingBtn((prevState) => ({
        ...prevState,
        delete: false,
      }));
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
            {idRole === Role.teacher && (
              <>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.publish ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.publish)}
                >
                  Publish
                </button>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.unpublish ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.unpublish)}
                >
                  Unpublish
                </button>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.pastDue ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.pastDue)}
                >
                  Past due
                </button>
              </>
            )}
            {idRole === Role.student && (
              <>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.upComing ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.upComing)}
                >
                  Up coming
                </button>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.pastDue ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.pastDue)}
                >
                  Past due
                </button>
                <button
                  className={`status-btn ${
                    activeStatus === AssignmentStatus.completed ? "active" : ""
                  }`}
                  onClick={() => handleStatusClick(AssignmentStatus.completed)}
                >
                  Completed
                </button>
              </>
            )}
          </div>
          <div className="filter-search-assign">
            <div className="filter-sort-btns">
              <button
                ref={filterBtnRef}
                className="btn"
                onClick={() => {
                  setFilterVisble(!filterVisble);
                }}
              >
                <LuFilter className="icon" />
                <span>Filter</span>
              </button>
              {filterVisble && (
                <div ref={filterRef} className="filter-container user">
                  <div className="title-filter">
                    <span>Filter</span>
                  </div>
                  <div className="main-filter">
                    {idRole === Role.teacher && (
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
                    )}

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
              <button
                ref={sortByBtnRef}
                className="btn"
                onClick={() => {
                  setSortByVisible(!sortByVisible);
                }}
              >
                <span>Sort by</span>
                <LuChevronDown className="icon" />
              </button>
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
                          <option value="title">Name</option>
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
            {idRole === Role.teacher && (
              <button
                className="circle-btn"
                onClick={() => navigate("/addAssignment")}
              >
                <TiPlus className="icon" />
              </button>
            )}
          </div>
        </div>
        <div className={`list-assign-container ${className}`}>
          {Object.entries(groupedAssignments)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, assignments]) => {
              const sortedAssignments = assignments.sort((a, b) => {
                const dateA = new Date(a.updatedDate || a.createdDate || 0);
                const dateB = new Date(b.updatedDate || b.createdDate || 0);
                return dateB - dateA; // Gần nhất trước
              });

              return (
                <div className="time-assign-container" key={date}>
                  <span className="create-time-assign ">{date}</span>
                  {sortedAssignments.map((assignment, idx) => (
                    <div
                      className="assign-item"
                      key={idx}
                      onClick={() => {
                        if (idRole === Role.teacher) {
                          if (assignment.isPublish === 1) {
                            navigate("/teacherAssignDetail", {
                              state: {
                                idAssignment: assignment.idAssignment,
                              },
                            });
                          } else {
                            navigate("/updateAssignment", {
                              state: { idAssignment: assignment.idAssignment },
                            });
                          }
                        } else if (idRole === Role.student) {
                          navigate("/studentAssignDetail", {
                            state: { idAssignment: assignment.idAssignment },
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
                        {idRole === Role.teacher && (
                          <button
                            className="btn-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoreIconClick(assignment);
                            }}
                          >
                            <LuMoreHorizontal className="icon" />
                          </button>
                        )}
                      </div>
                      <div className="attribute-container">
                        <div className="attribute-item">
                          <LuFileEdit className="icon-attribute-assign" />
                          <label htmlFor="">
                            {assignment.assignmentType === AssignmentType.code
                              ? "Code"
                              : assignment.assignmentType ===
                                AssignmentType.quiz
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
                        {assignment.assignmentType !== AssignmentType.code && (
                          <div className="attribute-item">
                            <LuCheckSquare className="icon-attribute-assign" />
                            <label htmlFor="">
                              {assignment.questionQuantity}{" "}
                              {assignment.questionQuantity > 1
                                ? "questions"
                                : "question"}
                            </label>
                          </div>
                        )}

                        {idRole === Role.teacher && assignment.startDate && (
                          <div className="attribute-item">
                            <LuCalendar className="icon-attribute-assign" />
                            <label htmlFor="">
                              Start date: {formatDateTime(assignment.startDate)}
                            </label>
                          </div>
                        )}
                        {idRole === Role.teacher && assignment.dueDate && (
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
                        {idRole === Role.teacher && (
                          <div className="studentCount-isExam-container">
                            {assignment.isPublish === 1 && (
                              <span className="studentCount">
                                {assignment.numberOfSubmittedStudent}/
                                {assignment.numberOfStudent} <RiGroupLine />
                              </span>
                            )}
                            <span className="isExam-label">
                              {assignment.isTest ? "Test" : "Exercise"}
                            </span>
                          </div>
                        )}
                        {idRole === Role.student &&
                          (assignment.submittedDate ? (
                            <span className="submitted-label">
                              {`Submitted at: ${formatTime(
                                assignment.submittedDate
                              )}`}
                              <LuCheckSquare />
                            </span>
                          ) : (
                            assignment.dueDate && (
                              <span className="dueDate-label">
                                {`Due: ${formatDateTime(assignment.dueDate)}`}
                              </span>
                            )
                          ))}
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

        <div className="pagination">
          {getPagination(currentPage, npage).map((n, i) => (
            <button
              key={i}
              className={`page-item ${currentPage === n ? "active" : ""}`}
              onClick={() => changeCPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      {diagDeleteVisible && (
        <div
          className="modal-overlay"
          onClick={() => setDiagDeleteVisible(false)}
        >
          <div
            className="modal-container slide-to-bottom"
            onClick={(e) => e.stopPropagation()}
          >
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
                    {loadingBtn.delete && (
                      <ImSpinner2 className="icon-spin" color="#d9d9d9" />
                    )}
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
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default ListAssignMgmt;
