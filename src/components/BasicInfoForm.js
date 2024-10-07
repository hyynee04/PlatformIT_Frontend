import React, { useEffect, useState } from "react";
import { LuCamera } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import { getPI } from "../services/userService";
import { UserGender } from "../constants/constants";
import default_ava from "../assets/img/default_ava.png";

const BasicInfoForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [countries, setCountries] = useState([]);

  const idUser = +localStorage.getItem("idUser");
  const [avaImg, setAvaImg] = useState(null);
  const [name, setName] = useState(null);
  const [phoneNum, setPhoneNum] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(UserGender.male);
  const [dob, setDob] = useState(today);
  const [nationality, setNationality] = useState(null);

  useEffect(() => {
    if (!idUser) {
      console.error("Không tìm thấy idUser trong localStorage");
      return;
    }

    const fetchData = async () => {
      try {
        let data = await getPI(idUser);

        setAvaImg(data.avatar);
        setName(data.fullName);
        setPhoneNum(data.phoneNumber);
        setEmail(data.email);
        setGender(data.gender);
        setDob(data.dob.split("T")[0]);

        //API for nationality
        const respone = await fetch(
          "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
        );
        const countryData = await respone.json();
        const countriesData = countryData.countries.map((country) => ({
          label: country.label.split(" ")[1],
        }));

        setCountries(countriesData);

        //find nationality in API
        const userNationality = countriesData.find(
          (country) => country.label === data.nationality
        );
        setNationality(userNationality ? userNationality.label : "");
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy thông tin cá nhân:", error);
      }
    };

    fetchData();
  }, [idUser]);

  return (
    <div>
      <div className="title-info">
        <b>Your Information</b>
      </div>
      <div className="container-pi">
        <div className="container-ava">
          <div className="sub-container-ava">
            <img
              src={avaImg ? avaImg : default_ava}
              alt=""
              className="main-image"
            />
            <div className="container-icon">
              <LuCamera className="icon" />
            </div>
          </div>
        </div>
        <div className="container-field">
          <div className="container-left">
            <div className="info">
              <span>Name</span>
              <input
                type="text"
                className="input-form-pi"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="info">
              <span>Phone Number</span>
              <input
                type="text"
                className="input-form-pi"
                value={phoneNum || ""}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
            </div>
            <div className="info">
              <span>Email</span>
              <input
                type="text"
                className="input-form-pi"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="container-gap"></div>
          <div className="container-right">
            <div className="info">
              <span>Gender</span>
              <div className="select-container">
                <select
                  className="input-form-pi"
                  value={gender || UserGender.male}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value={UserGender.male}>Male</option>
                  <option value={UserGender.female}>Female</option>
                  <option value={UserGender.other}>Other</option>
                </select>
                <FaChevronDown className="arrow-icon" />
              </div>
            </div>
            <div className="info">
              <span>Birthday</span>
              <input
                type="date"
                className="input-form-pi"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                fotmat="mm-dd-yyy"
              />
            </div>
            <div className="info">
              <span>Nationality</span>
              <div className="select-container">
                <select
                  className="input-form-pi"
                  value={nationality || ""}
                  onChange={(e) => setNationality(e.target.value)}
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
          <button className="change-pass">Change Password</button>
          <button className="save-change">Save change</button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
