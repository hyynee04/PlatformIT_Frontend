import { useEffect, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuAlertCircle, LuPaperclip, LuTrash2, LuUpload } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/LectureAdd.css";
import default_image from "../../assets/img/default_image.png";
import DiagCreateSuccessfully from "../../components/diag/DiagCreateSuccessfully";
import { APIStatus } from "../../constants/constants";
import { postAddLecture } from "../../services/courseService";

const AddNewLecture = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [sectionName, setSectionName] = useState(null);
    const [courseTitle, setCourseTitle] = useState(null);
    const [isMissing, setIsMissing] = useState(0);
    const [isSucceeded, setIsSucceeded] = useState(false);
    const [errorList, setErrorList] = useState({
        0: "",
        1: "Missing section name!",
        2: "Missing Lecture Video or Material!",
        3: "",
    })
    const [idList, setIdList] = useState({
        idCourse: 0,
        idSection: 0,
        idCreatedBy: 0
    })

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const listFileInputRef = useRef(null);

    const [lectureData, setLectureData] = useState({
        Title: "",
        Introduction: "",
        LectureVideo: "",
        MainMaterials: "",
        SupportMaterials: [],
    })
    const handleDelete = (index) => {
        // Implement your deletion logic here
        const updatedFiles = lectureData.SupportMaterials.filter((_, i) => i !== index);
        setLectureData({ ...lectureData, SupportMaterials: updatedFiles });
    };

    const getVideoType = (fileName) => {
        // Check if the file name ends with a specific extension
        if (fileName.endsWith('.mp4')) {
            return 'video/mp4';
        } else if (fileName.endsWith('.webm')) {
            return 'video/webm';
        } else if (fileName.endsWith('.ogg')) {
            return 'video/ogg';
        } else {
            return ''; // If the type is not recognized
        }
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
        setLoading(true)
        try {
            let response = await postAddLecture(idList, lectureData)
            if (response.status === APIStatus.success) {
                setIsSucceeded(true);
            }
            else {
                setIsMissing(3);
                setErrorList({ ...errorList, 3: response.data });
            }
        } catch (error) {
            console.error("Error posting data:", error);
        } finally {
            setLoading(false);
        }
    }
    const clearData = () => {
        setLectureData({
            Title: "",
            Introduction: "",
            LectureVideo: "",
            MainMaterials: "",
            SupportMaterials: [],
        });
    }
    useEffect(() => {
        const state = location.state;
        if (state) {
            setSectionName(state.sectionName);
            setCourseTitle(state.courseTitle);
            setIdList({
                idCourse: state.idCourse,
                idSection: state.idSection,
                idCreatedBy: state.idCreatedBy,
            });
        }
    }, [location.state])

    return (
        <div className="add-lecture-container">
            <div className="page-header">
                <div className="back-to-course">
                    <button
                        onClick={() => navigate(-1)}
                    ><IoIosArrowBack /></button>
                </div>
                <div className="page-title">
                    <span className="title">Add new Lecture</span>
                    <span className="lecture-place">{courseTitle} <IoIosArrowForward /> {sectionName}</span>
                </div>
                <div className="create-lecture">
                    <button
                        disabled={isMissing}
                        onClick={() => {
                            setIsMissing(0);
                            createNewLecture(idList, lectureData);
                        }}
                    >
                        {loading && (<ImSpinner2 className="icon-spin" />)} Create
                    </button>
                </div>
            </div>
            <div className="page-body">
                <div className="body-item lecture-information">
                    <div className="body-header">
                        <span className="main-title">Information</span>
                    </div>

                    <div className="body-content">
                        <div className="sub-content">
                            <label className="sub-title">Lecture name <span>*</span></label>
                            <input
                                type="text"
                                value={lectureData.Title}
                                placeholder="I need a name..."
                                onChange={(event) => {
                                    setLectureData({ ...lectureData, Title: event.target.value });
                                    setIsMissing(0);
                                }}
                            />
                            {isMissing === 1 && (
                                <span className="error-inform">{typeof errorList[isMissing] === 'string' ? errorList[isMissing] : errorList[isMissing]?.message || "Unknown error"}</span>
                            )}
                        </div>
                        <div className="sub-content">
                            <label className="sub-title">Introduction &#40;Optional&#41;</label>
                            <textarea
                                placeholder="Tell a little thing about this lecture..."
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="body-item lecture-content">
                    <div className="body-header">
                        <span className="main-title">Content</span>
                        {(isMissing === 2 || isMissing === 3) && (
                            <span className="error-inform">
                                <LuAlertCircle /> {typeof errorList[isMissing] === 'string' ? errorList[isMissing] : errorList[isMissing]?.message || "Unknown error"}
                            </span>
                        )}
                    </div>
                    <div className="body-content">
                        <div className="sub-content">
                            <label className="sub-title">Lecture video</label>
                            <div className={`video-container ${lectureData.LectureVideo ? "" : "no-video"}`}>
                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    style={{ display: "none" }}
                                    onChange={(event) => {
                                        setIsMissing(0);
                                        const file = event.target.files[0]; // Get the selected file
                                        if (file) {
                                            setLectureData({ ...lectureData, LectureVideo: file });
                                        }
                                    }}
                                />
                                {lectureData.LectureVideo ? (
                                    <video className="video-player" controls>
                                        {lectureData.LectureVideo instanceof File ? (
                                            <source
                                                src={URL.createObjectURL(lectureData.LectureVideo)}
                                                type={getVideoType(lectureData.LectureVideo.name)}
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
                                    <LuUpload /> Upload video
                                </button>
                            </div>
                        </div>
                        <div className="sub-content">
                            <label className="sub-title">Main Material</label>
                            {!lectureData.MainMaterials && (
                                <button
                                    className="attach-file-button"
                                    onClick={() => fileInputRef.current.click()}
                                ><LuPaperclip /> Attach file</button>
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
                                        setLectureData({ ...lectureData, MainMaterials: file })
                                    }
                                }}
                            />
                            {lectureData.MainMaterials && (
                                <div className="file-display">
                                    <div
                                        className="file-block"
                                        onClick={() => window.open(URL.createObjectURL(lectureData.MainMaterials), "_blank", "noopener,noreferrer")}
                                    >
                                        <span>{lectureData.MainMaterials.name}</span>
                                    </div>
                                    <div className="file-buttons">
                                        <button
                                            onClick={() => {
                                                setLectureData({ ...lectureData, LectureVideo: "" });
                                                if (videoInputRef.current) {
                                                    videoInputRef.current.value = ""; // Reset the file input value
                                                }
                                            }}
                                        ><LuTrash2 /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="sub-content">
                            <label className="sub-title">Supporting Materials &#40;Optional&#41;</label>
                            <button
                                className="attach-file-button"
                                onClick={() => listFileInputRef.current.click()}
                            ><LuPaperclip /> Attach file</button>
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
                                        setLectureData({ ...lectureData, SupportMaterials: [...lectureData.SupportMaterials, ...filesArray] })
                                    }
                                }}
                            />
                            {lectureData.SupportMaterials.length > 0 && lectureData.SupportMaterials.map((file, index) => (
                                <div key={index} className="file-display">
                                    <div className="file-block">
                                        <span>{file.name}</span>
                                    </div>
                                    <div className="file-buttons">
                                        <button onClick={() => handleDelete(index)}><LuTrash2 /></button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </div>
            <DiagCreateSuccessfully
                isOpen={isSucceeded}
                onClose={() => setIsSucceeded(false)}
                notification={"Create new lecture successfully!"}
                clearData={clearData}
            />
        </div>
    )
}

export default AddNewLecture;