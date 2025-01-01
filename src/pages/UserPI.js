import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {
  FaChevronDown,
  FaLock,
  FaRegFilePdf,
  FaUser,
  FaUserGraduate,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import {
  LuCamera,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuFile,
  LuTrash2,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "../assets/css/PI.css";
import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import AvatarImageOption from "../components/AvatarImageOption";
import {
  APIStatus,
  Role,
  UserGender,
  UserStatus,
} from "../constants/constants";
import {
  deleteProfileLink,
  deleteQualification,
  postAddProfileLink,
  postAddQualification,
  postChangePassword,
  postUpdateTeacherSpecializedPI,
  postUpdateUserBasicPI,
} from "../services/userService";
import { fetchUserProfile, updateUserPI } from "../store/profileUserSlice";
import DiagRemoveImgForm from "../components/diag/DiagRemoveImgForm";

const TeacherPI = () => {
  const location = useLocation();
  const targetDivRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState({
    basicPI: false,
    specializedPI: false,
    changePW: false,
    link: false,
    qualification: false,
  });
  const [loadingLink, setLoadingLink] = useState(null);
  const [loadingQualification, setLoadingQualification] = useState(null);
  const idUser = +localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");

  const dispatch = useDispatch();

  const userPI = useSelector((state) => state.profileUser);
  const {
    avaImg,
    name,
    phoneNum,
    email,
    gender,
    dob,
    nationality,
    centerName,
    teachingMajor,
    description,
    links,
    qualificationModels,
  } = userPI;
  const [countries, setCountries] = useState([]);
  const [tempUserPI, setTempUserPI] = useState({
    name: "",
    phoneNum: "",
    gender: "",
    dob: "",
    nationality: "",
    teachingMajor: "",
    description: "",
  });

  const [showAvatarImageOption, setShowAvatarImageOption] = useState(false);
  const [roleDes, setRoleDes] = useState("");
  const [activeAction, setActiveAction] = useState("basicPI");
  const [newProfileLink, setNewProfileLink] = useState({ name: "", url: "" });
  const [newQualification, setNewQualification] = useState({
    qualificationName: "",
    qualificationDescr: "",
    qualificationFile: null,
    qualificationUrl: "",
  });
  const [qualiPDFCheck, setQualiPDFCheck] = useState(false);
  const [qualiWarning, setQualiWarning] = useState("");
  const [phoneNumWarning, setPhoneNumWarning] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updatePITeacherSuccess, setUpdatePITeacherSuccess] = useState("");
  const [changePWSuccess, setChangePWSuccess] = useState("");
  const [changePWError, setChangePWError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleVisibility = () => {
    setShowAvatarImageOption(!showAvatarImageOption);
  };
  const [isModalRemoveAvaOpen, setIsModalRemoveAvaOpen] = useState(false);

  const openRemoveAvaModal = () => setIsModalRemoveAvaOpen(true);
  const closeRemoveAvaModal = () => setIsModalRemoveAvaOpen(false);
  const inputFileRef = useRef(null);
  const optionButtonRef = useRef(null);

  const fetchContries = async () => {
    try {
      //API for nationality
      const respone = await fetch(
        "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
      );
      const countryData = await respone.json();
      const countriesData = countryData.countries.map((country) => ({
        label: country.label.split(" ")[1],
      }));

      setCountries(countriesData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  useEffect(() => {
    if (!idUser) {
      console.error("Không tìm thấy idUser trong localStorage");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUserProfile(idUser));
        if (idRole === Role.platformAdmin) {
          setRoleDes("Platform Admin");
        } else if (idRole === Role.centerAdmin) {
          setRoleDes("Center Admin");
        } else if (idRole === Role.teacher) {
          setRoleDes("Teacher");
        } else if (idRole === Role.student) {
          setRoleDes("Student");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy thông tin cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchContries();
  }, [dispatch, idUser, idRole]);

  useEffect(() => {
    setTempUserPI({
      name: userPI.name,
      phoneNum: userPI.phoneNum,
      gender: userPI.gender,
      dob: userPI.dob,
      nationality: userPI.nationality,
      teachingMajor: userPI.teachingMajor,
      description: userPI.description,
    });
  }, [userPI]);

  useEffect(() => {
    if (!loading) {
      // Check if loading is complete
      const state = location.state;
      if (state && state.action) {
        setActiveAction(state.action);
        dispatch(fetchUserProfile(idUser));
        if (targetDivRef.current) {
          targetDivRef.current.scrollIntoView({
            behavior: "smooth", // Makes the scrolling smooth
            block: "start", // Aligns the top of the element with the top of the viewport
          });
        }
      }
    }
  }, [loading, location.state]);

  const handleInputChange = (field, value) => {
    setTempUserPI({ ...tempUserPI, [field]: value });
  };

  const validatePhoneNum = (num) => /^\d{10}$/.test(num);

  const updateBasicInfo = async () => {
    if (tempUserPI.phoneNum && !validatePhoneNum(tempUserPI.phoneNum)) {
      setPhoneNumWarning("Phone number must be exactly 10 digits.");
    } else {
      setPhoneNumWarning("");
      setLoadingBtn((prevState) => ({
        ...prevState,
        basicPI: true,
      }));
      try {
        const response = await postUpdateUserBasicPI(
          idUser,
          tempUserPI.name,
          tempUserPI.phoneNum,
          tempUserPI.gender,
          tempUserPI.dob,
          tempUserPI.nationality
        );
        if (response.status === APIStatus.success) {
          await dispatch(fetchUserProfile(idUser));
          setUpdateSuccess("Your profile has been updated successfully!");

          setTimeout(() => {
            setUpdateSuccess("");
          }, 3000);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setUpdateSuccess("There was an error updating your profile.");
      } finally {
        setLoadingBtn((prevState) => ({
          ...prevState,
          basicPI: false,
        }));
      }
    }
  };
  const handleDiscardChanges = () => {
    const currentUserPI = {
      name,
      phoneNum,
      gender: gender ?? null,
      dob,
      nationality,
      teachingMajor,
      description,
    };
    setTempUserPI(currentUserPI);
    setPhoneNumWarning("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleSaveChanges = () => {
    dispatch(updateUserPI(tempUserPI));
    updateBasicInfo();
  };
  const updateTeacherSpecializedPI = async () => {
    setLoadingBtn((prevState) => ({
      ...prevState,
      specializedPI: true,
    }));
    try {
      const response = await postUpdateTeacherSpecializedPI(
        idUser,
        tempUserPI.teachingMajor,
        tempUserPI.description
      );
      if (response.status === APIStatus.success) {
        dispatch(updateUserPI({ teachingMajor, description }));
        await dispatch(fetchUserProfile(idUser));
        setUpdatePITeacherSuccess(
          "Your specialized infomation has been updated successfully!"
        );
        setTimeout(() => {
          setUpdatePITeacherSuccess("");
        }, 3000);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingBtn((prevState) => ({
        ...prevState,
        specializedPI: false,
      }));
    }
  };

  const handleActionClick = (action) => {
    setActiveAction(action);
  };
  const addProfileLink = async () => {
    if (newProfileLink.name && newProfileLink.url) {
      setLoadingBtn((prevState) => ({
        ...prevState,
        link: true,
      }));
      try {
        const response = await postAddProfileLink(
          newProfileLink.name,
          newProfileLink.url
        );
        if (response.status === APIStatus.success) {
          await dispatch(fetchUserProfile(idUser));
          setNewProfileLink({ name: "", url: "" });
        }
      } catch (error) {
        throw error;
      } finally {
        setLoadingBtn((prevState) => ({
          ...prevState,
          link: false,
        }));
      }
    }
  };
  const removeProfileLink = async (idProfileLink) => {
    setLoadingLink(idProfileLink);
    try {
      const response = await deleteProfileLink(idProfileLink);
      if (response.status === APIStatus.success) {
        await dispatch(fetchUserProfile(idUser));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingLink(null); // Tắt loading sau khi hoàn tất
    }
  };
  const handleURLProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, url: e.target.value });
  };

  const handleNameProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, name: e.target.value });
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
      setLoadingBtn((prevState) => ({
        ...prevState,
        qualification: true,
      }));
      try {
        const response = await postAddQualification(
          idUser,
          newQualification.qualificationName,
          newQualification.qualificationDescr,
          newQualification.qualificationFile
        );
        if (response.status === APIStatus.success) {
          await setNewQualification((prev) => ({
            ...prev,
            qualificationName: "",
            qualificationDescr: "",
            qualificationFile: null,
            qualificationUrl: "",
          }));
          await setQualiPDFCheck(false);
        }
      } catch (error) {
        throw error;
      } finally {
        setLoadingBtn((prevState) => ({
          ...prevState,
          qualification: false,
        }));
      }
    } else {
      setQualiWarning(
        "Please enter all required fields for the qualification."
      );
    }

    await dispatch(fetchUserProfile(idUser));
  };
  const removeQualification = async (idQualification) => {
    setLoadingQualification(idQualification);
    try {
      const response = await deleteQualification(idQualification);
      if (response.status === APIStatus.success) {
        await dispatch(fetchUserProfile(idUser));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoadingQualification(null);
    }
  };

  const handleChangePassword = async () => {
    if (oldPassword && newPassword && confirmPassword) {
      if (
        oldPassword.length < 5 ||
        newPassword.length < 5 ||
        confirmPassword.length < 5
      ) {
        setChangePWError("Password must be at least 5 characters");
      }
      if (newPassword === confirmPassword) {
        const idAccount = +localStorage.getItem("idAccount");
        setLoadingBtn((prevState) => ({
          ...prevState,
          changePW: true,
        }));
        console.log("LoadingBtn set to true:", loadingBtn);
        try {
          const response = await postChangePassword(
            oldPassword,
            newPassword,
            idAccount,
            idUser
          );
          if (response.status !== APIStatus.success) {
            setChangePWError(response.data);
          } else {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setChangePWError("");
            setChangePWSuccess("Your password has been changed successfully!");
            setTimeout(() => {
              setChangePWSuccess("");
            }, 3000);
          }
        } catch (error) {
          setChangePWError(error.message);
        } finally {
          setLoadingBtn((prevState) => ({
            ...prevState,
            changePW: false,
          }));
          console.log("LoadingBtn set to false:", loadingBtn);
        }
      } else {
        setChangePWError("New password and confirmation do not match.");
      }
    }
  };
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    );
  }
  return (
    <div>
      <div className="container-pi user-pi">
        <div className="container-ava slide-to-right">
          <div className="sub-container-ava">
            <img
              src={avaImg ? avaImg : default_ava}
              alt=""
              className="main-ava-image"
            />
            <button
              ref={optionButtonRef}
              className="container-icon"
              onClick={toggleVisibility}
            >
              <LuCamera className="icon" />
            </button>
            {showAvatarImageOption && (
              <AvatarImageOption
                isAvatar={true}
                openRemoveAvaModal={openRemoveAvaModal}
                isOpen={showAvatarImageOption}
                onClose={() => setShowAvatarImageOption(false)}
                optionButtonRef={optionButtonRef}
              />
            )}
          </div>
          <div className="sub-container-action">
            <span className="name-info">{name}</span>
            <span className="role-des">{roleDes}</span>

            <div className="action-btn">
              <div
                className={`btn ${activeAction === "basicPI" ? "active" : ""}`}
                onClick={() => handleActionClick("basicPI")}
              >
                <FaUser className="icon" />
                Personal Infomation
              </div>
              {idRole === Role.teacher && (
                <div
                  className={`btn ${
                    activeAction === "specializedPI" ? "active" : ""
                  }`}
                  onClick={() => handleActionClick("specializedPI")}
                >
                  <FaUserGraduate className="icon" />
                  Specialized Infomation
                </div>
              )}
              <div
                className={`btn ${activeAction === "security" ? "active" : ""}`}
                onClick={() => handleActionClick("security")}
              >
                <FaLock className="icon" />
                Security
              </div>
            </div>
          </div>
        </div>
        {activeAction === "basicPI" ? (
          <div className="container-specialized slide-to-left">
            <div className="container-info">
              <span className="title-span">Personal Infomation</span>
              <div className="info">
                <span>Name</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={tempUserPI.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="info">
                <span>Email</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={email || ""}
                  disabled
                />
              </div>
              <div className="container-field">
                <div className="container-left">
                  <div className="info">
                    <span>Gender</span>
                    <div className="select-container">
                      <select
                        className="input-form-pi"
                        value={tempUserPI.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                      >
                        <option value={UserGender.male}>Male</option>
                        <option value={UserGender.female}>Female</option>
                        <option value={UserGender.other}>Other</option>
                      </select>
                      <FaChevronDown className="arrow-icon" />
                    </div>
                  </div>
                  <div className="info">
                    <div className="container-validate">
                      <span>Phone Number</span>
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
                      type="number"
                      className="input-form-pi"
                      value={tempUserPI.phoneNum || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNum", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="container-gap"></div>
                <div className="container-right">
                  <div className="info">
                    <span>Birthday</span>
                    <input
                      type="date"
                      className="input-form-pi"
                      value={tempUserPI.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  </div>
                  <div className="info">
                    <span>Nationality</span>
                    <div className="select-container">
                      <select
                        className="input-form-pi"
                        value={tempUserPI.nationality}
                        onChange={(e) =>
                          handleInputChange("nationality", e.target.value)
                        }
                      >
                        {countries.map((country, index) => (
                          <option key={index} value={country.label}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="alert-option">
                {updateSuccess && (
                  <Alert variant="success" onClose={() => setUpdateSuccess("")}>
                    {updateSuccess}
                  </Alert>
                )}
                <div className="container-button">
                  <button
                    className="discard-changes"
                    onClick={handleDiscardChanges}
                  >
                    Discard changes
                  </button>
                  <button className="save-change" onClick={handleSaveChanges}>
                    {loadingBtn.basicPI && (
                      <ImSpinner2 className="icon-spin" color="#397979" />
                    )}
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeAction === "specializedPI" ? (
          <div className="container-specialized slide-to-left">
            <div className="container-info auto">
              <span className="title-span">Specialized Infomation</span>
              <div className="info">
                <span>Center</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={centerName || ""}
                  disabled
                />
              </div>
              <div className="info">
                <span>Teaching Specialization</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={tempUserPI.teachingMajor || ""}
                  onChange={(e) =>
                    handleInputChange("teachingMajor", e.target.value)
                  }
                />
              </div>
              <div className="info">
                <span>Biography</span>
                <Form.Control
                  as="textarea"
                  className="input-area-form-pi"
                  value={tempUserPI.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div className="alert-option">
                {updatePITeacherSuccess && (
                  <Alert
                    variant="success"
                    onClose={() => setUpdatePITeacherSuccess("")}
                  >
                    {updatePITeacherSuccess}
                  </Alert>
                )}
                <div className="container-button">
                  <button
                    className="discard-changes"
                    onClick={handleDiscardChanges}
                  >
                    Discard changes
                  </button>
                  <button
                    className="save-change"
                    onClick={() => updateTeacherSpecializedPI()}
                  >
                    {loadingBtn.specializedPI && (
                      <ImSpinner2 className="icon-spin" color="#397979" />
                    )}
                    Save changes
                  </button>
                </div>
              </div>
            </div>
            <div className="container-info auto">
              <span className="title-span">
                Social/Professional Profile Links
              </span>
              <div className="info">
                {links.map((profile, index) => (
                  <div className="container-link" key={index}>
                    <InputGroup className="mb-3">
                      <input
                        type="text"
                        value={profile.name || ""}
                        className="title-link"
                        readOnly
                      />
                      <Form.Control
                        className="main-link"
                        value={profile.url || ""}
                        onClick={() => window.open(profile.url)}
                        style={{ cursor: "pointer" }}
                        readOnly
                      />
                    </InputGroup>
                    <div
                      className="icon-button"
                      onClick={() => {
                        removeProfileLink(profile.idProfileLink);
                      }}
                    >
                      {loadingLink === profile.idProfileLink ? (
                        <ImSpinner2 className="icon-spin icon" />
                      ) : (
                        <LuTrash2 className="icon" />
                      )}
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
                    </select>
                    <Form.Control
                      placeholder="Link"
                      className="main-link"
                      value={newProfileLink.url}
                      onChange={handleURLProfileLinkChange}
                    />
                  </InputGroup>
                  <div className="icon-button" onClick={addProfileLink}>
                    {loadingBtn.link ? (
                      <ImSpinner2 className="icon-spin icon" color="#D9D9D9" />
                    ) : (
                      <LuCheck className="icon" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div ref={targetDivRef} className="container-info auto">
              <span className="title-span">Professional Qualifications</span>
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
                        <span
                          className={`span ${
                            qualification.status === UserStatus.active
                              ? "approved"
                              : qualification.status === UserStatus.pending
                              ? "pending"
                              : "rejected"
                          }`}
                        >
                          {qualification.status === UserStatus.active
                            ? "Approved"
                            : qualification.status === UserStatus.pending
                            ? "Pending"
                            : `Rejected. Reason: ${qualification.reason}`}
                        </span>
                        <div className="icon-btn-container">
                          <div
                            className="icon-button"
                            onClick={() => {
                              removeQualification(
                                qualification.idQualification
                              );
                            }}
                          >
                            {loadingQualification ===
                            qualification.idQualification ? (
                              <ImSpinner2 className="icon-spin icon" />
                            ) : (
                              <LuTrash2 className="icon" />
                            )}
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
                        <span className={"warning-error"}>{qualiWarning}</span>
                      )}

                      <div className="icon-btn-container">
                        <div
                          className="icon-button"
                          onClick={handleOpenQualiInput}
                        >
                          <LuFile className="icon" />
                        </div>
                        <div className="icon-button" onClick={AddQualification}>
                          {loadingBtn.qualification ? (
                            <ImSpinner2
                              className="icon-spin icon"
                              color="#D9D9D9"
                            />
                          ) : (
                            <LuCheck className="icon" />
                          )}
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
        ) : (
          <div className="container-specialized slide-to-left">
            <div className="container-info">
              <span className="title-span">Security</span>
              <div className="info">
                <span>Current password</span>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="input-form-pi"
                  value={oldPassword || ""}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setChangePWError("");
                    setChangePWSuccess("");
                  }}
                />
                <span onClick={() => setShowOldPassword(!showOldPassword)}>
                  {showOldPassword ? (
                    <LuEyeOff className="password-icon" />
                  ) : (
                    <LuEye className="password-icon" />
                  )}
                </span>
              </div>
              <div className="info">
                <span>New password</span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="input-form-pi"
                  value={newPassword || ""}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setChangePWError("");
                    setChangePWSuccess("");
                  }}
                />
                <span onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? (
                    <LuEyeOff className="password-icon" />
                  ) : (
                    <LuEye className="password-icon" />
                  )}
                </span>
              </div>
              <div className="info">
                <span>Confirm new password</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-form-pi"
                  value={confirmPassword || ""}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setChangePWError("");
                    setChangePWSuccess("");
                  }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <LuEyeOff className="password-icon" />
                  ) : (
                    <LuEye className="password-icon" />
                  )}
                </span>
              </div>
              <div className="alert-option">
                {changePWSuccess && (
                  <Alert
                    variant="success"
                    onClose={() => setChangePWSuccess("")}
                  >
                    {changePWSuccess}
                  </Alert>
                )}
                {changePWError && (
                  <Alert
                    variant="danger"
                    onClose={() => setChangePWSuccess("")}
                  >
                    {changePWError}
                  </Alert>
                )}
                <div className="container-button">
                  <button
                    className="discard-changes"
                    onClick={handleDiscardChanges}
                  >
                    Cancel
                  </button>
                  <button
                    className="save-change"
                    onClick={() => {
                      handleChangePassword();
                    }}
                  >
                    {loadingBtn.changePW && (
                      <ImSpinner2 className="icon-spin" color="#397979" />
                    )}
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalRemoveAvaOpen && (
        <DiagRemoveImgForm
          isOpen={isModalRemoveAvaOpen}
          onClose={closeRemoveAvaModal}
          isAvatar={true}
        />
      )}
    </div>
  );
};

export default TeacherPI;
