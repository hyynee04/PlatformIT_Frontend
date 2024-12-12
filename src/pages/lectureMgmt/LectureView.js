import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  LuAirplay,
  LuCheckSquare,
  LuClock,
  LuFileEdit,
  LuFileQuestion,
  LuPaperclip,
  LuPenLine,
  LuPlus,
  LuSettings,
  LuTrash2,
  LuUpload,
} from "react-icons/lu";
import "../../assets/css/LectureView.css";
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import { AssignmentType, Role } from "../../constants/constants";
import {
  formatDateTime,
  getVideoType,
  isPastDateTime,
} from "../../functions/function";
import { useNavigate } from "react-router-dom";
import { IoEllipsisHorizontal } from "react-icons/io5";

const LectureView = ({ lectureDetail }) => {
  const [index, setIndex] = useState(1);

  const [isEdit, setIsEdit] = useState(false);
  const [editLecture, setEditLecture] = useState({ ...lectureDetail });

  const [loading, setLoaidng] = useState(false);

  const [isOpenOption, setIsOpenOption] = useState(false);
  const optionBoxRef = useRef(null);
  const optionButtonRef = useRef(null);
  const navigate = useNavigate();
  const idRole = +localStorage.getItem("idRole");

  const menuItems = [
    { label: "Introduction", index: 1 },
    { label: "Support Materials", index: 2 },
    { label: "Exercise", index: 3 },
    { label: "Comment", index: 4 },
  ];

  const [value, setValue] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);

  const textareaRef = useRef(null);
  const contentRef = useRef(null);

  const toggleComment = () => {
    setIsExpanded(!isExpanded);
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const lineHeight = 25;
      const minHeight = 30;
      const maxHeight = 150;
      // Calculate the number of lines and the desired new height
      const lines = textarea.value.split("\n").length;
      const newHeight = Math.max(lines * lineHeight, minHeight);
      setTextAreaHeight(newHeight);
      if (newHeight > maxHeight) {
        // If the new height exceeds the maxHeight, restrict to maxHeight and enable scrollbar
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // Show scrollbar
      } else {
        // Adjust height dynamically and hide scrollbar
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = "hidden"; // Hide scrollbar
      }
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust on mount or when content changes
  }, [value]);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const containerHeight = contentRef.current.clientHeight;
      console.log(contentHeight, containerHeight);

      // Show "View More" button only if content exceeds the max height of the container
      setIsLongContent(contentHeight > containerHeight);
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutsideOptionBox = (event) => {
      if (
        optionBoxRef.current &&
        !optionBoxRef.current.contains(event.target) &&
        !optionButtonRef.current.contains(event.target)
      )
        setIsOpenOption(false);
    };
    // Attach both event listeners
    document.addEventListener("mousedown", handleClickOutsideOptionBox);
    // Cleanup both event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptionBox);
    };
  }, []);

  return (
    <>
      <div
        ref={optionBoxRef}
        className={`option-box ${isOpenOption ? "active" : ""}`}
      >
        <button
          onClick={() => {
            setIsEdit(!isEdit);
            setIsOpenOption(!isOpenOption);
            setIndex(1);
          }}
        >
          {isEdit ? (
            <>
              <LuAirplay /> Lecture View
            </>
          ) : (
            <>
              <LuPenLine /> Edit Lecture
            </>
          )}
        </button>
        <button>
          <LuTrash2 />
          Remove Lecture
        </button>
      </div>
      {isEdit && (
        <div className="lecture-header">
          <div className="lecture-head-info edit-view slide-to-bottom">
            <span className="lecture-title">Edit Lecture</span>
          </div>
          <div className="option-container">
            <button className="changes-button discard slide-to-bottom">
              Discard changes
            </button>
            <button className="changes-button save slide-to-bottom">
              Save changes
            </button>
            <button
              className="setting-button"
              ref={optionButtonRef}
              onClick={() => {
                setIsOpenOption(!isOpenOption);
              }}
            >
              <LuSettings />
            </button>
          </div>
        </div>
      )}
      <div className="lecture-header slide-to-bottom">
        <div className={`lecture-head-info ${isEdit ? "" : "teacher-view"}`}>
          {isEdit ? (
            <>
              <label
                className="field-label slide-to-bottom"
                style={{ marginBottom: "10px" }}
              >
                Lecture Title
              </label>
              <input
                className="edit-title slide-to-bottom"
                type="text"
                value={editLecture.lectureTitle}
                placeholder={editLecture.lectureTitle}
              />
            </>
          ) : (
            <>
              <span className="lecture-title">
                {lectureDetail.lectureTitle}
              </span>
              <span className="time-created">{lectureDetail.relativeTime}</span>
            </>
          )}
        </div>
        {!isEdit && (
          <div className="option-container">
            <button
              className="setting-button"
              ref={optionButtonRef}
              onClick={() => {
                setIsOpenOption(!isOpenOption);
              }}
            >
              <LuSettings />
            </button>
          </div>
        )}
      </div>

      {lectureDetail.videoMaterial || isEdit ? (
        <div
          className={`video-container  ${
            lectureDetail.videoMaterial ? "" : "slide-to-bottom no-video"
          }`}
        >
          {isEdit && (
            <>
              <div className="edit-video-header">
                <label className="field-label">Lecture video</label>
                <div className="video-button-container">
                  <button className="remove-btn">
                    <LuTrash2 /> Remove
                  </button>
                  <button className="upload-btn">
                    <LuUpload /> Upload video
                  </button>
                </div>
              </div>
            </>
          )}
          {lectureDetail.videoMaterial ? (
            <video className="video-player" controls>
              {lectureDetail?.videoMaterial?.path ? (
                <source
                  src={lectureDetail.videoMaterial.path}
                  type={getVideoType(lectureDetail.videoMaterial.path)}
                />
              ) : (
                <p>Error: Invalid file</p>
              )}
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="image-container">
              <img src={default_image} />
            </div>
          )}
        </div>
      ) : null}

      {((lectureDetail.mainMaterials &&
        lectureDetail.mainMaterials.length > 0) ||
        isEdit) && (
        <div className="main-material slide-to-right slide-to-bottom">
          <span className="title">Main Material</span>
          {isEdit && (
            <button
              className="attach-file-button"
              // onClick={() => fileInputRef.current.click()}
            >
              <LuPaperclip /> Attach file
            </button>
          )}
          <input
            className="file-container"
            type="file"
            style={{ display: "none" }}
          />
          <div className="material-content">
            <div
              onClick={() => window.open(lectureDetail.mainMaterials[0].path)}
              className="content-file"
            >
              <span>{lectureDetail.mainMaterials[0].fileName}</span>
            </div>
            {isEdit && (
              <button className="file-buttons">
                <LuTrash2 />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="lecture-main slide-to-bottom">
        <div className="lecture-main-menu">
          {menuItems
            .filter((item) => !isEdit || item.index === 1 || item.index === 2)
            .map((item) => (
              <button
                key={item.index}
                className={`${index === item.index ? "active" : ""}`}
                onClick={() => {
                  setIndex(item.index);
                }}
              >
                {item.label}
              </button>
            ))}
        </div>
        <div className="menu-part">
          {index === 1 && (
            <>
              {isEdit ? (
                <>
                  <textarea placeholder="Tell a little thing about this lecture..."></textarea>
                </>
              ) : (
                <div className="part-item">
                  {lectureDetail.lectureIntroduction && (
                    <span className="intro-content">
                      {lectureDetail.lectureIntroduction}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
          {index === 2 && (
            <>
              {isEdit ? (
                <div className="add-exercise-container">
                  <button
                    className="attach-file-button"
                    // onClick={() => fileInputRef.current.click()}
                  >
                    <LuPaperclip /> Attach file
                  </button>
                </div>
              ) : null}
              <div className="part-item">
                {lectureDetail.supportMaterials &&
                  lectureDetail.supportMaterials.length > 0 && (
                    <span className="intro-content">
                      {lectureDetail.supportMaterials.map((material, index) => (
                        <>
                          <div
                            key={index}
                            className="content-file"
                            onClick={() => window.open(material.path)}
                          >
                            <span>{material.fileName}</span>
                          </div>
                          {isEdit && (
                            <button className="file-buttons">
                              <LuTrash2 />
                            </button>
                          )}
                        </>
                      ))}
                    </span>
                  )}
              </div>
            </>
          )}
          {index === 3 && (
            <>
              {idRole === Role.teacher ? (
                <div className="add-exercise-container">
                  <button
                    className="add-ex-but"
                    onClick={() => {
                      navigate("/addAssignment", {
                        state: {
                          selectedLecture: lectureDetail,
                        },
                      });
                    }}
                  >
                    <LuPlus /> Add new exercise
                  </button>
                </div>
              ) : null}

              {lectureDetail.exercises &&
                lectureDetail.exercises.length > 0 &&
                lectureDetail.exercises.map((exercise, index) => (
                  <>
                    {(exercise.isPublish && idRole === Role.student) ||
                    idRole === Role.teacher ? (
                      <div key={index} className="part-item exercise">
                        <div
                          className="exercise-display"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (idRole === Role.teacher) {
                              if (exercise.isPublish === 1) {
                                navigate("/teacherAssignDetail", {
                                  state: {
                                    idAssignment: exercise.idAssignment,
                                  },
                                });
                              } else {
                                navigate("/updateAssignment", {
                                  state: {
                                    idAssignment: exercise.idAssignment,
                                  },
                                });
                              }
                            } else if (idRole === Role.student) {
                              navigate("/studentAssignDetail", {
                                state: { idAssignment: exercise.idAssignment },
                              });
                            }
                          }}
                        >
                          <div className="exercise-body">
                            <span className="item-title">{exercise.title}</span>
                            <div className="exercise-description">
                              {exercise.assignmentType && (
                                <span>
                                  <LuFileEdit color="#003B57" />
                                  &nbsp;
                                  {exercise.assignmentType ===
                                  AssignmentType.manual
                                    ? "MANUAL"
                                    : exercise.assignmentType ===
                                      AssignmentType.code
                                    ? "CODE"
                                    : "QUIZ"}
                                </span>
                              )}
                              {exercise.duration && (
                                <span>
                                  <LuClock color="#003B57" />
                                  &nbsp;
                                  {`${exercise.duration} ${
                                    exercise.duration > 1 ? "mins" : "min"
                                  }`}
                                </span>
                              )}
                              {exercise.questionQuantity && (
                                <span>
                                  <LuFileQuestion color="#003B57" />
                                  &nbsp;
                                  {`${exercise.questionQuantity} ${
                                    exercise.questionQuantity > 1
                                      ? "questions"
                                      : "question"
                                  }`}
                                </span>
                              )}
                            </div>
                          </div>
                          {idRole === Role.student ? (
                            <>
                              {exercise.isSubmitted ? (
                                <div className="exercise-sideinfo">
                                  <span className="complete">
                                    Complete <LuCheckSquare />
                                  </span>
                                </div>
                              ) : exercise.dueDate &&
                                isPastDateTime(exercise.dueDate) ? (
                                <div className="exercise-sideinfo">
                                  <span className="pastdue">Past due</span>
                                </div>
                              ) : (
                                exercise.dueDate && (
                                  <div className="exercise-sideinfo">
                                    <span className="inform">
                                      {formatDateTime(exercise.dueDate)}
                                    </span>
                                  </div>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              <div className="exercise-sideinfo">
                                <span
                                  className={`${
                                    exercise.isPublish
                                      ? "published"
                                      : "unpublished"
                                  }`}
                                >
                                  {`${
                                    exercise.isPublish
                                      ? "Published"
                                      : "Unpublished"
                                  }`}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
            </>
          )}
          {index === 4 && (
            <>
              <div className="part-item">
                <div className="comment-display">
                  <div className="ava-holder">
                    <img src={default_ava} />
                  </div>
                  <div className="comment-content">
                    <textarea
                      ref={textareaRef}
                      style={{ height: `${textAreaHeight}px` }}
                      placeholder="Write your comment..."
                      className="comment-entering"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></textarea>
                    <div className="button-container">
                      <button className="cancel">Cancel</button>
                      <button className="comment">Comment</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="part-item">
                <div className="comment-display">
                  <div className="ava-holder">
                    <img src={default_ava} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="commentator-name">Commentator name</span>
                      <span className="comment-time">13 hr. ago</span>
                    </div>
                    <div
                      ref={contentRef}
                      className={`comment-body ${isExpanded ? "expanded" : ""}`}
                    >
                      <span>
                        Today's lecture was incredibly insightful! The
                        explanation was clear and well-structured, especially
                        the examples that tied theory to practical applications.
                      </span>
                      <div
                        className={`blur-bottom ${
                          isLongContent && !isExpanded ? "show" : ""
                        }`}
                      ></div>
                    </div>
                    {isLongContent && (
                      <div className="view-more-container">
                        <hr className="line-1" />
                        <button
                          className="view-more-comment"
                          onClick={() => toggleComment()}
                        >
                          {isExpanded ? (
                            <>
                              View Less <IoIosArrowUp />
                            </>
                          ) : (
                            <>
                              View More <IoIosArrowDown />
                            </>
                          )}
                        </button>
                        <hr className="line-2" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="comment-responses-container">
                  <div className="more-responses">
                    <button>
                      <IoIosArrowDown /> 3 replies
                    </button>
                  </div>
                  <div className="comment-response">
                    <div className="ava-holder">
                      <img src={default_ava} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="commentator-name">
                          Commentator name
                        </span>
                        <span className="comment-time">13 hr. ago</span>
                      </div>
                      <div
                        // ref={contentRef}
                        className={`comment-body ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        <span>
                          Today's lecture was incredibly insightful! The
                          explanation was clear and well-structured, especially
                          the examples that tied theory to practical
                          applications.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="comment-response">
                    <div className="ava-holder">
                      <img src={default_ava} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-content">
                        <textarea
                          ref={textareaRef}
                          style={{ height: `${textAreaHeight}px` }}
                          placeholder="Write your comment..."
                          className="comment-entering"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        ></textarea>
                        <div className="button-container">
                          <button className="cancel">Cancel</button>
                          <button className="comment">Comment</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LectureView;
