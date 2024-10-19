import React, { useEffect, useState } from "react";
import { LuCamera, LuEyeOff, LuEye } from "react-icons/lu";
import { FaChevronDown, FaUser, FaUserGraduate, FaLock } from "react-icons/fa";
import { postUpdateUserBasicPI } from "../services/userService";
import { Role, UserGender } from "../constants/constants";
import default_ava from "../assets/img/default_ava.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserPI } from "../store/profileUserSlice";
import AvatarImageOption from "./AvatarImageOption";

const BasicInfoForm = () => {
  const idUser = +localStorage.getItem("idUser");
  const idRole = +localStorage.getItem("idRole");

  const dispatch = useDispatch();

  const userPI = useSelector((state) => state.profileUser);
  const { avaImg, name, phoneNum, email, gender, dob, nationality } = userPI;
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
  }, [dispatch, idUser]);

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
          <div className="container-info">
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
                        dispatch(updateUserPI({ nationality: e.target.value }))
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
        ) : (
          <div className="container-info">
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
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;
