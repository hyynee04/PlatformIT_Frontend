import React, { useEffect, useRef, useState } from "react";
import { LuTrash2, LuCheck, LuFile, LuLock } from "react-icons/lu";
import { FaInfoCircle, FaGlobe, FaRegFilePdf } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCenterProfile } from "../../store/profileCenterSlice";
import {
  postAddCenterLink,
  postAddCenterQualification,
  postUpdateCenterBasicInfo,
} from "../../services/centerService";
import {
  deleteProfileLink,
  deleteQualification,
} from "../../services/userService";
import CenterAdAdminMgmt from "../userMgmt/CenterAdAdminMgmt";

import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/PI.css";
import AvatarImageOption from "../../components/AvatarImageOption";
import DiagWorkingHourForm from "../../components/DiagWorkingHourForm";
import DiagLockCenterForm from "../../components/DiagLockCenterForm";
const CenterAdCenterMgmt = () => {
  //Center Infomation
  const dispatchInfo = useDispatch();
  const centerInfo = useSelector((state) => state.profileCenter);
  const {
    avatarPath,
    centerName,
    centerEmail,
    tin,
    address,
    phoneNumber,
    description,
    establishedDate,
    submissionDate,
    centerStatus,
    idMainAdmin,
    links,
    qualificationModels,
  } = centerInfo;
  const [tempCenterInfo, setTempCenterInfo] = useState({
    centerName: "",
    centerEmail: "",
    tin: "",
    address: "",
    phoneNumber: "",
    description: "",
    establishedDate: "",
    submissionDate: "",
    centerStatus: 0,
  });
  const [activeAction, setActiveAction] = useState("basicInfo");
  const [phoneNumWarning, setPhoneNumWarning] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [updateStr, setUpdateStr] = useState("");
  const [newProfileLink, setNewProfileLink] = useState({ name: "", url: "" });
  const [newQualification, setNewQualification] = useState({
    qualificationName: "",
    qualificationDescr: "",
    qualificationFile: null,
    qualificationUrl: "",
  });
  const [qualiPDFCheck, setQualiPDFCheck] = useState(false);
  const [qualiWarning, setQualiWarning] = useState("");
  const inputFileRef = useRef(null);
  const [showAvatarImageOption, setShowAvatarImageOption] = useState(false);
  const toggleVisibility = () => {
    setShowAvatarImageOption(!showAvatarImageOption);
  };
  const [isModalHourOpen, setIsModalHourOpen] = useState(false);
  const openHourModal = () => {
    setIsModalHourOpen(true);
    setShowAvatarImageOption(false);
  };
  const closeHourModal = () => setIsModalHourOpen(false);

  const [isModalLockCenter, setIsModalLockCenter] = useState(false);
  const openLockCenterModal = () => {
    setIsModalLockCenter(true);
    setIsModalHourOpen(false);
    setShowAvatarImageOption(false);
  };
  const closeLockCenterModal = () => setIsModalLockCenter(false);
  //FETCH DATA
  const handleActionClick = (action) => {
    setActiveAction(action);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatchInfo(fetchCenterProfile());
      } catch (error) {
        console.error("Error getting center info", error);
      }
    };
    fetchData();
  }, [dispatchInfo]);

  useEffect(() => {
    setTempCenterInfo({
      centerName: centerInfo.centerName,
      centerEmail: centerInfo.centerEmail,
      tin: centerInfo.tin,
      address: centerInfo.address,
      phoneNumber: centerInfo.phoneNumber,
      description: centerInfo.description,
      establishedDate: centerInfo.establishedDate,
      submissionDate: centerInfo.submissionDate,
      centerStatus: centerInfo.centerStatus,
    });
  }, [centerInfo]);

  const idUser = +localStorage.getItem("idUser");
  const isCurrentUserMainAdmin = idMainAdmin === idUser;
  //BASIC INFO
  const handleInputChange = (field, value) => {
    setTempCenterInfo({ ...tempCenterInfo, [field]: value });
  };
  const validatePhoneNum = (num) => /^\d{10}$/.test(num);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const updateBasicInfo = async () => {
    if (
      tempCenterInfo.phoneNumber &&
      !validatePhoneNum(tempCenterInfo.phoneNumber)
    ) {
      setPhoneNumWarning("Phone number must be exactly 10 digits.");
    } else {
      setPhoneNumWarning("");
      if (
        tempCenterInfo.centerEmail &&
        !validateEmail(tempCenterInfo.centerEmail)
      ) {
        setEmailWarning("Please enter a valid email format.");
      } else {
        setEmailWarning("");
        try {
          await postUpdateCenterBasicInfo(
            tempCenterInfo.centerName,
            tempCenterInfo.centerEmail,
            tempCenterInfo.address,
            tempCenterInfo.phoneNumber,
            tempCenterInfo.description,
            tempCenterInfo.establishedDate
          );
          await dispatchInfo(fetchCenterProfile());
          setUpdateStr("Center information has been updated successfully!");

          setTimeout(() => {
            setUpdateStr("");
          }, 3000);
        } catch (error) {
          setUpdateStr("There was an error updating center information.");
          throw error;
        }
      }
    }
  };

  //LINKS
  const removeProfileLink = async (idProfileLink) => {
    await deleteProfileLink(idProfileLink);
    await dispatchInfo(fetchCenterProfile());
  };
  const handleNameProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, name: e.target.value });
  };
  const handleURLProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, url: e.target.value });
  };
  const addProfileLink = async () => {
    if (newProfileLink.name && newProfileLink.url) {
      await postAddCenterLink(newProfileLink.name, newProfileLink.url);
      await dispatchInfo(fetchCenterProfile());
      setNewProfileLink({ name: "", url: "" });
    }
  };

  //QUALIFICATIONS
  const removeQualification = async (idQualification) => {
    await deleteQualification(idQualification);
    await dispatchInfo(fetchCenterProfile());
  };
  const handleNameQualificationChange = (e) => {
    setNewQualification({
      ...newQualification,
      qualificationName: e.target.value,
    });
    setQualiWarning("");
  };
  const handleDescrQualificationChange = (e) => {
    setNewQualification({
      ...newQualification,
      qualificationDescr: e.target.value,
    });
    setQualiWarning("");
  };
  const handleOpenQualiInput = () => {
    inputFileRef.current.click();
  };
  const formatFile = (file) => {
    return {
      uri: file.uri || "",
      name: file.name || "avatar.png",
      type: file.type || "image/png",
    };
  };
  const handleQualiFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === "application/pdf") {
        setQualiPDFCheck(true);
      }
      const formattedFile = formatFile(file);
      try {
        let blobFile;

        if (formattedFile.uri && formattedFile.uri.startsWith("blob:")) {
          let response = await fetch(formattedFile.uri);
          const blob = await response.blob();

          blobFile = new File([blob], formattedFile.name, {
            type: formattedFile.type,
          });
        } else {
          blobFile = file;
        }
        console.log(blobFile);

        const fileUrl = URL.createObjectURL(blobFile);
        setNewQualification((prev) => ({
          ...prev,
          qualificationFile: blobFile,
          qualificationUrl: fileUrl,
        }));
        setQualiWarning("");
      } catch (error) {
        throw error;
      }
    }
  };
  const AddQualification = async () => {
    if (
      newQualification.qualificationName &&
      newQualification.qualificationDescr &&
      newQualification.qualificationFile
    ) {
      await postAddCenterQualification(
        newQualification.qualificationName,
        newQualification.qualificationDescr,
        newQualification.qualificationFile
      );
      await setNewQualification((prev) => ({
        ...prev,
        qualificationName: "",
        qualificationDescr: "",
        qualificationFile: null,
        qualificationUrl: "",
      }));
      await setQualiPDFCheck(false);
    } else {
      setQualiWarning(
        "Please enter all required fields for the qualification."
      );
    }
    await dispatchInfo(fetchCenterProfile());
  };

  return (
    <>
      <div className="center-info">
        <div className="title-info">
          <b>Center Infomation</b>
          {isCurrentUserMainAdmin && (
            <div
              className="btn"
              onClick={() => {
                openLockCenterModal();
              }}
            >
              <LuLock className="icon" />
              <span>Lock</span>
            </div>
          )}
        </div>
        {isModalLockCenter && (
          <div>
            <DiagLockCenterForm
              isOpen={isModalLockCenter}
              onClose={closeLockCenterModal}
            />
          </div>
        )}
        <div className="container-pi">
          <div className="container-ava">
            <div className="sub-container-ava">
              <img
                src={avatarPath ? avatarPath : default_image}
                alt=""
                className="main-center-image"
                onClick={toggleVisibility}
              />
              {showAvatarImageOption && <AvatarImageOption isAvatar={false} />}
            </div>
            <div className="sub-container-action">
              <div className="action-btn">
                <div
                  className={`btn ${
                    activeAction === "basicInfo" ? "active" : ""
                  }`}
                  onClick={() => handleActionClick("basicInfo")}
                >
                  <FaInfoCircle className="icon" />
                  Basic Infomation
                </div>
                <div
                  className={`btn ${
                    activeAction === "link_quali" ? "active" : ""
                  }`}
                  onClick={() => handleActionClick("link_quali")}
                >
                  <FaGlobe className="icon" />
                  Links & Qualifications
                </div>
              </div>
            </div>
          </div>
          {activeAction === "basicInfo" ? (
            <div className="container-specialized">
              <div className="container-info">
                <div className="container-field">
                  <div className="container-left">
                    <div className="info">
                      <span>Center Name</span>
                      <input
                        type="text"
                        className="input-form-pi"
                        value={tempCenterInfo.centerName || ""}
                        onChange={(e) =>
                          handleInputChange("centerName", e.target.value)
                        }
                      />
                    </div>
                    <div className="info">
                      <div className="container-phone">
                        <span>Contact Number</span>
                        {phoneNumWarning && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {phoneNumWarning}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        className="input-form-pi"
                        value={tempCenterInfo.phoneNumber || ""}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                    </div>
                    <div className="info">
                      <span>Date Created</span>
                      <input
                        type="date"
                        className="input-form-pi"
                        value={tempCenterInfo.submissionDate}
                        disabled
                      />
                    </div>
                    <div className="info">
                      <span>Tax Identification Number (TIN)</span>
                      <input
                        type="text"
                        className="input-form-pi"
                        value={tempCenterInfo.tin || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="container-gap"></div>
                  <div className="container-right">
                    <div className="info">
                      <span>Address</span>
                      <input
                        type="text"
                        className="input-form-pi"
                        value={tempCenterInfo.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className="info">
                      <div className="container-phone">
                        <span>Email</span>
                        {emailWarning && (
                          <span
                            className={"warning-error"}
                            style={{ color: "var(--red-color)" }}
                          >
                            {emailWarning}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        className="input-form-pi"
                        value={tempCenterInfo.centerEmail || ""}
                        onChange={(e) =>
                          handleInputChange("centerEmail", e.target.value)
                        }
                      />
                    </div>
                    <div className="info">
                      <span>Date Established</span>
                      <input
                        type="date"
                        className="input-form-pi"
                        value={tempCenterInfo.establishedDate}
                        onChange={(e) =>
                          handleInputChange("submissionDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="info">
                      <span>Description</span>
                      <Form.Control
                        as="textarea"
                        className="input-area-form-pi"
                        value={tempCenterInfo.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="alert-option">
                  {updateStr && (
                    <Alert variant="success" onClose={() => setUpdateStr("")}>
                      {updateStr}
                    </Alert>
                  )}
                  <div className="container-button">
                    <button
                      className="discard-changes"
                      onClick={() => {
                        openHourModal();
                      }}
                    >
                      Add Working Hours
                    </button>

                    <button
                      className="save-change"
                      onClick={() => {
                        updateBasicInfo();
                      }}
                    >
                      Save changes
                    </button>
                  </div>
                  {isModalHourOpen && (
                    <div>
                      <DiagWorkingHourForm
                        isOpen={isModalHourOpen}
                        onClose={closeHourModal}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="container-specialized">
              <div className="container-info">
                <span className="title-span">Social/Website Links</span>
                <div className="info">
                  {links.map((link, index) => (
                    <div className="container-link" key={index}>
                      <InputGroup className="mb-3">
                        <input
                          type="text"
                          value={link.name || ""}
                          className="title-link"
                          readOnly
                        />
                        <Form.Control
                          className="main-link"
                          value={link.url || ""}
                          readOnly
                        />
                      </InputGroup>
                      <div
                        className="icon-button"
                        onClick={() => {
                          removeProfileLink(link.idProfileLink);
                        }}
                      >
                        <LuTrash2 className="icon" />
                      </div>
                    </div>
                  ))}
                  <div className="container-link">
                    <InputGroup className="mb-3">
                      <select
                        onChange={handleNameProfileLinkChange}
                        className="title-link"
                        value={newProfileLink.name || ""}
                      >
                        <option value="" className="option-link">
                          Select type
                        </option>
                        <option value="Github" className="option-link">
                          Github
                        </option>
                        <option value="LinkedIn" className="option-link">
                          LinkedIn
                        </option>
                        <option value="Portfolio" className="option-link">
                          Portfolio
                        </option>
                        <option value="Youtube" className="option-link">
                          Youtube
                        </option>
                        <option value="Facebook" className="option-link">
                          Facebook
                        </option>
                        <option value="Website" className="option-link">
                          Website
                        </option>
                      </select>
                      <Form.Control
                        placeholder="Link"
                        className="main-link"
                        value={newProfileLink.url}
                        onChange={handleURLProfileLinkChange}
                      />
                    </InputGroup>
                    <div className="icon-button" onClick={addProfileLink}>
                      <LuCheck className="icon" />
                    </div>
                  </div>
                </div>
                <span className="title-span">Qualifications</span>
                <div className="info">
                  {qualificationModels.map((qualification, index) => (
                    <div className="container-info-img" key={index}>
                      <div className="quali-content">
                        <input
                          type="text"
                          className="input-form-pi"
                          value={qualification.qualificationName || ""}
                          disabled
                        />
                        <input
                          type="text"
                          className="input-form-pi"
                          value={qualification.description || ""}
                          disabled
                        />
                        <div className="status-action">
                          <div className="icon-btn-container">
                            <div
                              className="icon-button"
                              onClick={() => {
                                removeQualification(
                                  qualification.idQualification
                                );
                              }}
                            >
                              <LuTrash2 className="icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="quali-image">
                        {qualification.path &&
                        qualification.path.endsWith(".pdf") ? (
                          <div
                            onClick={() =>
                              window.open(qualification.path, "_blank")
                            }
                            className="main-ava-image pdf-link"
                          >
                            <FaRegFilePdf
                              style={{ width: "40px", height: "40px" }}
                            />
                            <span>Click to view PDF</span>
                          </div>
                        ) : (
                          <img
                            src={
                              qualification.path
                                ? qualification.path
                                : default_image
                            }
                            alt=""
                            className="main-ava-image"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="container-info-img">
                    <div className="quali-content">
                      <input
                        type="text"
                        className="input-form-pi"
                        placeholder="Title..."
                        value={newQualification.qualificationName || ""}
                        onChange={handleNameQualificationChange}
                      />
                      <input
                        type="text"
                        className="input-form-pi"
                        placeholder="Description..."
                        onChange={handleDescrQualificationChange}
                        value={newQualification.qualificationDescr || ""}
                      />
                      <div className="status-action">
                        {qualiWarning && (
                          <span className={"warning-error"}>
                            {qualiWarning}
                          </span>
                        )}

                        <div className="icon-btn-container">
                          <div
                            className="icon-button"
                            onClick={handleOpenQualiInput}
                          >
                            <LuFile className="icon" />
                          </div>
                          <div
                            className="icon-button"
                            onClick={AddQualification}
                          >
                            <LuCheck className="icon" />
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={inputFileRef}
                        style={{ display: "none" }}
                        accept=".png, .jpg, .jpeg, .pdf"
                        onChange={handleQualiFileChange}
                      />
                    </div>
                    <div className="quali-image">
                      {qualiPDFCheck ? (
                        <div
                          onClick={() =>
                            window.open(
                              newQualification.qualificationUrl,
                              "_blank"
                            )
                          }
                          className="main-ava-image pdf-link"
                        >
                          <FaRegFilePdf
                            style={{ width: "40px", height: "40px" }}
                          />
                          <span>Click to view PDF</span>
                        </div>
                      ) : (
                        <img
                          src={
                            newQualification.qualificationUrl
                              ? newQualification.qualificationUrl
                              : default_image
                          }
                          alt=""
                          className="main-ava-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CenterAdAdminMgmt />
    </>
  );
};

export default CenterAdCenterMgmt;
