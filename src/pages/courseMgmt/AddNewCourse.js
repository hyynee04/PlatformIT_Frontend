import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { FaTrashAlt, FaChevronDown } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { FaRegFile } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { TbCurrencyDong } from "react-icons/tb";
import { LuMoveRight, LuX } from "react-icons/lu";
import TeacherCard from "../../components/Card/TeacherCard";

import { useNavigate } from "react-router-dom";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import DiagSettingCourseForm from "../../components/diag/DiagSettingCourseForm";
import { APIStatus } from "../../constants/constants";
import { getAllActiveTeacherCardsOfCenter } from "../../services/centerService";
import { getAllTagModel, postAddCourse } from "../../services/courseService";
const AddNewCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  // const [formValues, setFormValues] = useState({
  //   maxAttendees: null,
  //   price: null,
  //   discountedPrice: null,
  //   maxAttendeesValidate: "",
  //   priceValidate: "",
  //   registTimeValidate: "",
  //   durationValidate: "",
  //   startDate: null,
  //   endDate: null,
  //   registStartDate: null,
  //   registEndDate: null,
  // });
  const [formValues, setFormValues] = useState({
    price: "",
    discountedPrice: "",
    startDate: "",
    endDate: "",
    registStartDate: "",
    registEndDate: "",
    maxAttendees: "",
    isAttendLimited: false,
    isPremiumCourse: false,
    isTimeLimited: false,
    isSequenced: false,
    isApprovedLecture: false,
    maxAttendeesValidate: "",
    priceValidate: "",
    registTimeValidate: "",
    durationValidate: "",
  });
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

  //COVER IMAGE
  const [coverImage, setCoverImage] = useState({
    coverImgFile: null,
    coverImgUrl: "",
  });
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
  };

  //FEE
  const formatNumber = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleInputChangeNumberOnly = (field) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = formatNumber(value);
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Display`]: formattedValue,
    }));
  };
  // VALIDATE
  const validateNumberInput = (field, value) => {
    if (!isNaN(value) || value === "") {
      setFormValues((prev) => ({ ...prev, [`${field}Validate`]: "" }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [`${field}Validate`]: "Please enter a valid number",
      }));
    }
  };
  const validateDates = (values) => {
    let registTimeValidate = "";
    let durationValidate = "";
    const today = new Date().setHours(0, 0, 0, 0);
    // Kiểm tra không được trước ngày hôm nay
    if (new Date(values.registStartDate) < today) {
      registTimeValidate = "Registration start date cannot be before today";
    }
    if (new Date(values.registEndDate) < today) {
      registTimeValidate = "Registration end date cannot be before today";
    }
    if (new Date(values.startDate) < today) {
      durationValidate = "Course start date cannot be before today";
    }
    if (new Date(values.endDate) < today) {
      durationValidate = "Course end date cannot be before today";
    }

    if (new Date(values.registEndDate) < new Date(values.registStartDate)) {
      registTimeValidate =
        "Registration end date cannot be earlier than registration start date";
    }
    if (
      new Date(values.registEndDate) >= new Date(values.startDate) ||
      new Date(values.registStartDate) >= new Date(values.startDate)
    ) {
      registTimeValidate =
        "Course start date must be after the registration period";
    }
    if (new Date(values.endDate) < new Date(values.startDate)) {
      durationValidate = "End date cannot be earlier than start date";
    }

    // if (values.startDate && !values.endDate) {
    //   durationValidate = "Please enter an end date for the course";
    // }
    // if (values.endDate && !values.startDate) {
    //   durationValidate = "Please enter a start date for the course";
    // }

    setFormValues((prev) => ({
      ...prev,
      registTimeValidate,
      durationValidate,
    }));
  };
  const handleInputChange = (field) => (e) => {
    const { value } = e.target;
    const updatedFormValues = { ...formValues, [field]: value };
    setFormValues(updatedFormValues);
    if (
      field === "maxAttendees" ||
      field === "price" ||
      field === "discountedPrice"
    ) {
      validateNumberInput(field, value);
    }
    validateDates(updatedFormValues);
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  //SETTING
  const [isModalSettingOpen, setIsModalSettingOpen] = useState(false);

  const openSettingModal = () => setIsModalSettingOpen(true);
  const closeSettingModal = () => setIsModalSettingOpen(false);
  const [isApprovedLecture, setIsApprovedLecture] = useState(false);
  const [isSequenced, setIsSequenced] = useState(false);
  const handleSettingChange = (settings) => {
    setIsApprovedLecture(settings.isApprovedLecture);
    setIsSequenced(settings.isSequenced);
  };

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
  const isFormValid = () => {
    if (
      formValues.isAttendLimited &&
      (formValues.maxAttendees === "" || formValues.maxAttendeesValidate !== "")
    )
      return false;
    if (
      formValues.isPremiumCourse &&
      (formValues.price === "" || formValues.priceValidate !== "")
    )
      return false;
    if (
      formValues.isTimeLimited &&
      (formValues.startDate === "" ||
        formValues.endDate === "" ||
        formValues.registStartDate === "" ||
        formValues.registEndDate === "" ||
        formValues.registTimeValidate !== "" ||
        formValues.durationValidate !== "")
    )
      return false;
    if (!title) return false;
    if (selectedTags.length === 0) return false;
    if (!selectedTeacher) return false;

    return true;
  };
  const handleAddCourse = async () => {
    const dataToSubmit = {
      title: title,
      introduction: introduction,
      coverImg: coverImage.coverImgFile || null,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      price: formValues.price,
      discountedPrice: formValues.discountedPrice,
      registStartDate: formValues.registStartDate,
      registEndDate: formValues.registEndDate,
      isLimitAttendees: formValues.isAttendLimited,
      isPremiumCourse: formValues.isPremiumCourse,
      isLimitedTime: formValues.isTimeLimited,
      isSequenced: isSequenced,
      isApprovedLecture: isApprovedLecture,
      maxAttendees: formValues.maxAttendees,
      tags: selectedTags,
      idTeacher: selectedTeacher.idUser,
    };
    try {
      const response = await postAddCourse(dataToSubmit);
      if (response.status === APIStatus.success) {
        navigate("/centerAdCourse");
      }
      // await dispatchInfo(fetchCenterProfile());
      // setUpdateStr("Center information has been updated successfully!");

      // setTimeout(() => {
      //   setUpdateStr("");
      // }, 3000);
    } catch (error) {
      // setUpdateStr("There was an error updating center information.");
      throw error;
    }
  };
  return (
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="info">
                  <span>Introduction</span>
                  <Form.Control
                    as="textarea"
                    className="input-area-form-pi"
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
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
                        <LuX className="icon" onClick={() => removeTag(tag)} />
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
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="attendee">Limit attendees</label>
                  </div>
                </div>
                {formValues.isAttendLimited && (
                  <div className="info">
                    <div className="container-validate">
                      <span>Max attendees</span>
                      {formValues.maxAttendeesValidate && (
                        <span
                          className={"warning-error"}
                          style={{ color: "var(--red-color)" }}
                        >
                          {formValues.maxAttendeesValidate}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      className="input-form-pi"
                      value={formValues.maxAttendees}
                      onChange={handleInputChange("maxAttendees")}
                    />
                  </div>
                )}

                <div className="info">
                  <div className="check-container">
                    <input
                      type="checkbox"
                      name="isPremiumCourse"
                      id=""
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="premium-course">Premium Course</label>
                  </div>
                </div>
                {formValues.isPremiumCourse && (
                  <div className="info">
                    <div className="container-validate">
                      <span>Price</span>
                      {(formValues.priceValidate ||
                        formValues.discountedPriceValidate) && (
                        <span
                          className={"warning-error"}
                          style={{ color: "var(--red-color)" }}
                        >
                          {formValues.priceValidate ||
                            formValues.discountedPriceValidate}
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
                          value={formValues.priceDisplay || ""}
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
                          value={formValues.discountedPriceDisplay || ""}
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
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="time-limited">Time limited</label>
                  </div>
                </div>
                {formValues.isTimeLimited && (
                  <>
                    <div className="info">
                      <div className="container-validate">
                        <span>Registration Duration</span>
                        {formValues.registTimeValidate && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {formValues.registTimeValidate}
                          </span>
                        )}
                      </div>

                      <div className="left-to-right">
                        <input
                          type="date"
                          className="input-form-pi"
                          value={formValues.registStartDate}
                          onChange={handleInputChange("registStartDate")}
                        />
                        <LuMoveRight className="icon" />
                        <input
                          type="date"
                          className="input-form-pi"
                          value={formValues.registEndDate}
                          onChange={handleInputChange("registEndDate")}
                        />
                      </div>
                    </div>
                    <div className="info">
                      <div className="container-validate">
                        <span>Course Duration</span>
                        {formValues.durationValidate && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {formValues.durationValidate}
                          </span>
                        )}
                      </div>

                      <div className="left-to-right">
                        <input
                          type="date"
                          className="input-form-pi"
                          value={formValues.startDate}
                          onChange={handleInputChange("startDate")}
                        />
                        <LuMoveRight className="icon" />
                        <input
                          type="date"
                          className="input-form-pi"
                          value={formValues.endDate}
                          onChange={handleInputChange("endDate")}
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
              <button className="circle-btn" onClick={() => openSettingModal()}>
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
                  disabled={!isFormValid()}
                  onClick={handleAddCourse}
                >
                  Create Course
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
                isApprovedLecture={isApprovedLecture}
                isSequenced={isSequenced}
                onSettingChange={handleSettingChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewCourse;
