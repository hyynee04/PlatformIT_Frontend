import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LuX, LuMoveRight } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import Select from "react-select";
import TeacherCard from "../../components/Card/TeacherCard";
import default_image from "../../assets/img/default_image.png";
import { getAllTags } from "../../services/courseService";
const AddNewCourse = () => {
  const [tagOptions, setTagOptions] = useState([]);
  const [searchTagQuery, setSearchTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTimeLimited, setIsTimeLimited] = useState(false);
  const [isPremiumCourse, setIsPremiumCourse] = useState(false);
  const [isAttendLimited, setIsAttendLimited] = useState(false);

  //TAG
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
  const handleInputChange = (event) => {
    setSearchTagQuery(event.target.value);
  };

  const addNewTag = (newTag) => {
    const newTagObject = { idTag: Date.now(), tagName: newTag }; // Create a new tag with a unique ID
    setTagOptions((prevOptions) => [...prevOptions, newTagObject]); // Add new tag to the list of available tags
    setSelectedTags((prevTags) => [...prevTags, newTagObject]); // Add the tag to the selected tags
    setSearchTagQuery(""); // Clear search input after adding tag
  };

  const handleInputKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      searchTagQuery &&
      !tagOptions.some((tag) => tag.tagName === searchTagQuery)
    ) {
      addNewTag(searchTagQuery); // Thêm tag mới nếu nó chưa có
    }
  };

  const handleTagSelect = (event) => {
    const selectedTagName = event.target.value;

    // Kiểm tra nếu tag đã chọn có trong tagOptions
    const selectedTag = tagOptions.find(
      (tag) => tag.tagName === selectedTagName
    );

    // Nếu tag đã chọn và chưa có trong selectedTags, thêm vào selectedTags
    if (
      selectedTag &&
      !selectedTags.some((tag) => tag.idTag === selectedTag.idTag)
    ) {
      setSelectedTags((prevTags) => [
        ...prevTags,
        { idTag: selectedTag.idTag, tagName: selectedTag.tagName },
      ]);
    }

    // Reset lại input text và placeholder sau khi chọn tag
    // setSearchTagQuery(""); // Đặt giá trị input về trống sau khi chọn tag
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(
      selectedTags.filter((tag) => tag.idTag !== tagToRemove.idTag)
    );
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
                    {/* <select
                      className="input-form-pi"
                      onChange={handleTagSelect}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Choose a tag
                      </option>
                      {tagOptions.map((tag, index) => (
                        <option key={index} value={tag.tagName}>
                          {tag.tagName}
                        </option>
                      ))}
                    </select> */}
                    <input
                      className="input-form-pi"
                      type="text"
                      list="tagOptions"
                      value={searchTagQuery} // Liên kết giá trị của input với state searchTagQuery
                      onChange={handleInputChange}
                      onSelect={handleTagSelect} // Cập nhật khi thay đổi giá trị trong input
                      onKeyDown={handleInputKeyDown} // Thêm tag khi nhấn Enter
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
                    {selectedTags.map((tag) => (
                      <span key={tag.idTag} className="tags">
                        {tag.tagName}
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
