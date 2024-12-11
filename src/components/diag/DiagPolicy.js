import { useEffect, useState } from "react";
import { LuShield, LuX } from "react-icons/lu";
import "../../assets/css/card/DiagForm.css";
const DiagPolicy = (props) => {
  const { isOpen, onClose, formData, setFormData } = props;

  const [policy, setPolicy] = useState("");
  useEffect(() => {
    fetch("/policy.txt")
      .then((response) => response.text())
      .then((text) => setPolicy(text))
      .catch((error) => console.error("Error loading text file:", error));
  }, [isOpen]);

  const makeBold = (text, keywords) => {
    // Split text into parts based on keywords and wrap matches in <strong>
    let parts = text.split(new RegExp(`(${keywords.join("|")})`, "gi"));
    return parts.map((part, index) =>
      keywords.some(
        (keyword) => keyword.toLowerCase() === part.toLowerCase()
      ) ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const formatPolicy = (text) => {
    const keywords = [
      "Welcome to Plait!",
      "plaitplatform@gmail.com.",
      "Plait", // Include email in keywords
      ,
    ];
    const lines = text.split("\n"); // Split into lines

    return lines.map((line, index) => {
      // If the line starts with a number followed by a dot, make the whole line bold
      if (/^\d+\./.test(line.trim())) {
        return (
          <p key={index}>
            <strong>{makeBold(line, keywords)}</strong>
          </p>
        );
      }
      // Otherwise, apply keyword highlighting only
      return <p key={index}>{makeBold(line, keywords)}</p>;
    });
  };

  if (!isOpen) return null;
  return (
    <div className={`modal-overlay`} onClick={onClose}>
      <div
        className="modal-container slide-to-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="diag-header">
          <div className="container-title">
            <LuShield className="diag-icon" />
            <span className="diag-title">Policy</span>
          </div>
          <button onClick={onClose}>
            <LuX className="diag-icon" />
          </button>
        </div>
        <div className="diag-body">
          <div className="policy-container">
            <pre>{formatPolicy(policy)}</pre>
          </div>
          <div className="str-btns">
            <div className="act-btns">
              <button
                className="btn diag-btn cancel"
                onClick={() => {
                  setFormData({ ...formData, isCheckedPolicy: false });
                  onClose();
                }}
              >
                Don't agree
              </button>
              <button
                className="btn diag-btn signout"
                onClick={() => {
                  setFormData({ ...formData, isCheckedPolicy: true });
                  onClose();
                }}
              >
                I agree
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagPolicy;
