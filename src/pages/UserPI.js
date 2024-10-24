import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import {
  LuCamera,
  LuEyeOff,
  LuEye,
  LuFile,
  LuCheck,
  LuTrash2,
} from "react-icons/lu";
import { FaChevronDown, FaUser, FaUserGraduate, FaLock } from "react-icons/fa";
import default_ava from "../assets/img/default_ava.png";
import default_image from "../assets/img/default_image.png";
import "../assets/scss/PI.css";
import {
  deleteProfileLink,
  deleteQualification,
  postAddProfileLink,
  postAddQualification,
  postChangePassword,
  postUpdateTeacherSpecializedPI,
  postUpdateUserBasicPI,
} from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserPI } from "../store/profileUserSlice";
import { Role, Status, UserGender } from "../constants/constants";
import AvatarImageOption from "../components/AvatarImageOption";

const TeacherPI = () => {
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
  const [qualiWarning, setQualiWarning] = useState("");
  const [phoneNumWarning, setPhoneNumWarning] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updatePITeacherSuccess, setUpdatePITeacherSuccess] = useState("");
  const [changePWSuccess, setChangePWSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleVisibility = () => {
    setShowAvatarImageOption(!showAvatarImageOption);
  };
  const inputFileRef = useRef(null);

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
  const handleInputChange = (field, value) => {
    setTempUserPI({ ...tempUserPI, [field]: value });
  };

  const validatePhoneNum = (num) => /^\d{10}$/.test(num);

  const updateBasicInfo = async () => {
    if (!validatePhoneNum(tempUserPI.phoneNum)) {
      setPhoneNumWarning("Phone number must be exactly 10 digits.");
    } else {
      setPhoneNumWarning("");
      try {
        await postUpdateUserBasicPI(
          idUser,
          tempUserPI.name,
          tempUserPI.phoneNum,
          tempUserPI.gender,
          tempUserPI.dob,
          tempUserPI.nationality
        );
        // dispatch(updateUserPI({ name, phoneNum, gender, dob, nationality }));
        await dispatch(fetchUserProfile(idUser));
        setUpdateSuccess("Your profile has been updated successfully!");

        setTimeout(() => {
          setUpdateSuccess("");
        }, 3000);
      } catch (error) {
        console.error("Error updating profile:", error);
        setUpdateSuccess("There was an error updating your profile.");
      }
    }
  };
  const handleDiscardChanges = () => {
    const currentUserPI = {
      name,
      phoneNum,
      gender,
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
    await postUpdateTeacherSpecializedPI(
      idUser,
      tempUserPI.teachingMajor,
      tempUserPI.description
    );
    dispatch(updateUserPI({ teachingMajor, description }));
    await dispatch(fetchUserProfile(idUser));
    setUpdatePITeacherSuccess(
      "Your specialized infomation has been updated successfully!"
    );

    setTimeout(() => {
      setUpdatePITeacherSuccess("");
    }, 3000);
  };

  const handleActionClick = (action) => {
    setActiveAction(action);
  };
  const addProfileLink = async () => {
    if (newProfileLink.name && newProfileLink.url) {
      await postAddProfileLink(idUser, newProfileLink.name, newProfileLink.url);
      await dispatch(fetchUserProfile(idUser));
      setNewProfileLink({ name: "", url: "" });
    }
  };
  const removeProfileLink = async (idProfileLink) => {
    await deleteProfileLink(idProfileLink);
    await dispatch(fetchUserProfile(idUser));
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
        console.error("Error changing avatar:", error);
      }
    }
  };
  const AddQualification = async () => {
    console.log(newQualification);

    if (
      newQualification.qualificationName &&
      newQualification.qualificationDescr &&
      newQualification.qualificationFile
    ) {
      await postAddQualification(
        idUser,
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
    } else {
      setQualiWarning(
        "Please enter all required fields for the qualification."
      );
    }

    await dispatch(fetchUserProfile(idUser));
  };
  const removeQualification = async (idQualification) => {
    await deleteQualification(idQualification);
    await dispatch(fetchUserProfile(idUser));
  };

  const handleChangePassword = async () => {
    if (oldPassword && newPassword && confirmPassword) {
      const idAccount = +localStorage.getItem("idAccount");
      await postChangePassword(oldPassword, newPassword, idAccount, idUser);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePWSuccess("Your password has been changed successfully!");

      setTimeout(() => {
        setChangePWSuccess("");
      }, 3000);
    }
  };

  return (
    <div>
      <div className="container-pi">
        <div className="container-ava">
          <div className="sub-container-ava">
            <img
              src={avaImg ? avaImg : default_ava}
              alt=""
              className="main-ava-image"
            />
            <div className="container-icon" onClick={toggleVisibility}>
              <LuCamera className="icon" />
            </div>
            {showAvatarImageOption && <AvatarImageOption />}
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
          <div className="container-specialized">
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
                    <div className="container-phone">
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
                      type="text"
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
                  <Alert
                    variant="success"
                    onClose={() => setUpdateSuccess("")}
                    dismissible
                  >
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
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeAction === "specializedPI" ? (
          <div className="container-specialized">
            <div className="container-info">
              <span className="title-span">Specialized Infomation</span>
              <div className="info">
                <span>Affiliated Center</span>
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
                    dismissible
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
                        readOnly
                      />
                    </InputGroup>
                    <div
                      className="icon-button"
                      onClick={() => {
                        removeProfileLink(profile.idProfileLink);
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
            </div>
            <div className="container-info auto">
              <span className="title-span">Professional Qualifications</span>
              <div className="info">
                {qualificationModels.map((profile, index) => (
                  <div className="container-info-img" key={index}>
                    <div className="quali-content">
                      <input
                        type="text"
                        className="input-form-pi"
                        value={profile.qualificationName || ""}
                        disabled
                      />
                      <input
                        type="text"
                        className="input-form-pi"
                        value={profile.description || ""}
                        disabled
                      />
                      <div className="status-action">
                        <span
                          className={`span ${
                            profile.status === Status.active
                              ? "approved"
                              : profile.status === Status.pending
                              ? "pending"
                              : "rejected"
                          }`}
                        >
                          {profile.status === Status.active
                            ? "Approved"
                            : profile.status === Status.pending
                            ? "Pending"
                            : "Rejected"}
                        </span>
                        <div className="icon-btn-container">
                          <div
                            className="icon-button"
                            onClick={() => {
                              removeQualification(profile.idQualification);
                            }}
                          >
                            <LuTrash2 className="icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="quali-image">
                      <img
                        src={profile.path ? profile.path : default_image}
                        alt=""
                        className="main-ava-image"
                      />
                    </div>
                  </div>
                ))}
                <div className="container-info-img">
                  <div className="quali-content">
                    <input
                      type="text"
                      className="input-form-pi"
                      placeholder="Title"
                      value={newQualification.qualificationName || ""}
                      onChange={handleNameQualificationChange}
                    />
                    <input
                      type="text"
                      className="input-form-pi"
                      placeholder="Discription"
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
                    <img
                      src={
                        newQualification.qualificationUrl
                          ? newQualification.qualificationUrl
                          : default_image
                      }
                      alt=""
                      className="main-ava-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-specialized">
            <div className="container-info">
              <span className="title-span">Security</span>
              <div className="info">
                <span>Old password</span>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="input-form-pi"
                  value={oldPassword || ""}
                  onChange={(e) => setOldPassword(e.target.value)}
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
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    dismissible
                  >
                    {changePWSuccess}
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
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPI;
