import React from "react";
import { LuCamera } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";

const BasicInfoForm = () => {
  return (
    <div>
      <div className="title-info">
        <b>Your Information</b>
      </div>
      <div className="container-pi">
        <div className="container-ava">
          <div className="sub-container-ava">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              <input type="text" className="input-form-pi" />
            </div>
            <div className="info">
              <span>Phone Number</span>
              <input type="text" className="input-form-pi" />
            </div>
            <div className="info">
              <span>Email</span>
              <input type="text" className="input-form-pi" />
            </div>
          </div>
          <div className="container-gap"></div>
          <div className="container-right">
            <div className="info">
              <span>Gender</span>
              <div className="select-container">
                <select className="input-form-pi">
                  <option value="">Male</option>
                  <option value="">Female</option>
                  <option value="">Other</option>
                </select>
                <FaChevronDown className="arrow-icon" />
              </div>
            </div>
            <div className="info">
              <span>Birthday</span>
              <input type="date" className="input-form-pi" />
            </div>
            <div className="info">
              <span>Nationality</span>
              <div className="select-container">
                <select className="input-form-pi">
                  <option value="">Viet Nam</option>
                  <option value="">Japan</option>
                  <option value="">China</option>
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
