import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { ImSpinner2 } from "react-icons/im";
import { FaTrashAlt, FaChevronDown } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFile } from "react-icons/fa6";
import { TbCurrencyDong } from "react-icons/tb";
import { LuMoveRight, LuSettings, LuTrash2, LuX } from "react-icons/lu";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import {
  getAllTagModel,
  getViewCourse,
  postUpdateCourse,
} from "../../services/courseService";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherCard from "../../components/Card/TeacherCard";
import { getAllActiveTeacherCardsOfCenter } from "../../services/centerService";
import DiagSettingCourseForm from "../../components/diag/DiagSettingCourseForm";
import { APIStatus } from "../../constants/constants";
import DiagSuccessfully from "../../components/diag/DiagSuccessfully";
import DiagDeleteConfirmation from "../../components/diag/DiagDeleteConfirmation";

const UpdateCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingAct, setLoadingAct] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});
  const [hasStudent, setHasStudent] = useState(false);
  //TAG
  const [tagOptions, setTagOptions] = useState([]);
  const [searchTagQuery, setSearchTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [coverImage, setCoverImage] = useState({
    coverImgFile: null,
    coverImgUrl: "",
  });
  const [teacherList, setTeacherList] = useState([]);
  const [showTeacherList, setShowTeacherList] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const openSuccessModal = () => setIsModalSuccessOpen(true);
  const closeSuccessModal = () => setIsModalSuccessOpen(false);

  const [isModalRemoveOpen, setIsModalRemoveOpen] = useState(false);
  const openRemoveModal = () => setIsModalRemoveOpen(true);
  const closeRemoveModal = () => setIsModalRemoveOpen(false);

  const [isModalSettingOpen, setIsModalSettingOpen] = useState(false);

  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const validateDates = (values) => {
    let registTimeValidate = "";
    let durationValidate = "";
    const today = new Date().setHours(0, 0, 0, 0);
    if (new Date(values.registStartDate) < today) {
      registTimeValidate = "Registration start date cannot be before today";
    } else if (new Date(values.registEndDate) < today) {
      registTimeValidate = "Registration end date cannot be before today";
    } else if (
      new Date(values.registEndDate) < new Date(values.registStartDate)
    ) {
      registTimeValidate =
        "Registration end date cannot be earlier than registration start date";
    } else if (
      new Date(values.registEndDate) >= new Date(values.startDate) ||
      new Date(values.registStartDate) >= new Date(values.startDate)
    ) {
      registTimeValidate =
        "Course start date must be after the registration period";
    }

    if (new Date(values.startDate) < today) {
      durationValidate = "Course start date cannot be before today";
    } else if (new Date(values.endDate) < today) {
      durationValidate = "Course end date cannot be before today";
    } else if (new Date(values.endDate) < new Date(values.startDate)) {
      durationValidate = "End date cannot be earlier than start date";
    }
    setCourseInfo((prev) => ({
      ...prev,
      registTimeValidate,
      durationValidate,
    }));
  };
  const fetchCourseInfo = async (idCourse) => {
    setLoading(true);
    try {
      let response = await getViewCourse(idCourse);
      if (response.status === APIStatus.success) {
        setCourseInfo(response.data);
        setCourseInfo((prev) => ({
          ...prev,
          price: response.data?.price,
          priceDisplay: formatNumber(String(response.data?.price)),
        }));
        setCourseInfo((prev) => ({
          ...prev,
          discountedPrice: response.data?.discountedPrice,
          discountedPriceDisplay: formatNumber(
            String(response.data?.discountedPrice)
          ),
        }));
        setCourseInfo((prev) => ({
          ...prev,
          registStartDate: response.data?.registStartDate?.split("T")[0],
          registEndDate: response.data?.registEndDate?.split("T")[0],
          startDate: response.data?.startDate?.split("T")[0],
          endDate: response.data?.endDate?.split("T")[0],
          registTimeValidate: "",
          durationValidate: "",
        }));
        setCoverImage((prev) => ({
          ...prev,
          coverImgUrl: response.data.courseAvatar,
        }));
        setSelectedTeacher((prev) => ({
          ...prev,
          idUser: response.data?.idTeacher,
          name: response.data?.fullName,
          teachingMajor: response?.data.teachingMajor,
          avatarPath: response?.data.avatarPath,
          coursesCount: response?.data.courseCount,
        }));
        setSelectedTags(response.data.tags);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const state = location.state;
    if (state?.idCourse) {
      fetchCourseInfo(state.idCourse);
    }
    if (state?.hasStudent) {
      setHasStudent(state.hasStudent);
    }
  }, []);

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

  //FEE
  const handleInputChangeNumberOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = formatNumber(value);
    setCourseInfo((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Display`]: formattedValue,
    }));
  };

  const handleInputChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const updatedCourseInfo = { ...courseInfo, [field]: value };
    setCourseInfo(updatedCourseInfo);
    if (!hasStudent) validateDates(updatedCourseInfo);
  };
  const handleSettingChange = (updatedSettings) => {
    setCourseInfo((prev) => ({ ...prev, ...updatedSettings }));
  };

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
    if (selectedTags.length >= 20) return;
    if (!selectedTags.includes(tagName)) {
      setSelectedTags((prevTags) => [...prevTags, tagName]);
    }
    setSearchTagQuery("");
    setShowDropdown(false);
  };

  const handleInputSubmit = (e) => {
    if (selectedTags.length >= 20) return;
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

  const inputFileRef = useRef(null);
  const handleOpenImgInput = () => {
    inputFileRef.current.click();
  };
  const formatFile = (file) => {
    return {
      uri: file.uri || "",
      name: file.name || "avatar.png",
      type: file.type || "image/png",
    };
  };
  const handleImgChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formattedFile = formatFile(file);
      try {
        let blobFile;

        if (formattedFile.uri && formattedFile.uri.startsWith("blob:")) {
          let response = await fetch(formattedFile.uri);
          const blob = await response.blob();

          blobFile = new File([blob], formattedFile.name, {
            type: formattedFile.type,
          });
        } else {
          blobFile = file;
        }

        // Hủy URL cũ trước khi tạo URL mới
        if (coverImage.coverImgUrl) {
          URL.revokeObjectURL(coverImage.coverImgUrl);
        }
        const fileUrl = URL.createObjectURL(blobFile);
        setCoverImage((prev) => ({
          ...prev,
          coverImgFile: blobFile,
          coverImgUrl: fileUrl,
        }));
      } catch (error) {
        throw error;
      }
    }
  };
  const handleDeleteFile = () => {
    if (coverImage.coverImgUrl) {
      URL.revokeObjectURL(coverImage.coverImgUrl);
    }
    setCoverImage({
      coverImgFile: null,
      coverImgUrl: "",
    });
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  //SETTING COURSE

  const openSettingModal = () => setIsModalSettingOpen(true);
  const closeSettingModal = () => setIsModalSettingOpen(false);

  //TEACHERS

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
  const isFormValid = () => {
    if (courseInfo.isLimitAttendees === 1 && courseInfo.maxAttendees === "")
      return false;
    if (courseInfo.isPremiumCourse && courseInfo.price === "") return false;
    if (
      courseInfo.isLimitedTime &&
      (courseInfo.startDate === "" ||
        courseInfo.endDate === "" ||
        courseInfo.registStartDate === "" ||
        courseInfo.registEndDate === "" ||
        courseInfo.registTimeValidate !== "" ||
        courseInfo.durationValidate !== "")
    )
      return false;
    if (!courseInfo.title) return false;
    if (selectedTags.length < 1) return false;
    if (!selectedTeacher) return false;
    return true;
  };

  const handleUpdateCourse = async () => {
    const dataToSubmit = {
      idCourse: courseInfo.idCourse,
      title: courseInfo.title,
      introduction: courseInfo.introduction,
      coverImg: coverImage.coverImgFile || null,
      startDate: courseInfo.startDate,
      endDate: courseInfo.endDate,
      price: courseInfo.price,
      discountedPrice: courseInfo.discountedPrice,
      registStartDate: courseInfo.registStartDate,
      registEndDate: courseInfo.registEndDate,
      isLimitAttendees: courseInfo.isLimitAttendees,
      isPremiumCourse: courseInfo.isPremiumCourse,
      isLimitedTime: courseInfo.isLimitedTime,
      isSequenced: courseInfo.isSequenced,
      isApprovedLecture: courseInfo.isApprovedLecture,
      maxAttendees: courseInfo.maxAttendees,
      tags: selectedTags,
      idTeacher: selectedTeacher.idUser,
    };
    setLoadingAct(true);
    try {
      const response = await postUpdateCourse(dataToSubmit);
      if (response.status === APIStatus.success) {
        // navigate("/centerAdCourse");
        openSuccessModal();
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingAct(false);
    }
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
                      value={courseInfo.title}
                      onChange={handleInputChange("title")}
                    />
                  </div>
                  <div className="info">
                    <span>Introduction</span>
                    <Form.Control
                      as="textarea"
                      className="input-area-form-pi"
                      value={courseInfo.introduction}
                      onChange={handleInputChange("introduction")}
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
                        value={searchTagQuery}
                        onChange={handleInputTagChange}
                        onKeyDown={handleInputSubmit}
                        onClick={() => setShowDropdown(!showDropdown)}
                        placeholder="Search or create a new tag"
                        disabled={hasStudent}
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
                    <div className="tags-container">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="tags"
                          disabled={hasStudent}
                        >
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
                        name="isLimitAttendees"
                        checked={courseInfo.isLimitAttendees === 1}
                        onChange={(event) => {
                          const value = event.target.checked ? 1 : 0;
                          setCourseInfo((prev) => ({
                            ...prev,
                            isLimitAttendees: value,
                          }));
                        }}
                        disabled={hasStudent}
                      />
                      <label htmlFor="attendee">Limit attendees</label>
                    </div>
                  </div>
                  {courseInfo.isLimitAttendees === 1 && (
                    <div className="info">
                      <span>Max attendees</span>
                      <input
                        type="number"
                        className="input-form-pi"
                        value={courseInfo.maxAttendees}
                        onChange={handleInputChange("maxAttendees")}
                        disabled={hasStudent}
                      />
                    </div>
                  )}

                  <div className="info">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        name="isPremiumCourse"
                        id=""
                        checked={courseInfo.isPremiumCourse === 1}
                        onChange={(event) => {
                          const value = event.target.checked ? 1 : 0;
                          setCourseInfo((prev) => ({
                            ...prev,
                            isPremiumCourse: value,
                          }));
                        }}
                      />
                      <label htmlFor="premium-course">Premium Course</label>
                    </div>
                  </div>
                  {courseInfo.isPremiumCourse === 1 && (
                    <div className="info">
                      <span>Price</span>
                      <div className="left-to-right">
                        <div
                          className="select-container"
                          style={{ width: "100%" }}
                        >
                          <input
                            type="text"
                            className="input-form-pi"
                            value={courseInfo.priceDisplay || ""}
                            onChange={handleInputChangeNumberOnly("price")}
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
                            onChange={handleInputChangeNumberOnly(
                              "discountedPrice"
                            )}
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
                        checked={courseInfo.isLimitedTime === 1}
                        onChange={(event) => {
                          const value = event.target.checked ? 1 : 0;
                          setCourseInfo((prev) => ({
                            ...prev,
                            isLimitedTime: value,
                          }));
                        }}
                        disabled={hasStudent}
                      />
                      <label htmlFor="time-limited">Time limited</label>
                    </div>
                  </div>
                  {courseInfo.isLimitedTime === 1 && (
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
                            onChange={handleInputChange("registStartDate")}
                            placeholder="MM/DD/YYYY"
                            disabled={hasStudent}
                          />
                          <LuMoveRight className="icon" />
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.registEndDate}
                            onChange={handleInputChange("registEndDate")}
                            disabled={hasStudent}
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
                            onChange={handleInputChange("startDate")}
                            disabled={hasStudent}
                          />
                          <LuMoveRight className="icon" />
                          <input
                            type="date"
                            className="input-form-pi"
                            value={courseInfo.endDate}
                            onChange={handleInputChange("endDate")}
                            disabled={hasStudent}
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
                      src={coverImage.coverImgUrl || default_image}
                      alt="Course cover"
                      className="cover-course-img"
                    />
                    <button
                      className="btn quiz-img-btn attach"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenImgInput();
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
                        handleDeleteFile();
                      }}
                    >
                      <FaTrashAlt
                        className="del-question"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                      />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    accept=".png, .jpg, .jpeg, .jfif"
                    onChange={handleImgChange}
                  />
                </div>
              </div>
              <div className="alert-option">
                <div className="setting-container">
                  <button
                    className="setting"
                    onClick={() => openSettingModal()}
                  >
                    <LuSettings className="icon" />
                  </button>
                  <button className="remove" onClick={() => openRemoveModal()}>
                    <LuTrash2 />
                  </button>
                </div>

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
                    disabled={!isFormValid()}
                    onClick={() => handleUpdateCourse()}
                  >
                    {loadingAct && (
                      <ImSpinner2 className="icon-spin" color="#d9d9d9" />
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
              {!showTeacherList && !hasStudent && (
                <div className="alert-option">
                  <button
                    className="main-action"
                    onClick={handleAssignClick}
                    // disabled={hasStudent}
                  >
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
            <div>
              <DiagSettingCourseForm
                isOpen={isModalSettingOpen}
                onClose={closeSettingModal}
                isApprovedLecture={courseInfo.isApprovedLecture}
                isSequenced={courseInfo.isSequenced}
                onSettingChange={handleSettingChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <DiagSuccessfully
          isOpen={isModalSuccessOpen}
          onClose={closeSuccessModal}
          notification={`The course "${courseInfo.title}" has been successfully updated.`}
        />
      </div>
      <div>
        <DiagDeleteConfirmation
          isOpen={isModalRemoveOpen}
          onClose={closeRemoveModal}
          object={{
            id: courseInfo.idCourse,
            name: "course",
          }}
        />
      </div>
    </div>
  );
};

export default UpdateCourse;
