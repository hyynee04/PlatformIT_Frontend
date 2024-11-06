import React, { useEffect, useState } from "react";
import {
  LuChevronDown,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuX,
} from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskOfCenterAd,
  setActiveTypeOfTask,
} from "../store/listTaskOfCenterAd";
import default_ava from "../assets/img/default_ava.png";
import DiagActionQualiForm from "../components/diag/DiagActionQualiForm";

const CenterAdPendingTask = () => {
  const dispatch = useDispatch();

  const { taskOfCenterAd, status, error, activeTypeOfTask } = useSelector(
    (state) => state.taskOfCenterAd || {}
  );

  const [listTask, setListTask] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState({ field: "fullname", order: "asc" });
  const [sortByVisible, setSortByVisible] = useState(false);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [approvedQualiId, setApprovedQualiId] = useState(null);
  const [rejectedQualiId, setRejectedQualiId] = useState(null);
  const [isModalActionOpen, setIsModalActionOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
  }, [dispatch, activeTypeOfTask]);

  useEffect(() => {
    if (taskOfCenterAd) {
      setListTask(taskOfCenterAd);
    }
  }, [taskOfCenterAd]);
  // const orderedTask = listTask.sort((a, b) => {
  //   let aValue, bValue;
  //   if (sortBy.field === "name") {
  //     if (activeTypeOfTask === "lectures") {
  //       aValue = a.centerAdminName ? a.centerAdminName.toLowerCase() : "";
  //       bValue = b.centerAdminName ? b.centerAdminName.toLowerCase() : "";
  //     } else {
  //       aValue = a.centerName ? a.centerName.toLowerCase() : "";
  //       bValue = b.centerName ? b.centerName.toLowerCase() : "";
  //     }
  //   } else if (sortBy.field === "email") {
  //     if (activeTypeOfTask === "qualifications") {
  //       aValue = a.centerAdminEmail ? a.centerAdminEmail.toLowerCase() : "";
  //       bValue = b.centerAdminEmail ? b.centerAdminEmail.toLowerCase() : "";
  //     } else {
  //       aValue = a.centerEmail ? a.centerEmail.toLowerCase() : "";
  //       bValue = b.centerEmail ? b.centerEmail.toLowerCase() : "";
  //     }
  //   }
  //   return sortBy.order === "asc"
  //     ? aValue > bValue
  //       ? 1
  //       : -1
  //     : aValue < bValue
  //     ? 1
  //     : -1;
  // });

  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = listTask.slice(firstIndex, lastIndex);
  const npage = Math.ceil(listTask.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const handleTaskClick = (typeOfTask) => {
    dispatch(setActiveTypeOfTask(typeOfTask));
  };

  const handleApproveQualification = (idQualification) => {
    setApprovedQualiId((prevSelectedId) =>
      prevSelectedId === idQualification ? null : idQualification
    );
    setRejectedQualiId(null);
  };
  const handleRejectQualification = (idQualification) => {
    setRejectedQualiId((prevSelectedId) =>
      prevSelectedId === idQualification ? null : idQualification
    );
    setApprovedQualiId(null);
  };
  const openActionModal = () => setIsModalActionOpen(true);
  const closeActionModal = () => setIsModalActionOpen(false);
  return (
    <>
      <div className="page-user-container">
        <div className="title-info">
          <b>Admin Tasks Overview</b>
        </div>
        <div className="role-users-group">
          <button
            className={`role-btn ${
              activeTypeOfTask === "lectures" ? "active" : ""
            }`}
            onClick={() => handleTaskClick("lectures")}
          >
            Lectures
          </button>
          <button
            className={`role-btn ${
              activeTypeOfTask === "qualifications" ? "active" : ""
            }`}
            onClick={() => handleTaskClick("qualifications")}
          >
            Teacher Qualifications
          </button>
        </div>
        <div className="filter-search">
          <div className="filter-sort-btns">
            <div
              className="btn"
              onClick={() => {
                setSortByVisible(!sortByVisible);
              }}
            >
              <span>Sort by</span>
              <LuChevronDown className="icon" />
            </div>
            {sortByVisible &&
              {
                /* <SortByUser  /> */
              }}
          </div>
          <div className="search-container">
            <input
              type="text"
              className="search-field"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <LuSearch className="icon search-icon" />
          </div>
        </div>
        <div className="list-container">
          {activeTypeOfTask === "lectures" ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Name Lecture</th>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Approve?</th>
                </tr>
              </thead>
              <tbody>
                {/* {records.map((user, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{renderGender(user.gender)}</td>
                  <td>{user.email}</td>
                  {activeRole !== Role.student && <td>{user.centerName}</td>}
                  {activeRole === Role.centerAdmin && (
                    <td>{user.isMainCenterAdmin ? "Main" : "Sub"}</td>
                  )}
                  <td>
                    {user.joinedDate &&
                      (() => {
                        const date = new Date(user.joinedDate);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // Tháng trong JavaScript bắt đầu từ 0
                        const year = date.getFullYear();

                        return `${month}/${day}/${year}`;
                      })()}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        user.status === Status.active
                          ? "active"
                          : user.status === Status.pending
                          ? "pending"
                          : user.status === Status.inactive
                          ? "inactive"
                          : ""
                      }`}
                    >
                      {user.status === Status.active
                        ? "Active"
                        : user.status === Status.pending
                        ? "Pending"
                        : user.status === Status.inactive
                        ? "Inactive"
                        : ""}
                    </span>
                  </td>
                  <td className="table-cell" style={{ cursor: "pointer" }}>
                    <LuMoreHorizontal
                      onClick={() => handleMoreIconClick(user.idUser)}
                    />
                    {selectedUserId === user.idUser && (
                      <UserOption
                        className="user-option"
                        idUserSelected={user.idUser}
                        statusUserSelected={user.status}
                        onUserInactivated={() => setSelectedUserId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))} */}
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Teacher</th>
                  <th>Name Qualification</th>
                  <th>Approve?</th>
                </tr>
              </thead>
              <tbody>
                {records.map((qualification, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => toggleRow(index)}
                      >
                        <LuChevronDown
                          style={{ width: "24px", height: "auto" }}
                        />
                      </td>
                      <td>
                        {qualification.createdDate &&
                          (() => {
                            const date = new Date(qualification.createdDate);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = date.getFullYear();

                            return `${month}/${day}/${year}`;
                          })()}
                      </td>
                      <td>
                        <img
                          src={qualification.avatar || default_ava}
                          alt=""
                          className="ava-img"
                        />
                        {qualification.nameUser}
                      </td>
                      <td>{qualification.qualificationName}</td>
                      <td className="table-cell pending">
                        <div className="btn-group">
                          <div
                            className="btn-task"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleApproveQualification(
                                qualification.idQualification
                              );
                              openActionModal();
                            }}
                          >
                            <LuCheck className="check" />
                          </div>
                          {approvedQualiId ===
                            qualification.idQualification && (
                            <DiagActionQualiForm
                              isOpen={isModalActionOpen}
                              onClose={closeActionModal}
                              idUser={qualification.idUser}
                              idQualification={qualification.idQualification}
                              activeTypeOfTask={activeTypeOfTask}
                              isApproveAction={true}
                            />
                          )}
                          <div
                            className="btn-task"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleRejectQualification(
                                qualification.idQualification
                              );
                              openActionModal();
                            }}
                          >
                            <LuX className="x" />
                          </div>
                          {rejectedQualiId ===
                            qualification.idQualification && (
                            <DiagActionQualiForm
                              isOpen={isModalActionOpen}
                              onClose={closeActionModal}
                              idUser={qualification.idUser}
                              idQualification={qualification.idQualification}
                              activeTypeOfTask={activeTypeOfTask}
                              isApproveAction={false}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                    {openRowIndex === index && (
                      <tr className="detail-row">
                        <td colSpan={5}>
                          <div className="container-field">
                            <div className="container-left">
                              {qualification.path &&
                              qualification.path.endsWith(".pdf") ? (
                                <div
                                  onClick={() =>
                                    window.open(qualification.path, "_blank")
                                  }
                                  className="quali-img pdf-link"
                                >
                                  <FaRegFilePdf
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                  <span>Click to view PDF</span>
                                </div>
                              ) : (
                                <img
                                  src={qualification.path}
                                  className="quali-img"
                                  alt=""
                                />
                              )}
                            </div>
                            <div className="container-right">
                              <div className="info">
                                <span>Title</span>
                                <input
                                  type="text"
                                  className="input-form-pi"
                                  value={qualification.qualificationName}
                                  readOnly
                                />
                              </div>
                              <div className="info">
                                <span>Description</span>
                                <input
                                  type="text"
                                  className="input-form-pi"
                                  value={qualification.description}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pagination-container">
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link" onClick={prePage}>
                  <LuChevronLeft />
                </button>
              </li>
              {numbers.map((n, i) => (
                <li
                  className={`page-item ${currentPage === n ? "active" : ""}`}
                  key={i}
                >
                  <button
                    className="page-link btn"
                    onClick={() => changeCPage(n)}
                  >
                    {n}
                  </button>
                </li>
              ))}
              <li className="page-item">
                <button className="page-link" onClick={nextPage}>
                  <LuChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default CenterAdPendingTask;
