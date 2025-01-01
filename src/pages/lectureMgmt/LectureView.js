import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";
import { BsReplyFill, BsTrash3Fill } from "react-icons/bs";
import {
  LuAirplay,
  LuAlertTriangle,
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
import { APIStatus, AssignmentType, Role } from "../../constants/constants";
import {
  formatDateTime,
  getVideoType,
  isPastDateTime,
} from "../../functions/function";
import { useNavigate } from "react-router-dom";
import { postAddComment } from "../../services/commentService";
import FetchDataUpdated from "../../functions/FetchDataUpdated";

const LectureView = ({
  lectureDetail,
  editLecture,
  idTeacher,
  idLecture,
  mainCommentList,
  replyCommentList,
  fetchAllCommentOfLecture,
  setIsRemoved,
  setIdComment,
  setUpdatedCommentList,
  setDefaultToEditLecture,
  setEditLecture,
  setIsEditLecture,
  index,
  setIndex,
  isFinishedLecture,
  setIsFinishedLecture,
}) => {
  const navigate = useNavigate();
  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");
  const [isEdit, setIsEdit] = useState(false);

  const avaImg = useSelector((state) => state.profileUser.avaImg);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const listFileInputRef = useRef(null);

  const [generalComment, setGeneralComment] = useState({});

  const [replyComment, setReplyComment] = useState({});

  const { updatedComments } = FetchDataUpdated(null, idLecture, "comment");

  const [isLongContent, setIsLongContent] = useState({});
  const [isExpanded, setIsExpanded] = useState({});
  const [showReply, setShowReply] = useState({});
  const [isHovered, setIsHovered] = useState({});
  const [isReplied, setIsReplied] = useState({});

  const [isOpenOption, setIsOpenOption] = useState(false);
  const optionBoxRef = useRef(null);
  const optionButtonRef = useRef(null);
  const commentRefs = useRef({});
  const textAreaRefs = useRef({});

  useEffect(() => {
    mainCommentList.forEach((comment) => {
      if (!textAreaRefs.current[comment.idComment]) {
        textAreaRefs.current[comment.idComment] = React.createRef();
      }
    });
  }, [mainCommentList]);

  const menuItems = [
    { label: "Introduction", index: 1 },
    { label: "Support Materials", index: 2 },
    { label: "Exercise", index: 3 },
    { label: "Comment", index: 4 },
  ];

  const [isMissing, setIsMissing] = useState(0);
  const [errorList, setErrorList] = useState({
    0: "",
    1: "Missing section name!",
    2: "Missing Lecture Video or Material!",
    3: "",
  });

  const handleAddComment = async (commentData) => {
    try {
      let response = await postAddComment(commentData);
      if (response.status === APIStatus.success) {
        fetchAllCommentOfLecture(lectureDetail.idLecture);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const handleMouseEnter = (idComment) => {
    setIsHovered({
      ...isHovered,
      [idComment]: true,
    });
  };

  const handleMouseLeaver = (idComment) => {
    setIsHovered({
      ...isHovered,
      [idComment]: false,
    });
  };

  const handleDelete = (index) => {
    // Implement your deletion logic here
    const updatedFiles = editLecture.SupportMaterials.filter(
      (_, i) => i !== index
    );
    setEditLecture({ ...editLecture, SupportMaterials: updatedFiles });
  };

  const handleSaveData = async (editLecture) => {
    const keepFiles = [];
    if (!editLecture.Title) {
      setIsMissing(1);
      return;
    }
    if (!editLecture.LectureVideo && !editLecture.MainMaterials) {
      setIsMissing(2);
      return;
    }
    if (
      editLecture.LectureVideo &&
      typeof editLecture.LectureVideo === "object"
    )
      keepFiles.push(editLecture.LectureVideo.idFile);
    if (
      editLecture.MainMaterials &&
      typeof editLecture.MainMaterials === "object"
    )
      keepFiles.push(editLecture.MainMaterials.idFile);
    if (editLecture.SupportMaterials?.length > 0) {
      editLecture.SupportMaterials.forEach((item) => {
        if (typeof item === "object" && !(item instanceof File)) {
          keepFiles.push(item.idFile);
        }
      });
    }
    const updated = { ...editLecture, IdFileNotDelete: keepFiles };
    setEditLecture(updated);

    setIsEditLecture(true);
  };

  useEffect(() => {
    // Get all textareas with the class "auto-expand"
    const textareaElements = document.querySelectorAll(".comment-entering");

    // Add the input event listener to each textarea
    textareaElements.forEach((textarea) => {
      const adjustHeight = () => {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = textarea.scrollHeight + "px"; // Adjust to scroll height
      };

      textarea.addEventListener("input", adjustHeight);

      // Cleanup function
      return () => textarea.removeEventListener("input", adjustHeight);
    });
  }, []);

  useEffect(() => {
    setGeneralComment({
      idLecture: idLecture,
      idSender: Number(localStorage.getItem("idUser")),
      idReceiver: idRole === Role.student ? idTeacher : null,
      idCommentRef: null,
      content: "",
    });
  }, [idLecture, idTeacher]);

  useEffect(() => {
    setUpdatedCommentList(updatedComments);
  }, [updatedComments]);

  useEffect(() => {
    const longContentFlags = {};

    // Check if each comment is long
    mainCommentList.forEach((comment, index) => {
      const currentDiv = commentRefs.current[comment.idComment];
      if (currentDiv) {
        const contentHeight = currentDiv.scrollHeight;
        const containerHeight = currentDiv.clientHeight;
        longContentFlags[comment.idComment] = contentHeight > containerHeight;
      }
    });

    Object.keys(replyCommentList).forEach((idCommentRef) => {
      replyCommentList[idCommentRef].forEach((reply) => {
        const currentDiv = commentRefs.current[reply.idComment];
        if (currentDiv) {
          const contentHeight = currentDiv.scrollHeight;
          const containerHeight = currentDiv.clientHeight;
          longContentFlags[reply.idComment] = contentHeight > containerHeight;
        }
      });
    });

    setIsLongContent(longContentFlags);
  }, [mainCommentList, replyCommentList]);

  useEffect(() => {
    if (idRole !== Role.student) {
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
    }
  }, []);

  const handleNavigateDetailStudent = (idUserComment) => {
    if (idUser === idUserComment) {
      navigate("/pi");
    } else if (idUserComment === idTeacher) {
      navigate("/teacherDetail", {
        state: {
          idTeacher: idUserComment,
          idRole: idRole,
          idUser: idUser,
        },
      });
    } else if (idRole === Role.teacher) {
      navigate("/studentdetail", {
        state: {
          idStudent: idUserComment,
          idCourse: lectureDetail.idCourse,
          courseTitle: lectureDetail.courseTitle,
        },
      });
    } else {
      navigate("/studentdetail", {
        state: {
          idStudent: idUserComment,
        },
      });
    }
  };

  const videoRef = useRef(null);

  useEffect(() => {
    if (idRole === Role.student) {
      if (isFinishedLecture) return;
      else if (!lectureDetail?.videoMaterial?.path) {
        const timer = setTimeout(() => {
          setIsFinishedLecture(true);
          console.log("User has watched for 2 minutes (no video).");
        }, 1 * 60 * 1000); // 2 minutes in milliseconds

        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
      }
    } else return;
  }, [lectureDetail.videoMaterial, isFinishedLecture]);

  const handleTimeUpdate = () => {
    if (idRole === Role.student) {
      if (isFinishedLecture) return;

      const video = videoRef.current;
      if (video) {
        const halfwayPoint = video.duration / 2;

        // Check if the user has watched at least half
        if (video.currentTime >= halfwayPoint && !isFinishedLecture) {
          setIsFinishedLecture(true);
          console.log("User has watched at least half of the video.");
        }
      }
    }
  };

  return (
    <>
      <div
        ref={optionBoxRef}
        className={`option-box ${isOpenOption ? "active" : ""}`}
      >
        {idRole === Role.teacher && (
          <button
            onClick={() => {
              if (isEdit) setDefaultToEditLecture();
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
        )}
        <button
          onClick={() => {
            setIsRemoved(true);
          }}
        >
          <LuTrash2 />
          Remove Lecture
        </button>
      </div>

      {isEdit && (
        <>
          <div className="lecture-header">
            <div className="lecture-head-info edit-view slide-to-bottom">
              <span className="lecture-title">Edit Lecture</span>
            </div>
            {isMissing !== 0 && (
              <span className="error-inform">
                <LuAlertTriangle /> {errorList[isMissing]}
              </span>
            )}

            <div className="option-container">
              <button
                className="changes-button discard slide-to-bottom"
                onClick={() => setDefaultToEditLecture()}
              >
                Discard changes
              </button>
              <button
                className="changes-button save slide-to-bottom"
                onClick={() => {
                  setIsMissing(0);
                  handleSaveData(editLecture);
                }}
              >
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
        </>
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
                value={editLecture.Title}
                placeholder={editLecture.Title}
                onChange={(e) => {
                  setIsMissing(0);
                  setEditLecture({ ...editLecture, Title: e.target.value });
                }}
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
        {!isEdit && idRole !== Role.student && (
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
                  <button
                    className="remove-btn"
                    disabled={
                      !lectureDetail.videoMaterial || !editLecture.LectureVideo
                    }
                    onClick={() => {
                      setEditLecture({ ...editLecture, LectureVideo: "" });
                      if (videoInputRef.current) {
                        videoInputRef.current.value = ""; // Reset the file input value
                      }
                    }}
                  >
                    <LuTrash2 /> Remove
                  </button>
                  <button
                    className="upload-btn"
                    onClick={() => videoInputRef.current.click()}
                  >
                    <LuUpload /> Upload video
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={videoInputRef}
                style={{ display: "none" }}
                accept="video/mp4, video/webm, video/ogg"
                onChange={(event) => {
                  setIsMissing(0);
                  const file = event.target.files[0]; // Get the selected file
                  if (file) {
                    setEditLecture({ ...editLecture, LectureVideo: file });
                  }
                }}
              />
            </>
          )}
          {(!isEdit && lectureDetail?.videoMaterial) ||
          (isEdit &&
            (editLecture?.LectureVideo ||
              editLecture?.LectureVideo instanceof File)) ? (
            <video
              ref={videoRef}
              className="video-player"
              onTimeUpdate={handleTimeUpdate}
              controls
              key={
                editLecture.LectureVideo instanceof File
                  ? editLecture?.LectureVideo.name
                  : "invalid-video"
              }
            >
              {(!isEdit && lectureDetail?.videoMaterial?.path) ||
              (isEdit &&
                (editLecture?.LectureVideo?.path ||
                  editLecture?.LectureVideo instanceof File)) ? (
                <source
                  src={
                    isEdit
                      ? editLecture?.LectureVideo?.path
                        ? editLecture?.LectureVideo?.path
                        : URL.createObjectURL(editLecture.LectureVideo)
                      : lectureDetail?.videoMaterial?.path
                  }
                  type={getVideoType(
                    isEdit
                      ? editLecture?.LectureVideo?.path
                        ? editLecture?.LectureVideo?.path
                        : editLecture.LectureVideo.name
                      : lectureDetail?.videoMaterial?.path
                  )}
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

      {((!isEdit && lectureDetail.mainMaterials?.length > 0) || isEdit) && (
        <div className="main-material slide-to-right slide-to-bottom">
          <span className="title">Main Material</span>
          {isEdit && (
            <>
              <button
                className="attach-file-button"
                onClick={() => fileInputRef.current.click()}
              >
                <LuPaperclip /> Attach file
              </button>
              <input
                className="file-container"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(event) => {
                  setIsMissing(0);
                  const file = event.target.files[0]; // Get the selected file
                  if (file) {
                    setEditLecture({ ...editLecture, MainMaterials: file });
                  }
                }}
              />
            </>
          )}
          <div className="material-content">
            {isEdit &&
            (editLecture.MainMaterials ||
              editLecture.MainMaterials instanceof File) ? (
              <>
                <div
                  onClick={() =>
                    window.open(
                      editLecture?.MainMaterials.path ||
                        URL.createObjectURL(editLecture.MainMaterials)
                    )
                  }
                  className="content-file"
                >
                  <span>
                    {editLecture?.MainMaterials.fileName ||
                      editLecture.MainMaterials.name}
                  </span>
                </div>
                <button
                  className="file-buttons"
                  onClick={() =>
                    setEditLecture({ ...editLecture, MainMaterials: "" })
                  }
                >
                  <LuTrash2 />
                </button>
              </>
            ) : (
              !isEdit && (
                <div
                  onClick={() =>
                    window.open(lectureDetail?.mainMaterials[0]?.path)
                  }
                  className="content-file"
                >
                  <span>{lectureDetail?.mainMaterials[0]?.fileName}</span>
                </div>
              )
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
                  <textarea
                    placeholder="Tell a little thing about this lecture..."
                    value={editLecture.Introduction}
                    onChange={(e) => {
                      setEditLecture({
                        ...editLecture,
                        Introduction: e.target.value,
                      });
                      // setIsMissing(0);
                    }}
                  ></textarea>
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
                    onClick={() => listFileInputRef.current.click()}
                  >
                    <LuPaperclip /> Attach file
                  </button>
                  <input
                    className="file-container"
                    ref={listFileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    onChange={(event) => {
                      const files = event.target.files; // Get the selected files
                      if (files && files.length > 0) {
                        const filesArray = Array.from(files);

                        setEditLecture((prevState) => ({
                          ...prevState,
                          SupportMaterials: [
                            ...(prevState.SupportMaterials || []),
                            ...filesArray,
                          ],
                        }));
                      }
                    }}
                  />
                </div>
              ) : null}
              <div className="part-item">
                {(lectureDetail.supportMaterials?.length > 0 ||
                  editLecture.SupportMaterials?.length > 0 ||
                  isEdit) && (
                  <span className="intro-content">
                    {isEdit && editLecture.SupportMaterials?.length > 0 ? (
                      <>
                        {editLecture.SupportMaterials.map((material, index) => (
                          <>
                            <div
                              key={index}
                              className="content-file"
                              onClick={() => {
                                material.path
                                  ? window.open(material.path)
                                  : window.open(
                                      URL.createObjectURL(material),
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                              }}
                            >
                              <span>{material.fileName || material.name}</span>
                              <button
                                className="file-buttons"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(index);
                                }}
                              >
                                <LuTrash2 />
                              </button>
                            </div>
                          </>
                        ))}
                      </>
                    ) : (
                      !isEdit &&
                      lectureDetail.supportMaterials?.length > 0 && (
                        <>
                          {lectureDetail.supportMaterials.map(
                            (material, index) => (
                              <>
                                <div
                                  key={index}
                                  className="content-file"
                                  onClick={() => window.open(material.path)}
                                >
                                  <span>{material.fileName}</span>
                                </div>
                              </>
                            )
                          )}
                        </>
                      )
                    )}
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
                      <div
                        key={`${exercise.idAssignment}-${index}`}
                        className="part-item exercise"
                      >
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
                              {exercise.assignmentType ? (
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
                              ) : null}
                              {exercise.duration ? (
                                <span>
                                  <LuClock color="#003B57" />
                                  &nbsp;
                                  {`${exercise.duration} ${
                                    exercise.duration > 1 ? "mins" : "min"
                                  }`}
                                </span>
                              ) : null}
                              {exercise.questionQuantity ? (
                                <span>
                                  <LuFileQuestion color="#003B57" />
                                  &nbsp;
                                  {`${exercise.questionQuantity} ${
                                    exercise.questionQuantity > 1
                                      ? "questions"
                                      : "question"
                                  }`}
                                </span>
                              ) : null}
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
                                      : "unpublish"
                                  }`}
                                >
                                  {`${
                                    exercise.isPublish
                                      ? "Published"
                                      : "Unpublish"
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
              {(idRole === Role.teacher || idRole === Role.student) && (
                <div className="part-item">
                  <div
                    className="comment-display"
                    style={{ marginBottom: "0" }}
                  >
                    <div
                      className="ava-holder"
                      onClick={() => handleNavigateDetailStudent(idUser)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={avaImg || default_ava} />
                    </div>
                    <div className="comment-content" style={{ width: "100%" }}>
                      <textarea
                        placeholder="Write your comment..."
                        className="comment-entering"
                        value={generalComment.content}
                        onChange={(e) => {
                          setGeneralComment({
                            ...generalComment,
                            content: e.target.value,
                          });
                        }}
                        rows="1"
                      ></textarea>
                      {generalComment.content && (
                        <div className="button-container">
                          <button
                            className="cancel"
                            onClick={() => {
                              setGeneralComment({
                                ...generalComment,
                                content: "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="comment"
                            onClick={() => {
                              setGeneralComment({
                                ...generalComment,
                                content: "",
                              });
                              handleAddComment(generalComment);
                            }}
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {mainCommentList?.length > 0 &&
                mainCommentList.map((comment, index) => (
                  <div key={index} className="part-item comment">
                    <div
                      onMouseEnter={() => handleMouseEnter(comment.idComment)}
                      onMouseLeave={() => handleMouseLeaver(comment.idComment)}
                      className="comment-display"
                      style={{
                        marginBottom:
                          replyCommentList[comment.idComment]?.length > 0
                            ? "0.5rem"
                            : "1rem",
                      }}
                    >
                      <div
                        className="ava-holder"
                        onClick={() =>
                          handleNavigateDetailStudent(comment.idUser)
                        }
                        style={{
                          cursor:
                            idRole !== Role.student ||
                            (idRole === Role.student &&
                              comment.idUser === idTeacher)
                              ? "pointer"
                              : "default",
                        }}
                      >
                        <img src={comment.avatarPath || default_ava} />
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span
                            className="commentator-name"
                            onClick={() =>
                              handleNavigateDetailStudent(comment.idUser)
                            }
                            style={{
                              cursor:
                                idRole !== Role.student ||
                                (idRole === Role.student &&
                                  comment.idUser === idTeacher)
                                  ? "pointer"
                                  : "default",
                            }}
                          >
                            {comment.fullName}
                          </span>
                          <span className="comment-time">
                            {comment.relativeTime}
                          </span>
                        </div>
                        <div
                          ref={(el) =>
                            (commentRefs.current[comment.idComment] = el)
                          }
                          className={`comment-body ${
                            isExpanded[comment.idComment] ? "expanded" : ""
                          }`}
                        >
                          <span>{comment.content}</span>
                          <div
                            className={`blur-bottom ${
                              isLongContent[comment.idComment] &&
                              !isExpanded[comment.idComment]
                                ? "show"
                                : ""
                            }`}
                          ></div>
                        </div>
                        {isLongContent[comment.idComment] && (
                          <div className="view-more-container">
                            <button
                              className="view-more-comment"
                              onClick={() => {
                                setIsExpanded({
                                  ...isExpanded,
                                  [comment.idComment]:
                                    !isExpanded[comment.idComment],
                                });
                              }}
                            >
                              {isExpanded[comment.idComment] ? (
                                <>
                                  View Less <IoIosArrowUp />
                                </>
                              ) : (
                                <>
                                  View More <IoIosArrowDown />
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      {(idRole === Role.teacher || idRole === Role.student) && (
                        <button
                          className={`action-button ${
                            isHovered[comment.idComment] ? "active" : ""
                          }`}
                          onClick={() => {
                            setIsReplied({
                              ...isReplied,
                              [comment.idComment]: true,
                            });
                            setReplyComment({
                              ...replyComment,
                              [comment.idComment]: {
                                idLecture: lectureDetail.idLecture,
                                idSender: +localStorage.getItem("idUser"),
                                idReceiver:
                                  comment.idUser === idUser
                                    ? null
                                    : comment.idUser,
                                idCommentRef: comment.idComment,
                                content: "",
                              },
                            });
                          }}
                        >
                          <BsReplyFill color="#397979" />
                        </button>
                      )}
                      {comment.idUser === idUser ||
                      idRole === Role.centerAdmin ||
                      idRole === Role.platformAdmin ? (
                        <button
                          className={`action-button ${
                            isHovered[comment.idComment] ? "active" : ""
                          }`}
                          style={{ fontSize: ".9rem", marginLeft: "2px" }}
                          onClick={() => {
                            setIsRemoved(true);
                            setIdComment(comment.idComment);
                          }}
                        >
                          <BsTrash3Fill color="#c00f0c" />
                        </button>
                      ) : null}
                    </div>
                    <div className="comment-responses-container">
                      {replyCommentList[comment.idComment]?.length > 0 && (
                        <>
                          <div className="more-responses">
                            <button
                              onClick={() =>
                                setShowReply({
                                  ...showReply,
                                  [comment.idComment]:
                                    !showReply[comment.idComment],
                                })
                              }
                            >
                              {showReply[comment.idComment] ? (
                                <>
                                  <IoIosArrowUp />
                                </>
                              ) : (
                                <>
                                  <IoIosArrowDown />
                                </>
                              )}{" "}
                              {`${replyCommentList[comment.idComment].length} ${
                                replyCommentList[comment.idComment].length > 1
                                  ? "replies"
                                  : "reply"
                              }`}
                            </button>
                          </div>
                          {replyCommentList[comment.idComment].map(
                            (reply, index) => (
                              <div
                                onMouseEnter={() =>
                                  handleMouseEnter(reply.idComment)
                                }
                                onMouseLeave={() =>
                                  handleMouseLeaver(reply.idComment)
                                }
                                key={index}
                                className={`comment-response ${
                                  showReply[comment.idComment] ? "active" : ""
                                }`}
                              >
                                <div
                                  className="ava-holder"
                                  onClick={() =>
                                    handleNavigateDetailStudent(reply.idUser)
                                  }
                                  style={{
                                    cursor:
                                      idRole !== Role.student ||
                                      (idRole === Role.student &&
                                        reply.idUser === idTeacher)
                                        ? "pointer"
                                        : "default",
                                  }}
                                >
                                  <img src={reply.avatarPath || default_ava} />
                                </div>
                                <div className="comment-content">
                                  <div className="comment-header">
                                    <span
                                      className="commentator-name"
                                      onClick={() =>
                                        handleNavigateDetailStudent(
                                          reply.idUser
                                        )
                                      }
                                      style={{
                                        cursor:
                                          idRole !== Role.student ||
                                          (idRole === Role.student &&
                                            reply.idUser === idTeacher)
                                            ? "pointer"
                                            : "default",
                                      }}
                                    >
                                      {reply.fullName}
                                    </span>
                                    <span className="comment-time">
                                      {reply.relativeTime}
                                    </span>
                                  </div>
                                  <div
                                    ref={(el) =>
                                      (commentRefs.current[reply.idComment] =
                                        el)
                                    }
                                    className={`comment-body ${
                                      isExpanded[reply.idComment]
                                        ? "expanded"
                                        : ""
                                    }`}
                                  >
                                    <span>
                                      <b>
                                        {reply.commentRefName
                                          ? `@${reply.commentRefName}`
                                          : ""}
                                      </b>
                                      &nbsp;
                                      {reply.content}
                                    </span>
                                    <div
                                      className={`blur-bottom ${
                                        isLongContent[reply.idComment] &&
                                        !isExpanded[reply.idComment]
                                          ? "show"
                                          : ""
                                      }`}
                                    ></div>
                                  </div>
                                  {isLongContent[reply.idComment] && (
                                    <div className="view-more-container">
                                      <button
                                        className="view-more-comment"
                                        onClick={() => {
                                          setIsExpanded({
                                            ...isExpanded,
                                            [reply.idComment]:
                                              !isExpanded[reply.idComment],
                                          });
                                          // setIsLongContent(!isLongContent);
                                        }}
                                      >
                                        {isExpanded[reply.idComment] ? (
                                          <>
                                            View Less <IoIosArrowUp />
                                          </>
                                        ) : (
                                          <>
                                            View More <IoIosArrowDown />
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {(idRole === Role.teacher ||
                                  idRole === Role.student) && (
                                  <button
                                    className={`action-button ${
                                      isHovered[reply.idComment] ? "active" : ""
                                    }`}
                                    onClick={() => {
                                      setIsReplied({
                                        ...isReplied,
                                        [comment.idComment]: true,
                                      });
                                      setReplyComment({
                                        ...replyComment,
                                        [comment.idComment]: {
                                          idLecture: lectureDetail.idLecture,
                                          idSender:
                                            +localStorage.getItem("idUser"),
                                          idReceiver:
                                            reply.idUser === idUser
                                              ? null
                                              : reply.idUser,
                                          idCommentRef: reply.idComment,
                                          content: "",
                                          nameRep:
                                            reply.idUser === idUser
                                              ? "Yourself"
                                              : reply.fullName,
                                        },
                                      });
                                    }}
                                  >
                                    <BsReplyFill color="#397979" />
                                  </button>
                                )}
                                {reply.idUser === idUser ||
                                idRole === Role.centerAdmin ||
                                idRole === Role.platformAdmin ? (
                                  <button
                                    className={`action-button ${
                                      isHovered[reply.idComment] ? "active" : ""
                                    }`}
                                    style={{
                                      fontSize: ".9rem",
                                      marginLeft: "2px",
                                    }}
                                    onClick={() => {
                                      setIsRemoved(true);
                                      setIdComment(comment.idComment);
                                    }}
                                  >
                                    <BsTrash3Fill color="#c00f0c" />
                                  </button>
                                ) : null}
                              </div>
                            )
                          )}
                        </>
                      )}
                      <div
                        className={`comment-response ${
                          isReplied[comment.idComment] ? "active" : ""
                        }`}
                        style={{
                          marginTop: replyComment[comment.idComment]?.nameRep
                            ? "10px"
                            : "0",
                        }}
                      >
                        <div className="ava-holder">
                          <img src={avaImg || default_ava} />
                        </div>
                        <div
                          className="comment-content"
                          style={{ width: "100%" }}
                        >
                          {replyComment[comment.idComment]?.nameRep && (
                            <span className="reply-to">
                              <BsReplyFill />
                              &nbsp;Replying to&nbsp;
                              <b>@{replyComment[comment.idComment]?.nameRep}</b>
                            </span>
                          )}

                          <textarea
                            ref={(el) =>
                              (textAreaRefs.current[comment.idComment] = el)
                            }
                            placeholder="Write your comment..."
                            className="comment-entering"
                            value={replyComment[comment.idComment]?.content}
                            onChange={(e) => {
                              setReplyComment({
                                ...replyComment,
                                [comment.idComment]: {
                                  ...replyComment[comment.idComment],
                                  content: e.target.value,
                                },
                              });
                            }}
                            rows="1"
                          ></textarea>
                          <div className="button-container">
                            <button
                              className="cancel"
                              onClick={() => {
                                setIsReplied({
                                  ...isReplied,
                                  [comment.idComment]: false,
                                });
                                delete replyComment[comment.idComment];
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="comment"
                              onClick={() => {
                                handleAddComment(
                                  replyComment[comment.idComment]
                                );
                                setReplyComment({
                                  ...replyComment,
                                  [comment.idComment]: {
                                    ...replyComment[comment.idComment],
                                    content: "",
                                  },
                                });
                              }}
                              disabled={
                                !replyComment[comment.idComment]?.content
                              }
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LectureView;
