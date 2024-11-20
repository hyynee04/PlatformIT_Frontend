import { useState } from "react";
import { LuPenLine, LuX } from "react-icons/lu";
import "../../assets/scss/card/DiagForm.css";

const DiagAddSectionForm = (props) => {
    const { isOpen, onClose, idCourse, idTeacher } = props;

    const [sectionTitle, setSectiontitle] = useState("")
    const [errorString, setErrorString] = useState("");

    if (!isOpen) return null;
    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className={`modal-container ${isOpen ? 'float-in' : 'float-out'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="diag-header">
                        <div className="container-title">
                            <LuPenLine className="diag-icon" />
                            <span className="diag-title">New Section</span>
                        </div>
                        <LuX className="diag-icon" onClick={onClose} />
                    </div>
                    <div className="diag-body">
                        <div className="container-diag-field">
                            <div className="info">
                                <span>Section title</span>
                                <input
                                    type="text"
                                    className="input-form-diag"
                                    placeholder="Title of this section..."
                                    value={sectionTitle}
                                    onChange={(e) => setSectiontitle(e.target.value)}
                                />
                                {errorString && <span className="error-noti">{errorString}</span>}
                            </div>
                        </div>
                        <div className="str-btns">
                            <div className="act-btns">
                                <button className="btn diag-btn cancle" onClick={onClose}>
                                    Cancel
                                </button>
                                <button
                                    className="btn diag-btn signout"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DiagAddSectionForm