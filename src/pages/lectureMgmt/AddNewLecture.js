import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuAlertCircle, LuPaperclip, LuTrash2, LuUpload } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/LectureAdd.css";
import default_image from "../../assets/img/default_image.png";
import DiagCreateSuccessfully from "../../components/diag/DiagCreateSuccessfully";
import { APIStatus, LectureStatus, Role } from "../../constants/constants";
import { getVideoType } from "../../functions/function";
import { getLectureDetail, postAddLecture } from "../../services/courseService";
import { GoAlertFill } from "react-icons/go";
import DiagDeleteConfirmation from "../../components/diag/DiagDeleteConfirmation";
import { TbNumber3Small } from "react-icons/tb";
import DiagUpdateConfirmation from "../../components/diag/DiagUpdateConfirmation";

const AddNewLecture = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const idUser = +localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");

  const [loading, setLoading] = useState(false);
  const [loadingDisplay, setLoadingDisplay] = useState(false);
  const [sectionName, setSectionName] = useState(null);
  const [courseTitle, setCourseTitle] = useState(null);
  const [lectureStatus, setLectureStatus] = useState(null);
  const [isMissing, setIsMissing] = useState(0);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errorList, setErrorList] = useState({
    0: "",
    1: "Missing section name!",
    2: "Missing Lecture Video or Material!",
    3: "",
  });
  const [idList, setIdList] = useState({
    idCourse: 0,
    idSection: 0,
    idLecture: 0,
    idCreatedBy: 0,
  });

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const listFileInputRef = useRef(null);

  const [lectureData, setLectureData] = useState({
    Title: "",
    Introduction: "",
    LectureVideo: "",
    MainMaterials: "",
    SupportMaterials: [],
  });
  const handleDelete = (index) => {
    // Implement your deletion logic here
    const updatedFiles = lectureData.SupportMaterials.filter(
      (_, i) => i !== index
    );
    setLectureData({ ...lectureData, SupportMaterials: updatedFiles });
  };

  const createNewLecture = async (idList, lectureData) => {
    if (!lectureData.Title) {
      setIsMissing(1);
      return;
    }
    if (!lectureData.LectureVideo && !lectureData.MainMaterials) {
      setIsMissing(2);
      return;
    }
    setLoading(true);
    try {
      let response = await postAddLecture(idList, lectureData);
      if (response.status === APIStatus.success) {
        setIsSucceeded(true);
      } else {
        setIsMissing(3);
        setErrorList({ ...errorList, 3: response.data });
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLecture = (lectureData) => {
    let keepFiles = [];
    if (!lectureData.Title) {
      setIsMissing(1);
      return;
    }
    if (!lectureData.LectureVideo && !lectureData.MainMaterials) {
      setIsMissing(2);
      return;
    }
    if (
      lectureData.LectureVideo &&
      typeof lectureData.LectureVideo === "object"
    )
      keepFiles.push(lectureData.LectureVideo.idFile);
    if (
      lectureData.MainMaterials &&
      typeof lectureData.MainMaterials === "object"
    )
      keepFiles.push(lectureData.MainMaterials.idFile);
    if (lectureData.SupportMaterials?.length > 0) {
      lectureData.SupportMaterials.forEach((item) => {
        if (typeof item === "object" && !(item instanceof File)) {
          keepFiles.push(item.idFile);
        }
      });
    }
    const updatedLectureData = { ...lectureData, IdFileNotDelete: keepFiles };
    setLectureData(updatedLectureData);

    setIsEdit(true);
  };
  const clearData = () => {
    setLectureData({
      Title: "",
      Introduction: "",
      LectureVideo: "",
      MainMaterials: "",
      SupportMaterials: [],
    });
  };

  const fetchLectureDetail = async (idLecture) => {
    setLoadingDisplay(true);
    try {
      const response = await getLectureDetail(idLecture);
      if (response.status === APIStatus.success) {
        setIdList({
          idCourse: response.data.idCourse,
          idSection: response.data.idSection,
          idLecture: response.data.idLecture,
          idCreatedBy: idUser,
        });
        setLectureData({
          Title: response.data.lectureTitle,
          Introduction: response.data.lectureIntroduction,
          LectureVideo: response.data.videoMaterial,
          MainMaterials:
            response.data.mainMaterials?.length > 0
              ? response.data.mainMaterials[0]
              : null,
          SupportMaterials: response.data.supportMaterials,
        });
        setCourseTitle(response.data.courseTitle);
      } else console.error("Message: ", response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoadingDisplay(false);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const state = location.state;
    if (state) {
      if (state.idLecture && state.lectureStatus) {
        fetchLectureDetail(state.idLecture);
        setLectureStatus(state.lectureStatus);
      } else {
        setIdList({
          idCourse: state.idCourse,
          idSection: state.idSection,
          idCreatedBy: idUser,
        });
        setCourseTitle(state.courseTitle);
      }
      setSectionName(state.sectionName);
    }
  }, [location.state]);

  useEffect(() => {
    document.querySelectorAll("button").forEach((button) => {
      button.disabled = loading;
    });
  }, [loading]);

  if (loadingDisplay) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="add-lecture-container">
      <div
        className={`page-header ${
          lectureStatus && lectureStatus !== LectureStatus.active
            ? "another-status"
            : ""
        }`}
      >
        <div className="back-to-course">
          <button onClick={() => navigate(-1)}>
            <IoIosArrowBack />
          </button>
        </div>
        <div className="page-title">
          <span className="title">Add new Lecture</span>
          <span className="lecture-place">
            {courseTitle} <IoIosArrowForward /> {sectionName}
          </span>
          {lectureStatus && (
            <>
              {lectureStatus === LectureStatus.pending ? (
                <span
                  className="status-text pending-color"
                  style={{ padding: "0" }}
                >
                  <GoAlertFill /> This lecture is pending
                </span>
              ) : lectureStatus === LectureStatus.rejected ? (
                <span
                  className="status-text rejected-color"
                  style={{ padding: "0" }}
                >
                  <GoAlertFill /> This lecture is rejected
                </span>
              ) : null}
            </>
          )}
        </div>

        <div className="create-lecture">
          {lectureStatus && lectureStatus !== LectureStatus.active ? (
            <>
              <button
                className={`${
                  idRole === Role.teacher ? "delete-lecture-btn" : ""
                }`}
                onClick={() => setIsRemoved(true)}
              >
                Delete
              </button>
              {idRole === Role.teacher && (
                <button
                  disabled={isMissing}
                  onClick={() => {
                    setIsMissing(0);
                    handleUpdateLecture(lectureData);
                  }}
                >
                  {loading && <ImSpinner2 className="icon-spin" />} Update
                </button>
              )}
            </>
          ) : (
            <>
              {idRole === Role.teacher ? (
                <button
                  disabled={isMissing}
                  onClick={() => {
                    setIsMissing(0);
                    createNewLecture(idList, lectureData);
                  }}
                >
                  {loading && <ImSpinner2 className="icon-spin" />} Create
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className="page-body">
        <div className="body-item lecture-information">
          <div className="body-header">
            <span className="main-title">Information</span>
          </div>

          <div className="body-content">
            <div className="sub-content">
              <label className="sub-title">
                Lecture name <span>*</span>
              </label>
              <input
                type="text"
                value={lectureData.Title}
                placeholder="I need a name..."
                onChange={(event) => {
                  setLectureData({ ...lectureData, Title: event.target.value });
                  setIsMissing(0);
                }}
                readOnly={!(idRole === Role.teacher)}
              />
              {isMissing === 1 && (
                <span className="error-inform">
                  {typeof errorList[isMissing] === "string"
                    ? errorList[isMissing]
                    : errorList[isMissing]?.message || "Unknown error"}
                </span>
              )}
            </div>
            <div className="sub-content">
              <label className="sub-title">
                Introduction &#40;Optional&#41;
              </label>
              <textarea
                value={lectureData.Introduction}
                onChange={(e) => {
                  setLectureData({
                    ...lectureData,
                    Introduction: e.target.value,
                  });
                  setIsMissing(0);
                }}
                placeholder="Tell a little thing about this lecture..."
                readOnly={!(idRole === Role.teacher)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="body-item lecture-content">
          <div className="body-header">
            <span className="main-title">Content</span>
            {(isMissing === 2 || isMissing === 3) && (
              <span className="error-inform">
                <LuAlertCircle />{" "}
                {typeof errorList[isMissing] === "string"
                  ? errorList[isMissing]
                  : errorList[isMissing]?.message || "Unknown error"}
              </span>
            )}
          </div>
          <div className="body-content">
            <div className="sub-content">
              <label className="sub-title">Lecture video</label>
              <div
                className={`video-container ${
                  lectureData.LectureVideo ? "" : "no-video"
                }`}
              >
                <input
                  type="file"
                  ref={videoInputRef}
                  style={{ display: "none" }}
                  accept="video/mp4, video/webm, video/ogg"
                  onChange={(event) => {
                    setIsMissing(0);
                    const file = event.target.files[0]; // Get the selected file
                    if (file) {
                      setLectureData({ ...lectureData, LectureVideo: file });
                    }
                  }}
                />
                {lectureData.LectureVideo ? (
                  <video
                    className="video-player"
                    controls
                    key={
                      lectureData.LectureVideo instanceof File
                        ? lectureData.LectureVideo.name
                        : "invalid-video"
                    }
                  >
                    {lectureData.LectureVideo.path ||
                    lectureData.LectureVideo instanceof File ? (
                      <source
                        src={
                          lectureData.LectureVideo.path
                            ? lectureData.LectureVideo.path
                            : URL.createObjectURL(lectureData.LectureVideo)
                        }
                        type={getVideoType(
                          lectureData.LectureVideo.path
                            ? lectureData.LectureVideo.path
                            : lectureData.LectureVideo.name
                        )}
                      />
                    ) : (
                      <p>Error: Invalid file</p>
                    )}
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={default_image} alt="lecture video" />
                )}
              </div>
              {idRole === Role.teacher && (
                <div className="video-button-container">
                  <button
                    className="remove-btn"
                    disabled={!lectureData.LectureVideo}
                    onClick={() => {
                      setLectureData({ ...lectureData, LectureVideo: "" });
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
                    <LuUpload /> Upload Video
                  </button>
                </div>
              )}
            </div>
            <div className="sub-content">
              <label className="sub-title">Main Material</label>
              {!lectureData.MainMaterials && idRole === Role.teacher && (
                <button
                  className="attach-file-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <LuPaperclip /> Attach file
                </button>
              )}
              <input
                className="file-container"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(event) => {
                  setIsMissing(0);
                  const file = event.target.files[0]; // Get the selected file
                  if (file) {
                    setLectureData({ ...lectureData, MainMaterials: file });
                  }
                }}
              />
              {(lectureData.MainMaterials instanceof File ||
                lectureData?.MainMaterials) && (
                <div className="file-display">
                  <div
                    className="file-block"
                    onClick={() => {
                      lectureData.MainMaterials[0]
                        ? window.open(lectureData.MainMaterials[0].path)
                        : window.open(
                            URL.createObjectURL(lectureData.MainMaterials),
                            "_blank",
                            "noopener,noreferrer"
                          );
                    }}
                  >
                    <span>
                      {lectureData.MainMaterials.name ||
                        lectureData?.MainMaterials[0]?.fileName}
                    </span>
                  </div>
                  {idRole === Role.teacher && (
                    <div className="file-buttons">
                      <button
                        onClick={() => {
                          setLectureData({
                            ...lectureData,
                            MainMaterials: "",
                          });
                        }}
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="sub-content">
              <label className="sub-title">
                Supporting Materials &#40;Optional&#41;
              </label>
              {idRole === Role.teacher && (
                <button
                  className="attach-file-button"
                  onClick={() => listFileInputRef.current.click()}
                >
                  <LuPaperclip /> Attach file
                </button>
              )}

              <input
                className="file-container"
                ref={listFileInputRef}
                type="file"
                style={{ display: "none" }}
                multiple
                onChange={(event) => {
                  setIsMissing(0);
                  const files = event.target.files; // Get the selected file
                  if (files) {
                    const filesArray = Array.from(files);
                    setLectureData({
                      ...lectureData,
                      SupportMaterials: [
                        ...lectureData.SupportMaterials,
                        ...filesArray,
                      ],
                    });
                  }
                }}
              />
              {lectureData?.SupportMaterials?.length > 0 &&
                lectureData.SupportMaterials.map((file, index) => (
                  <div key={index} className="file-display">
                    <div
                      className="file-block"
                      onClick={() => {
                        file.path
                          ? window.open(file.path)
                          : window.open(
                              URL.createObjectURL(file),
                              "_blank",
                              "noopener,noreferrer"
                            );
                      }}
                    >
                      <span>{file.name || file.fileName}</span>
                    </div>
                    {idRole === Role.teacher && (
                      <div className="file-buttons">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <DiagUpdateConfirmation
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        message={"Are you sure to update these changes?"}
        idList={idList}
        editLecture={lectureData}
        lectureStatus={LectureStatus.pending}
        setLectureStatus={setLectureStatus}
        fetchData={() => fetchLectureDetail(idList.idLecture)}
      />
      <DiagCreateSuccessfully
        isOpen={isSucceeded}
        onClose={() => setIsSucceeded(false)}
        notification={"Create new lecture successfully!"}
        clearData={clearData}
      />
      <DiagDeleteConfirmation
        isOpen={isRemoved}
        onClose={() => {
          setIsRemoved(false);
        }}
        object={{
          id: idList.idLecture,
          name: "lecture",
          message: "Are you sure to delete this lecture?",
        }}
      />
    </div>
  );
};

export default AddNewLecture;
