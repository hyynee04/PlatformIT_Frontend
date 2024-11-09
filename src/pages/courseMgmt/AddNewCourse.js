import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LuX, LuMoveRight } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import TeacherCard from "../../components/Card/TeacherCard";

import { getAllTags, postAddCourse } from "../../services/courseService";
import { getAllActiveTeacherCardsOfCenter } from "../../services/centerService";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import DiagSettingCourseForm from "../../components/diag/DiagSettingCourseForm";
const AddNewCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setTagOptions(response);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);
  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  const addNewTag = (newTag) => {
    if (!newTag) return;
    const existingTag = tagOptions.find(
      (tag) => tag.tagName.toLowerCase() === newTag.toLowerCase()
    );
    const tagToAdd = existingTag
      ? existingTag.tagName
      : capitalizeWords(newTag);

    if (!selectedTags.includes(tagToAdd)) {
      setSelectedTags((prevTags) => [...prevTags, tagToAdd]);
    }
    setSearchTagQuery("");
  };
  const handleInputSubmit = (event) => {
    if (event.key === "Enter") {
      addNewTag(searchTagQuery.trim());
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
        // setQualiWarning("");
      } catch (error) {
        throw error;
      }
    }
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
    if (new Date(values.registEndDate) < new Date(values.registStartDate)) {
      registTimeValidate =
        "Registration end date cannot be earlier than registration start date";
    }
    if (new Date(values.registEndDate) > new Date(values.startDate)) {
      registTimeValidate =
        "Registration end date must be before the course start date";
    }
    if (new Date(values.endDate) < new Date(values.startDate)) {
      durationValidate = "End date cannot be earlier than start date";
    }
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
  // const handleCheckboxChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormValues((prev) => ({ ...prev, [name]: checked }));
  // };
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
        const sortedTeachers = response.sort((a, b) => {
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
      (formValues.startDate === null ||
        formValues.endDate === null ||
        formValues.registStartDate === null ||
        formValues.registEndDate === null ||
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
      description: description,
      coverImg: coverImage || null,
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
    console.log(dataToSubmit);
    try {
      await postAddCourse(dataToSubmit);
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
                  <span>Course Name*</span>
                  <input
                    type="text"
                    className="input-form-pi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="info">
                  <span>Description</span>
                  <Form.Control
                    as="textarea"
                    className="input-area-form-pi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="info">
                  <span>
                    Tag of Course
                    <br />
                    <span className="note-span">
                      You can add a new tag if you can't find the tag you need
                      by typing it in and pressing enter.
                    </span>
                  </span>
                  <div className="select-container">
                    <input
                      className="input-form-pi"
                      type="text"
                      list="tagOptions"
                      value={searchTagQuery}
                      onChange={(e) => setSearchTagQuery(e.target.value)}
                      onKeyDown={handleInputSubmit} // Thêm tag khi nhấn Enter
                      placeholder="Search or create a new tag" // Placeholder sẽ hiển thị khi input trống
                    />
                    <datalist id="tagOptions">
                      {tagOptions.map((tag, index) => (
                        <option key={index} value={tag.tagName} />
                      ))}
                    </datalist>
                    <FaChevronDown className="arrow-icon" />
                  </div>
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
                      type="text"
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
                      <input
                        type="text"
                        className="input-form-pi"
                        value={formValues.price}
                        onChange={handleInputChange("price")}
                      />
                      <LuMoveRight className="icon" />
                      <input
                        type="text"
                        className="input-form-pi"
                        placeholder="Discounted"
                        value={formValues.discountedPrice}
                        onChange={handleInputChange("discountedPrice")}
                      />
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
                <img
                  src={coverImage.coverImgUrl || default_image}
                  alt="Course cover"
                  className="cover-course-img"
                  onClick={handleOpenImgInput}
                />
                <input
                  type="file"
                  ref={inputFileRef}
                  style={{ display: "none" }}
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImgChange}
                />
              </div>
            </div>
            <div className="alert-option">
              <button className="circle-btn" onClick={() => openSettingModal()}>
                <FiSettings className="icon" />
              </button>
              <div className="container-button">
                <button className="discard-changes">Cancel</button>
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
            <span className="title-span">Teacher</span>
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
