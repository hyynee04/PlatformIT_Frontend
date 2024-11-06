import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LuX, LuMoveRight } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import TeacherCard from "../../components/Card/TeacherCard";
import default_image from "../../assets/img/default_image.png";
const AddNewCourse = () => {
  const [tagOptions, setTagOptions] = useState([
    "Web Developer",
    "Software",
    "Design",
    "Other",
  ]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTimeLimited, setIsTimeLimited] = useState(false);
  const [isPremiumCourse, setIsPremiumCourse] = useState(false);
  const [isAttendLimited, setIsAttendLimited] = useState(false);

  const handleTagSelect = (event) => {
    const selectedTag = event.target.value;
    if (selectedTag && !selectedTags.includes(selectedTag)) {
      setSelectedTags([...selectedTags, selectedTag]);
    }
    event.target.value = "";
  };
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === "time-limited") setIsTimeLimited(checked);
    else if (name === "premium-course") setIsPremiumCourse(checked);
    else if (name === "attendee-limited") setIsAttendLimited(checked);
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
                  <input type="text" className="input-form-pi" />
                </div>
                <div className="info">
                  <span>Description</span>
                  <input type="text" className="input-form-pi" />
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
                    <select
                      className="input-form-pi"
                      onChange={handleTagSelect}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a tag
                      </option>
                      {tagOptions.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
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
                      name="attendee-limited"
                      id=""
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="attendee">Limit attendees</label>
                  </div>
                </div>
                {isAttendLimited && (
                  <div className="info">
                    <span>Max attendees</span>
                    <input type="text" className="input-form-pi" />
                  </div>
                )}
                <div className="info">
                  <div className="check-container">
                    <input
                      type="checkbox"
                      name="premium-course"
                      id=""
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="premium-course">Premium Course</label>
                  </div>
                </div>

                {isPremiumCourse && (
                  <div className="info">
                    <span>Price</span>
                    <div className="left-to-right">
                      <input type="text" className="input-form-pi" />
                      <LuMoveRight className="icon" />
                      <input
                        type="text"
                        className="input-form-pi"
                        placeholder="Discounted"
                      />
                    </div>
                  </div>
                )}
                <div className="info">
                  <div className="check-container">
                    <input
                      type="checkbox"
                      name="time-limited"
                      id=""
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="time-limited">Time limited</label>
                  </div>
                </div>

                {isTimeLimited && (
                  <>
                    <div className="info">
                      <span>Registration Duration</span>
                      <div className="left-to-right">
                        <input type="date" className="input-form-pi" />
                        <LuMoveRight className="icon" />
                        <input type="date" className="input-form-pi" />
                      </div>
                    </div>
                    <div className="info">
                      <span>Course Duration</span>
                      <div className="left-to-right">
                        <input type="date" className="input-form-pi" />
                        <LuMoveRight className="icon" />
                        <input type="date" className="input-form-pi" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="container-gap"></div>
              <div className="container-right">
                <img src={default_image} alt="" className="cover-course-img" />
              </div>
            </div>
            <div className="alert-option">
              <button className="circle-btn">
                <FiSettings className="icon" />
              </button>
              <div className="container-button">
                <button className="discard-changes">Cancel</button>
                <button className="save-change">Create Course</button>
              </div>
            </div>
          </div>
          <div className="container-info auto">
            <span className="title-span">Teacher</span>
            {/* <TeacherCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCourse;
