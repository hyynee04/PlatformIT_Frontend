import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  LuCheck,
  LuCheckCircle,
  LuPenLine,
  LuPlus,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import "../../assets/css/LectureView.css";
import { APIStatus, Role } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { postAddSection, updateSection } from "../../services/courseService";
const SectionView = (props) => {
  const {
    idCourse,
    idSection,
    idLecture,
    sectionList,
    fetchSectionList,
    setIdLecture,
    setIdSection,
    courseTitle,
    setIdSectionRemoved,
    setIsRemoved,
  } = props;
  const navigate = useNavigate();
  const idRole = +localStorage.getItem("idRole");
  const idUser = +localStorage.getItem("idUser");

  const [isShowed, setIsShowed] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [isAddSection, setIsAddSection] = useState(false);

  const [editSectionName, setEditSectionName] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const addNewSection = async (sectionTitle) => {
    try {
      let response = await postAddSection(sectionTitle, idCourse, idUser);
      if (response.status === APIStatus.success) {
        await fetchSectionList();
        setNewSectionTitle("");
        setIsAddSection(false);
      } else console.log(response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const editSection = async (idSection, newSectionName, idUpdatedBy) => {
    try {
      let respone = await updateSection(idSection, newSectionName, idUpdatedBy);
      if (respone.status === APIStatus.success) {
        fetchSectionList();
      }
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  useEffect(() => {
    setIsShowed({ ...isShowed, [idSection]: true });
  }, [idSection]);
  return (
    <div className="section-view-container slide-to-bottom">
      <div className="section-header">
        <span className="header-title">Course Content</span>
        <span className="header-info">
          {`${sectionList.sectionCount} ${
            sectionList.sectionCount > 1 ? "sections" : "section"
          }`}{" "}
          -&nbsp;
          {`${sectionList.lectureCount} ${
            sectionList.lectureCount > 1 ? "lectures" : "lecture"
          }`}
        </span>
      </div>
      <div className="section-display">
        {sectionList.sectionStructures &&
          sectionList.sectionStructures.length > 0 &&
          sectionList.sectionStructures.map((section, index) => (
            <div key={index} className="each-section">
              <div
                className={`each-section-header ${
                  isShowed[section.idSection] ? "active" : ""
                }`}
                onClick={() => {
                  setIsShowed({
                    ...isShowed,
                    [section.idSection]: !isShowed[section.idSection],
                  });
                }}
              >
                {!isEdit[index] ? (
                  <>
                    <span className="each-section-name">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditSectionName(section.sectionName);
                          setIsEdit({
                            ...Object.keys(isEdit).reduce(
                              (acc, key) => ({ ...acc, [key]: false }),
                              {}
                            ),
                            [index]: true,
                          });
                        }}
                      >
                        <LuPenLine />
                      </button>
                      {section.sectionName}
                    </span>

                    <div className="each-section-info">
                      <span className="lecture-number">
                        {`${section.lectureCount} ${
                          section.lectureCount > 1 ? "lectures" : "lecture"
                        }`}
                      </span>
                      <button
                        onClick={() => {
                          setIsShowed({
                            ...isShowed,
                            [section.idSection]: !isShowed[section.idSection],
                          });
                        }}
                        className="dropdown-button"
                      >
                        {isShowed[section.idSection] ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="edit-section-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={editSectionName}
                      placeholder={section.sectionName}
                      onChange={(e) => {
                        setEditSectionName(e.target.value);
                      }}
                    />
                    <div className="edit-section-buttons">
                      <button
                        onClick={async () => {
                          await editSection(
                            section.idSection,
                            editSectionName,
                            idUser
                          );
                          setIsEdit({ ...isEdit, [index]: false });
                          setEditSectionName("");
                        }}
                      >
                        <LuCheck />
                      </button>
                      <button
                        onClick={() => {
                          setIsEdit({ ...isEdit, [index]: false });
                          setEditSectionName("");
                        }}
                      >
                        <LuX />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {section.lectureStructures &&
                section.lectureStructures.length > 0 &&
                section.lectureStructures.map((lecture) => (
                  <div
                    key={lecture.idLecture}
                    className={`section-lectures ${
                      isShowed[section.idSection] ? "" : "deactive"
                    }`}
                  >
                    <div
                      className="lecture-item"
                      onClick={() => setIdLecture(lecture.idLecture)}
                    >
                      <div className="lecture-info not-learn">
                        <span
                          className={`lecture-title ${
                            idLecture === lecture.idLecture ? "active" : ""
                          }`}
                        >
                          {lecture.lectureTitle}
                        </span>
                        <span className="exercise-num">
                          {`${lecture.exerciseCount} ${
                            lecture.exerciseCount > 1 ? "exercises" : "exercise"
                          }`}
                        </span>
                      </div>
                      {idRole === Role.student && lecture.isFinishedLecture && (
                        <LuCheckCircle />
                      )}
                    </div>
                  </div>
                ))}
              {idRole && idRole !== Role.student && (
                <div
                  className={`section-lectures ${
                    isShowed[section.idSection] ? "" : "deactive"
                  }`}
                >
                  <div className="lecture-item contain-button nohover">
                    <div className="option-container">
                      {idRole === Role.teacher && (
                        <button
                          className="add-lecture"
                          onClick={() =>
                            navigate("/addNewLecture", {
                              state: {
                                idCourse: idCourse,
                                idSection: idSection,
                                idCreatedBy: idUser,
                                courseTitle: courseTitle,
                                sectionName: section.sectionName,
                              },
                            })
                          }
                        >
                          <span className="icon">
                            <LuPlus />
                          </span>
                          <span className="text">Add new lecture</span>
                        </button>
                      )}

                      <button
                        className="remove-section"
                        onClick={() => {
                          setIdSectionRemoved(section.idSection);
                          setIsRemoved(true);
                        }}
                      >
                        <span className="icon">
                          <LuTrash2 />
                        </span>
                        <span className="text">Remove this section</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {idRole && idRole === Role.teacher && (
          <>
            {isAddSection ? (
              <div className="each-section">
                <div
                  className="each-section-header"
                  style={{ backgroundColor: "rgba(57, 121, 121, 0.3)" }}
                >
                  <div className="edit-section-container">
                    <input
                      type="text"
                      value={newSectionTitle}
                      placeholder="Section title"
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                    />
                    <div className="edit-section-buttons">
                      <button
                        disabled={!newSectionTitle}
                        onClick={() => {
                          addNewSection(newSectionTitle);
                        }}
                      >
                        <LuCheck />
                      </button>
                      <button
                        onClick={() => {
                          setNewSectionTitle("");
                          setIsAddSection(!isAddSection);
                        }}
                      >
                        <LuX />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="add-section">
                <button onClick={() => setIsAddSection(!isAddSection)}>
                  <LuPlus /> Add new section
                </button>
              </div>
            )}
          </>
        )}

        {/* {idRole && idRole === Role.teacher && (
                    <div className="add-section">
                        <button><LuPlus /> Add new section</button>
                    </div>
                )} */}
      </div>
    </div>
  );
};

export default SectionView;
