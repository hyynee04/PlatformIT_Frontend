import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { ImSpinner2 } from "react-icons/im";
import { FaTrashAlt, FaChevronDown } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFile } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { TbCurrencyDong } from "react-icons/tb";
import { LuMoveRight, LuX } from "react-icons/lu";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import { getAllTagModel, getCourseDetail } from "../../services/courseService";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherCard from "../../components/Card/TeacherCard";
import { getAllActiveTeacherCardsOfCenter } from "../../services/centerService";
import DiagSettingCourseForm from "../../components/diag/DiagSettingCourseForm";
import { APIStatus } from "../../constants/constants";

const UpdateCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingAct, setLoadingAct] = useState(false);

  const [courseInfo, setCourseInfo] = useState({});
  useEffect(() => {
    const fetchCourseInfo = async (idCourse) => {
      setLoading(true);
      try {
        let response = await getCourseDetail(idCourse);
        if (response.status === APIStatus.success) {
          setCourseInfo(response.data);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    const state = location.state;
    if (state?.idCourse) {
      fetchCourseInfo(state.idCourse);
    }
  }, []);

  //TAG
  const [tagOptions, setTagOptions] = useState([]);
  const [searchTagQuery, setSearchTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTagModel();
        setTagOptions(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const addNewTag = (newTag) => {
    if (!newTag) return;

    const tagToAdd = capitalizeWords(newTag);

    if (!selectedTags.includes(tagToAdd) && selectedTags.length < 20) {
      setSelectedTags((prevTags) => [...prevTags, tagToAdd]);
    }
  };

  const handleInputTagChange = (e) => {
    const value = e.target.value;
    setSearchTagQuery(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleOptionSelect = (tagName) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags((prevTags) => [...prevTags, tagName]);
    }
    setSearchTagQuery("");
    setShowDropdown(false);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      const trimmedQuery = searchTagQuery.trim();

      if (trimmedQuery && !selectedTags.includes(trimmedQuery)) {
        addNewTag(trimmedQuery);
      }

      setSearchTagQuery("");
      setShowDropdown(false);
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  //SETTING COURSE
  const [isModalSettingOpen, setIsModalSettingOpen] = useState(false);

  const openSettingModal = () => setIsModalSettingOpen(true);
  const closeSettingModal = () => setIsModalSettingOpen(false);

  //TEACHER
  //TEACHERS
  const [teacherList, setTeacherList] = useState([]);
  const [showTeacherList, setShowTeacherList] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const idCenter = +localStorage.getItem("idCenter");
        const response = await getAllActiveTeacherCardsOfCenter(idCenter);
        const data = response.data;
        const sortedTeachers = data.sort((a, b) => {
          if (a.name && !b.name) return -1;
          if (!a.name && b.name) return 1;
          if (a.name && b.name) {
            const nameComparison = a.name.localeCompare(b.name);
            if (nameComparison !== 0) return nameComparison;
          }
          if (a.courseCount !== b.courseCount) {
            return a.courseCount - b.courseCount;
          }
          if (a.teachingMajor && !b.teachingMajor) return -1;
          if (!a.teachingMajor && b.teachingMajor) return 1;
          if (a.teachingMajor && b.teachingMajor) {
            return a.teachingMajor.localeCompare(b.teachingMajor);
          }

          return 0;
        });

        setTeacherList(sortedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeacher();
  }, []);
  const handleAssignClick = () => {
    setShowTeacherList((prev) => !prev);
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherList(false);
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
      <div className="add-course-container">
        <div className="container-pi">
          <div className="container-specialized">
            <div className="container-info">
              <span className="title-span">Course Infomation</span>
              <div className="container-field">
                <div className="container-left">
                  <div className="info">
                    <span>
                      Course Name <span className="required">*</span>
                    </span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={courseInfo.courseTitle}
                      // onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Introduction</span>
                    <Form.Control
                      as="textarea"
                      className="input-area-form-pi"
                      value={courseInfo.introduction}
                      // onChange={(e) => setIntroduction(e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>
                      Tag of Course <span className="required">*</span>
                      <br />
                      <span className="note-span">
                        You can add a new tag if you can't find the tag you need
                        by typing it in and pressing enter.
                      </span>
                    </span>

                    {/* Select Container */}
                    <div className="select-container">
                      <input
                        className="input-form-pi"
                        type="text"
                        //   value={searchTagQuery}
                        //   onChange={handleInputTagChange}
                        //   onKeyDown={handleInputSubmit}
                        //   onClick={() => setShowDropdown(!showDropdown)}
                        placeholder="Search or create a new tag"
                      />
                      <FaChevronDown className="arrow-icon" />
                      {showDropdown && (
                        <div className="dropdown-menu-tag">
                          {tagOptions
                            .filter((tag) =>
                              tag.tagName
                                .toLowerCase()
                                .includes(searchTagQuery.toLowerCase())
                            )
                            .slice(0, 10)
                            .map((tag, index) => (
                              <div
                                key={index}
                                className="dropdown-item-tag"
                                onClick={() => handleOptionSelect(tag.tagName)}
                              >
                                {tag.tagName}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Tags Container */}
                    <div className="tags-container">
                      {selectedTags.map((tag, index) => (
                        <span key={index} className="tags">
                          {tag}
                          <LuX
                            className="icon"
                            onClick={() => removeTag(tag)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="info">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isAttendLimited"
                        id=""
                        //   onChange={handleCheckboxChange}
                      />
                      <label htmlFor="attendee">Limit attendees</label>
                    </div>
                  </div>
                  {courseInfo.isAttendLimited && (
                    <div className="info">
                      <div className="container-validate">
                        <span>Max attendees</span>
                        {courseInfo.maxAttendeesValidate && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {courseInfo.maxAttendeesValidate}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        className="input-form-pi"
                        value={courseInfo.maxAttendees}
                        //   onChange={handleInputChange("maxAttendees")}
                      />
                    </div>
                  )}

                  <div className="info">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isPremiumCourse"
                        id=""
                        //   onChange={handleCheckboxChange}
                      />
                      <label htmlFor="premium-course">Premium Course</label>
                    </div>
                  </div>
                  {courseInfo.isPremiumCourse && (
                    <div className="info">
                      <div className="container-validate">
                        <span>Price</span>
                        {(courseInfo.priceValidate ||
                          courseInfo.discountedPriceValidate) && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {courseInfo.priceValidate ||
                              courseInfo.discountedPriceValidate}
                          </span>
                        )}
                      </div>
                      <div className="left-to-right">
                        <div
                          className="select-container"
                          style={{ width: "100%" }}
                        >
                          <input
                            type="text"
                            className="input-form-pi"
                            value={courseInfo.priceDisplay || ""}
                            //   onChange={handleInputChangeNumberOnly("price")}
                          />
                          <TbCurrencyDong className="arrow-icon" />
                        </div>

                        <LuMoveRight className="icon" />

                        <div
                          className="select-container"
                          style={{ width: "100%" }}
                        >
                          <input
                            type="text"
                            className="input-form-pi"
                            placeholder="Discounted"
                            value={courseInfo.discountedPriceDisplay || ""}
                            //   onChange={handleInputChangeNumberOnly(
                            //     "discountedPrice"
                            //   )}
                          />
                          <TbCurrencyDong className="arrow-icon" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="info">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isTimeLimited"
                        id=""
                        //   onChange={handleCheckboxChange}
                      />
                      <label htmlFor="time-limited">Time limited</label>
                    </div>
                  </div>
                  {courseInfo.isTimeLimited && (
                    <>
                      <div className="info">
                        <div className="container-validate">
                          <span>Registration Duration</span>
                          {courseInfo.registTimeValidate && (
                            <span
                              className={"warning-error"}
                              style={{ color: "var(--red-color)" }}
                            >
                              {courseInfo.registTimeValidate}
                            </span>
                          )}
                        </div>

                        <div className="left-to-right">
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.registStartDate}
                            //   onChange={handleInputChange("registStartDate")}
                          />
                          <LuMoveRight className="icon" />
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.registEndDate}
                            //   onChange={handleInputChange("registEndDate")}
                          />
                        </div>
                      </div>
                      <div className="info">
                        <div className="container-validate">
                          <span>Course Duration</span>
                          {courseInfo.durationValidate && (
                            <span
                              className={"warning-error"}
                              style={{ color: "var(--red-color)" }}
                            >
                              {courseInfo.durationValidate}
                            </span>
                          )}
                        </div>

                        <div className="left-to-right">
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.startDate}
                            //   onChange={handleInputChange("startDate")}
                          />
                          <LuMoveRight className="icon" />
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.endDate}
                            //   onChange={handleInputChange("endDate")}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="container-gap"></div>
                <div className="container-right">
                  <div className="cover-course-img-container">
                    <img
                      src={courseInfo.coverImgUrl || default_image}
                      alt="Course cover"
                      className="cover-course-img"
                    />
                    <button
                      className="btn quiz-img-btn attach"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleOpenImgInput();
                      }}
                    >
                      <RiAttachment2
                        className="file-icon"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      />
                    </button>
                    <button
                      className="btn quiz-img-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleDeleteFile();
                      }}
                    >
                      <FaTrashAlt
                        className="del-question"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      />
                    </button>
                  </div>

                  {/* <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    accept=".png, .jpg, .jpeg, .jfif"
                    onChange={handleImgChange}
                  /> */}
                </div>
              </div>
              <div className="alert-option">
                <button
                  className="circle-btn"
                  onClick={() => openSettingModal()}
                >
                  <FiSettings className="icon" />
                </button>
                <div className="container-button">
                  <button
                    className="discard-changes"
                    onClick={() => {
                      navigate("/centerAdCourse");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-change create-course"
                    // disabled={!isFormValid()}
                    // onClick={handleAddCourse}
                  >
                    {loadingAct && (
                      <ImSpinner2 className="icon-spin" color="#397979" />
                    )}
                    Update Course
                  </button>
                </div>
              </div>
            </div>
            <div className="container-info auto">
              <span className="title-span">
                Teacher <span className="required">*</span>
              </span>
              {selectedTeacher && <TeacherCard teacher={selectedTeacher} />}
              {!showTeacherList && (
                <div className="alert-option">
                  <button className="main-action" onClick={handleAssignClick}>
                    {!selectedTeacher ? "Assign Teacher" : "Change Teacher"}
                  </button>
                </div>
              )}

              {showTeacherList && (
                <div className="teacher-list-dropdown">
                  {teacherList.map((teacher, index) => (
                    <div
                      key={index}
                      className="teacher-item"
                      onClick={() => handleTeacherSelect(teacher)}
                    >
                      <img
                        src={teacher.avatarPath || default_ava}
                        alt={teacher.name}
                        className="teacher-avatar"
                      />
                      <div className="teacher-info">
                        <span className="teacher-name">{teacher.name}</span>
                        <span className="teacher-major">
                          {teacher.teachingMajor}
                        </span>
                        <span className="teacher-course-count">
                          <FaRegFile />
                          {teacher.coursesCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isModalSettingOpen && (
              <div>
                <DiagSettingCourseForm
                  isOpen={isModalSettingOpen}
                  onClose={closeSettingModal}
                  isApprovedLecture={courseInfo.isApprovedLecture}
                  isSequenced={courseInfo.isSequenced}
                  onSettingChange={courseInfo.handleSettingChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;
