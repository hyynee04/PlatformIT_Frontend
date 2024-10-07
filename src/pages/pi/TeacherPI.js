import React, { useEffect, useState } from "react";
import BasicInfo from "../../components/BasicInfoForm";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaRegTrashCan, FaPlus } from "react-icons/fa6";
import { LuFile } from "react-icons/lu";

import "../../assets/scss/PI.css";
import { getPI } from "../../services/userService";

const TeacherPI = () => {
  const idUser = +localStorage.getItem("idUser");
  const [affiliatedCenter, setAffiliatedCenter] = useState(null);
  const [teachingMajor, setTeachingMajor] = useState(null);
  const [description, setDiscription] = useState(null);

  useEffect(() => {
    if (!idUser) {
      console.error("Không tìm thấy idUser trong localStorage");
      return;
    }

    const fetchData = async () => {
      try {
        let data = await getPI(idUser);

        setAffiliatedCenter(data.centerName);
        setTeachingMajor(data.teachingMajor);
        setDiscription(data.discription);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy thông tin cá nhân:", error);
      }
    };
    fetchData(); // Gọi hàm để lấy dữ liệu
  }, [idUser]);
  return (
    <div>
      <div className="basic-info">
        <BasicInfo></BasicInfo>
      </div>
      <div className="more-info">
        <div className="title-info">
          <b>More Information</b>
        </div>
        <div className="container-pi">
          <div className="container-field">
            <div className="container-left">
              <div className="info">
                <span>Affiliated Center</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={affiliatedCenter || ""}
                  onChange={(e) => setAffiliatedCenter(e.target.value)}
                />
              </div>
              <div className="info">
                <span>Description</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={description || ""}
                  onChange={(e) => setDiscription(e.target.value)}
                />
              </div>
              <div className="info">
                <span>Social/Professional Profile Links</span>
                <div className="container-link">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="title-link" id="basic-addon1">
                      Github
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="main-link"
                    />
                  </InputGroup>
                  <div className="icon-button">
                    <FaRegTrashCan
                      className="icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                </div>
                <div className="container-link">
                  <InputGroup className="mb-3">
                    <InputGroup.Text className="title-link" id="basic-addon1">
                      Linkedln
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      className="main-link"
                    />
                  </InputGroup>
                  <div className="icon-button">
                    <FaRegTrashCan
                      className="icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                  <div className="icon-button">
                    <FaPlus
                      className="icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="info">
                <span>Professional Qualifications</span>
                {/* <input type="text" className="input-form-pi" /> */}
                <div className="container-quali-image last">
                  <div className="quali-content-container">
                    <span>Approved</span>
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
                    <div className="icon-btn-container">
                      <div className="icon-button">
                        <FaRegTrashCan
                          className="icon"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div className="icon-button">
                        <LuFile
                          className="icon"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="quali-image"></div>
                </div>
                <div className="container-quali-image">
                  <div className="quali-content-container">
                    <span>Approved</span>
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
                    <div className="icon-btn-container">
                      <div className="icon-button">
                        <FaRegTrashCan
                          className="icon"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                      <div className="icon-button">
                        <LuFile
                          className="icon"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="quali-image"></div>
                </div>
              </div>
            </div>
            <div className="container-gap"></div>
            <div className="container-right">
              <div className="info">
                <span>Teaching Specialization</span>
                <input
                  type="text"
                  className="input-form-pi"
                  value={teachingMajor || ""}
                  onChange={(e) => setTeachingMajor(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="container-button">
            <button className="save-change">Save change</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPI;
