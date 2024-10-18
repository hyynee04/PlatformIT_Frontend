import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
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
import default_ava from "../../assets/img/default_ava.png";
import default_image from "../../assets/img/default_image.png";
import "../../assets/scss/PI.css";
import {
  deleteProfileLink,
  postAddProfileLink,
  postUpdateTeacherSpecializedPI,
  postUpdateUserBasicPI,
} from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserPI } from "../../store/profileUserSlice";
import { Role, Status, UserGender } from "../../constants/constants";
import AvatarImageOption from "../../components/AvatarImageOption";

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
  const [showAvatarImageOption, setShowAvatarImageOption] = useState(false);
  const [roleDes, setRoleDes] = useState("");
  const [activeAction, setActiveAction] = useState("basicPI");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleVisibility = () => {
    setShowAvatarImageOption(!showAvatarImageOption);
  };
  const [newProfileLink, setNewProfileLink] = useState({ name: "", url: "" });
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
        console.error("Có lỗi xảy ra khi lấy thông tin cá nhân:", error);
      }
    };

    fetchData();
  }, [dispatch, idUser, idRole]);
  const updateBasicInfo = async () => {
    await postUpdateUserBasicPI(
      idUser,
      name,
      phoneNum,
      gender,
      dob,
      nationality
    );
    dispatch(updateUserPI({ name, phoneNum, gender, dob, nationality }));
    // await dispatch(fetchUserProfile(idUser));
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
  const removeProfileLinks = async (idProfileLink, index) => {
    await deleteProfileLink(idProfileLink);
    await dispatch(fetchUserProfile(idUser));
  };
  const handleURLProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, url: e.target.value });
  };

  const handleNameProfileLinkChange = (e) => {
    setNewProfileLink({ ...newProfileLink, name: e.target.value });
  };

  const updateTeacherSpecializedPI = async () => {
    await postUpdateTeacherSpecializedPI(idUser, teachingMajor, description);
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
                  value={name || ""}
                  onChange={(e) =>
                    dispatch(updateUserPI({ name: e.target.value }))
                  }
                />
              </div>
              <div className="info">
                <span>Email</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={email || ""}
                  readOnly
                />
              </div>
              <div className="container-field">
                <div className="container-left">
                  <div className="info">
                    <span>Gender</span>
                    <div className="select-container">
                      <select
                        className="input-form-pi"
                        value={gender || UserGender.male}
                        onChange={(e) =>
                          dispatch(updateUserPI({ gender: e.target.value }))
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
                    <span>Phone Number</span>
                    <input
                      type="text"
                      className="input-form-pi"
                      value={phoneNum || ""}
                      onChange={(e) =>
                        dispatch(updateUserPI({ phoneNum: e.target.value }))
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
                      value={dob}
                      onChange={(e) =>
                        dispatch(updateUserPI({ dob: e.target.value }))
                      }
                    />
                  </div>
                  <div className="info">
                    <span>Nationality</span>
                    <div className="select-container">
                      <select
                        className="input-form-pi"
                        value={nationality || ""}
                        onChange={(e) =>
                          dispatch(
                            updateUserPI({ nationality: e.target.value })
                          )
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
              <div className="container-button">
                <button className="change-pass">Discard changes</button>
                <button
                  className="save-change"
                  onClick={() => {
                    updateBasicInfo();
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        ) : activeAction === "specializedPI" ? (
          <div className="container-specialized">
            <div className="container-info">
              <span className="title-span">Major Infomation</span>
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
                  value={teachingMajor || ""}
                  onChange={(e) =>
                    dispatch(updateUserPI({ teachingMajor: e.target.value }))
                  }
                />
              </div>
              <div className="info">
                <span>Biography</span>
                <Form.Control
                  as="textarea"
                  className="input-area-form-pi"
                  value={description || ""}
                  onChange={(e) =>
                    dispatch(updateUserPI({ description: e.target.value }))
                  }
                />
              </div>
              <div className="container-button">
                <button
                  className="save-change"
                  onClick={() => updateTeacherSpecializedPI()}
                >
                  Save changes
                </button>
              </div>
              <div className="container-field">
                <div className="container-left"></div>
                <div className="container-gap"></div>
                <div className="container-right"></div>
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
                        value={profile.name}
                        className="title-link"
                        readOnly
                      />
                      <Form.Control
                        className="main-link"
                        value={profile.url}
                        readOnly
                      />
                    </InputGroup>
                    <div
                      className="icon-button"
                      onClick={() => {
                        removeProfileLinks(profile.idProfileLink, index);
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
                        value={profile.qualificationName}
                        disabled
                      />
                      <input
                        type="text"
                        className="input-form-pi"
                        value={profile.description}
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
                          <div className="icon-button">
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
                    />
                    <input
                      type="text"
                      className="input-form-pi"
                      placeholder="Discription"
                    />
                    <div className="status-action">
                      <div className="icon-btn-container">
                        <div className="icon-button">
                          <LuFile className="icon" />
                        </div>
                        <div className="icon-button">
                          <LuCheck className="icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="quali-image">
                    <img
                      src={default_image}
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
                  value={name || ""}
                  onChange={(e) =>
                    dispatch(updateUserPI({ name: e.target.value }))
                  }
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
                  value={email || ""}
                  readOnly
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
                  value={email || ""}
                  readOnly
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
              <div className="container-button">
                <button className="change-pass">Discard changes</button>
                <button
                  className="save-change"
                  onClick={() => {
                    updateBasicInfo();
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPI;
