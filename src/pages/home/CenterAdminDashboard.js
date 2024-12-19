import React from "react";
import "../../assets/css/DashBoard.css";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const CenterAdminDashboard = () => {
  return (
    <div className="dashboard-container admin-center">
      <div className="left-section">
        <div className="left-content-section">
          <label className="section-title">Revenue</label>
          <div className="revenue-statistics">
            <div className="revenue-header">
              <label>Avg per month</label>
              <div className="statistics-number">
                <div className="main-number">
                  <span>44.567</span>
                  <span className="currency">đ</span>
                </div>
                <div className="swing-number increase">
                  <span>16.45%</span>
                  <IoMdArrowDropup />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left-content-section"></div>
      </div>
      <div className="right-section"></div>
    </div>
  );
};

export default CenterAdminDashboard;
