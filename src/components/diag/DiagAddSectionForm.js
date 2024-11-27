import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { LuPenLine, LuX } from "react-icons/lu";
import "../../assets/scss/card/DiagForm.css";
import { APIStatus } from "../../constants/constants";
import { postAddSection } from "../../services/courseService";

const DiagAddSectionForm = (props) => {
    const { isOpen, onClose, idCourse, idTeacher, fetchData } = props;

    const [loading, setLoading] = useState(false);
    const [sectionTitle, setSectionTitle] = useState("");
    const [errorString, setErrorString] = useState("");

    const [isCreated, setIsCreated] = useState(false);

    const addNewSection = async (sectionTitle) => {
        setLoading(true)
        if (!sectionTitle) {
            setErrorString("Section title is missing");
            return;
        }
        try {
            let response = await postAddSection(sectionTitle, idCourse, idTeacher)
            if (response.status === APIStatus.success) {
                setIsCreated(true)
            }
            else setErrorString(response.data)
        } catch (error) {
            console.error("Error posting data:", error);
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    }

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
                        {!isCreated ?
                            (
                                <>
                                    <div className="container-diag-field">
                                        <div className="info">
                                            <span>Section title</span>
                                            <input
                                                type="text"
                                                className="input-form-diag"
                                                placeholder="Title of this section..."
                                                value={sectionTitle}
                                                onChange={(e) => {
                                                    setSectionTitle(e.target.value);
                                                    setErrorString("");
                                                }}
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
                                                onClick={() => addNewSection(sectionTitle)}
                                            >
                                                {loading && (<ImSpinner2 className="icon-spin" />)}
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                            :
                            (
                                <>
                                    <div className="container-diag-field">
                                        <span className="section-create-inform">Section created successfully!</span>
                                    </div>
                                    <div className="str-btns">
                                        <div className="act-btns">
                                            <button
                                                className="btn diag-btn cancle"
                                                onClick={() => {
                                                    onClose();
                                                    fetchData(idCourse);
                                                }}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="btn diag-btn signout"
                                                onClick={() => {
                                                    setSectionTitle("")
                                                    setIsCreated(false);
                                                }}
                                            >
                                                Add new section
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default DiagAddSectionForm