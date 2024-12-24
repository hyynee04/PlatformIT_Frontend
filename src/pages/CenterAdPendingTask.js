import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSearch, LuCheck, LuX } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { FaRegFilePdf } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskOfCenterAd,
  setActiveTypeOfTask,
} from "../store/listTaskOfCenterAd";
import default_ava from "../assets/img/default_ava.png";
import DiagActionQualiForm from "../components/diag/DiagActionQualiForm";
import {
  formatDate,
  formatDateTime,
  getPagination,
  getVideoType,
} from "../functions/function";
import DiagActionLectureForm from "../components/diag/DiagActionLectureForm";

const CenterAdPendingTask = () => {
  const dispatch = useDispatch();

  const { taskOfCenterAd, activeTypeOfTask } = useSelector(
    (state) => state.taskOfCenterAd || {}
  );
  const [loading, setLoading] = useState(false);
  const [listTask, setListTask] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const [tempSortField, setTempSortField] = useState("createdDate");
  const [tempSortOrder, setTempSortOrder] = useState("desc");
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
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [approvedQualiId, setApprovedQualiId] = useState(null);
  const [rejectedQualiId, setRejectedQualiId] = useState(null);
  const [approvedLectureId, setApprovedLectureId] = useState(null);
  const [rejectedLectureId, setRejectedLectureId] = useState(null);
  const [isModalActionOpen, setIsModalActionOpen] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      await dispatch(fetchTaskOfCenterAd(activeTypeOfTask));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch, activeTypeOfTask]);

  useEffect(() => {
    if (taskOfCenterAd) {
      setListTask(taskOfCenterAd);
    }
  }, [taskOfCenterAd]);
  const toggleRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 30;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = listTask.slice(firstIndex, lastIndex);
  const npage = Math.ceil(listTask.length / recordsPerPage);
  const handleTaskClick = (typeOfTask) => {
    dispatch(setActiveTypeOfTask(typeOfTask));
    setSearchTerm("");
    setSortField("createdDate");
    setSortOrder("desc");
  };
  const filteredRecords = records
    .filter((task) => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (
        searchTerm &&
        !(
          (task.lectureTitle &&
            task.lectureTitle.toLowerCase().includes(searchLower)) ||
          (task.lectureIntroduction &&
            task.lectureIntroduction.toLowerCase().includes(searchLower)) ||
          (task.mainMaterials &&
            task.mainMaterials[0]?.fileName &&
            task.mainMaterials[0].fileName
              .toLowerCase()
              .includes(searchLower)) ||
          (task.supportingMaterials &&
            task.supportingMaterials.some(
              (material) =>
                material.fileName &&
                material.fileName.toLowerCase().includes(searchLower)
            )) ||
          (task.courseTitle &&
            task.courseTitle.toLowerCase().includes(searchLower)) ||
          (task.teacherName &&
            task.teacherName.toLowerCase().includes(searchLower)) ||
          (task.nameUser &&
            task.nameUser.toLowerCase().includes(searchLower)) ||
          (task.qualificationName &&
            task.qualificationName.toLowerCase().includes(searchLower)) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower)) ||
          (task.createdDate &&
            formatDateTime(task.createdDate).includes(searchLower))
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === "date") {
        aValue = new Date(a.createdDate) || new Date(0);
        bValue = new Date(b.createdDate) || new Date(0);
      } else if (sortField === "nameTeacher") {
        aValue =
          activeTypeOfTask === "lectures"
            ? a.teacherName.toLowerCase()
            : a.nameUser.toLowerCase() || "";
        bValue =
          activeTypeOfTask === "lectures"
            ? b.teacherName.toLowerCase()
            : b.nameUser.toLowerCase() || "";
      } else if (sortField === "nameLecture") {
        aValue = a.lectureTitle?.toLowerCase() || "";
        bValue = b.lectureTitle?.toLowerCase() || "";
      } else if (sortField === "nameCourse") {
        aValue = a.courseTitle?.toLowerCase() || "";
        bValue = b.courseTitle?.toLowerCase() || "";
      } else if (sortField === "nameQualification") {
        aValue = a.qualificationName?.toLowerCase() || "";
        bValue = b.qualificationName?.toLowerCase() || "";
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

  const handleApproveQualification = (idQualification) => {
    setApprovedQualiId((prevSelectedId) =>
      prevSelectedId === idQualification ? null : idQualification
    );
    setRejectedQualiId(null);
    setApprovedLectureId(null);
    setRejectedLectureId(null);
  };
  const handleRejectQualification = (idQualification) => {
    setRejectedQualiId((prevSelectedId) =>
      prevSelectedId === idQualification ? null : idQualification
    );
    setApprovedQualiId(null);
    setApprovedLectureId(null);
    setRejectedLectureId(null);
  };
  const handleApproveLecture = (idLecture) => {
    setApprovedLectureId((prevSelectedId) =>
      prevSelectedId === idLecture ? null : idLecture
    );
    setApprovedQualiId(null);
    setRejectedQualiId(null);
    setRejectedLectureId(null);
  };
  const handleRejectLecture = (idLecture) => {
    setRejectedLectureId((prevSelectedId) =>
      prevSelectedId === idLecture ? null : idLecture
    );
    setApprovedQualiId(null);
    setRejectedQualiId(null);
    setApprovedLectureId(null);
  };
  const openActionModal = () => setIsModalActionOpen(true);
  const closeActionModal = () => setIsModalActionOpen(false);
  return (
    <>
      <div className="page-list-container">
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
                        <option value="date">Date</option>
                        <option value="nameTeacher">Teacher</option>
                        {activeTypeOfTask === "lectures" ? (
                          <>
                            <option value="nameLecture">Name Lecture</option>
                            <option value="nameCourse">Course</option>
                          </>
                        ) : (
                          <>
                            <option value="nameQualification">
                              Name Qualification
                            </option>
                          </>
                        )}
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
            <LuSearch className="icon search-icon" />
          </div>
        </div>
        {loading ? (
          <div className="loading-page">
            <ImSpinner2 color="#397979" />
          </div>
        ) : (
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
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((lecture, index) => (
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
                          <td>{formatDate(lecture.createdDate)}</td>
                          <td>{lecture.lectureTitle}</td>
                          <td>{lecture.courseTitle}</td>
                          <td>
                            {" "}
                            <img
                              src={lecture.avatarPath || default_ava}
                              alt=""
                              className="ava-img"
                            />
                            {lecture.teacherName}
                          </td>
                          <td className="table-cell pending">
                            <div className="btn-group">
                              <div
                                className="btn-task"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleApproveLecture(lecture.idLecture);
                                  openActionModal();
                                }}
                              >
                                <LuCheck className="check" />
                              </div>
                              {approvedLectureId === lecture.idLecture && (
                                <DiagActionLectureForm
                                  isOpen={isModalActionOpen}
                                  onClose={closeActionModal}
                                  idLecture={lecture.idLecture}
                                  activeTypeOfTask={activeTypeOfTask}
                                  isApproveAction={true}
                                />
                              )}
                              <div
                                className="btn-task"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleRejectLecture(lecture.idLecture);
                                  openActionModal();
                                }}
                              >
                                <LuX className="x" />
                              </div>
                              {rejectedLectureId === lecture.idLecture && (
                                <DiagActionLectureForm
                                  isOpen={isModalActionOpen}
                                  onClose={closeActionModal}
                                  idLecture={lecture.idLecture}
                                  activeTypeOfTask={activeTypeOfTask}
                                  isApproveAction={false}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                        {openRowIndex === index && (
                          <tr className="detail-row">
                            <td colSpan={6} style={{ padding: "32px" }}>
                              <div className="container-field">
                                <div className="container-left">
                                  <label
                                    className="title lecture"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {lecture.lectureTitle}
                                  </label>
                                  {lecture.lectureIntroduction && (
                                    <div className="field-info">
                                      <label className="title" htmlFor="">
                                        Introduction
                                      </label>
                                      <label htmlFor="">
                                        {lecture.lectureIntroduction}
                                      </label>
                                    </div>
                                  )}

                                  <div className="row-item">
                                    {lecture.supportMaterials?.length > 0 && (
                                      <div className="field-info">
                                        <label className="title" htmlFor="">
                                          Supporting materials
                                        </label>
                                        {lecture.supportMaterials.map(
                                          (file, index) => (
                                            <div className="info">
                                              <input
                                                type="text"
                                                style={{ cursor: "pointer" }}
                                                className="input-form-pi"
                                                title={file.fileName}
                                                value={file.fileName}
                                                onClick={() => {
                                                  const fileUrl = file.path;
                                                  window.open(
                                                    fileUrl,
                                                    "_blank"
                                                  );
                                                }}
                                                readOnly
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="container-right">
                                  {lecture.videoMaterial && (
                                    <div className="field-info">
                                      <label className="title" htmlFor="">
                                        Video
                                      </label>

                                      <video className="video-player" controls>
                                        {lecture.videoMaterial?.path ? (
                                          <source
                                            src={lecture.videoMaterial?.path}
                                            type={getVideoType(
                                              lecture.videoMaterial.path
                                            )}
                                          />
                                        ) : (
                                          <p>Error: Invalid file</p>
                                        )}
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    </div>
                                  )}
                                  {lecture.mainMaterials?.length > 0 && (
                                    <div className="field-info">
                                      <label className="title" htmlFor="">
                                        Materials
                                      </label>
                                      <div className="info">
                                        <input
                                          type="text"
                                          style={{ cursor: "pointer" }}
                                          className="input-form-pi"
                                          title={
                                            lecture.mainMaterials[0].fileName
                                          }
                                          value={
                                            lecture.mainMaterials[0].fileName
                                          }
                                          onClick={() => {
                                            const fileUrl =
                                              lecture.mainMaterials[0].path;
                                            window.open(fileUrl, "_blank");
                                          }}
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        No lectures are pending at the moment.
                      </td>
                    </tr>
                  )}
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
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((qualification, index) => (
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
                          <td>{formatDate(qualification.createdDate)}</td>
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
                                  idQualification={
                                    qualification.idQualification
                                  }
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
                                  idQualification={
                                    qualification.idQualification
                                  }
                                  activeTypeOfTask={activeTypeOfTask}
                                  isApproveAction={false}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                        {openRowIndex === index && (
                          <tr className="detail-row">
                            <td colSpan={5} style={{ padding: "32px" }}>
                              <div className="container-field">
                                <div className="container-left">
                                  {qualification.path &&
                                  qualification.path.endsWith(".pdf") ? (
                                    <div
                                      onClick={() =>
                                        window.open(
                                          qualification.path,
                                          "_blank"
                                        )
                                      }
                                      className="quali-img pdf-link"
                                    >
                                      <FaRegFilePdf
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        No qualifications are pending at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

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
    </>
  );
  function changeCPage(id) {
    setCurrentPage(id);
  }
};

export default CenterAdPendingTask;
