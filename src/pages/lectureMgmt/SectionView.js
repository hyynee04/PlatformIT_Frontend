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
import { Role } from "../../constants/constants";
const SectionView = (props) => {
  const {
    idUser,
    idLecture,
    idSection,
    sectionList,
    setIdLecture,
    setIdSection,
  } = props;
  const idRole = +localStorage.getItem("idRole");

  const [isShowed, setIsShowed] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [isAddSection, setIsAddSection] = useState(false);

  const [editSectionName, setEditSectionName] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

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
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <LuCheck />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
                      <div className="lecture-info">
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
              {idRole && idRole === Role.teacher && (
                <div
                  className={`section-lectures ${
                    isShowed[section.idSection] ? "" : "deactive"
                  }`}
                >
                  <div className="lecture-item contain-button nohover">
                    <div className="option-container">
                      <button
                        className="add-lecture"
                        // onClick={() =>
                        //     navigate("/addNewLecture", {
                        //         state: {
                        //             idCourse: courseInfo.idCourse,
                        //             idSection: section.idSection,
                        //             idCreatedBy: idUser,
                        //             courseTitle: courseInfo.courseTitle,
                        //             sectionName: section.sectionName
                        //         }
                        //     })
                        // }
                      >
                        <span className="icon">
                          <LuPlus />
                        </span>
                        <span className="text">Add new lecture</span>
                      </button>
                      <button className="remove-section">
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
                      <button>
                        <LuCheck />
                      </button>
                      <button onClick={() => setIsAddSection(!isAddSection)}>
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
