import React, { useState } from "react";
import { BiSolidBusiness, BiSolidCheckCircle, BiLock } from "react-icons/bi";
import {} from "react-icons/ri";
import {
  RiBook2Fill,
  RiHourglass2Fill,
  RiHourglassFill,
  RiInfinityFill,
  RiLock2Fill,
} from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import "../../assets/css/DashBoard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const PlatformAdminDashboard = () => {
  const labels = [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4",
    "Point 5",
    "Point 6",
  ];
  const increaseData = {
    labels: labels, // Replace with your labels
    datasets: [
      {
        label: "Smooth Curve",
        data: [10, 25, 15, 30, 25, 40], // Replace with your data points
        fill: false,
        borderColor: "#397979",
        tension: 0.3, // Controls the curve smoothness
        pointRadius: 0, // Removes the points from the chart
        pointHoverRadius: 0, // Ensures points don't appear on hover
      },
    ],
  };
  const decreaseData = {
    labels: labels, // Replace with your labels
    datasets: [
      {
        label: "Smooth Curve",
        data: [40, 25, 30, 15, 25, 10], // Replace with your data points
        fill: false,
        borderColor: "#C00F0C",
        tension: 0.3, // Controls the curve smoothness
        pointRadius: 0, // Removes the points from the chart
        pointHoverRadius: 0, // Ensures points don't appear on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the legend if you don't need it
      },
    },
    scales: {
      x: {
        display: false, // Hides the X-axis
      },
      y: {
        display: false, // Hides the Y-axis
      },
    },
  };
  return (
    <div className="dashboard-container admin-platform">
      <div className="top-section slide-to-bottom">
        <div className="section-block total-user">
          <div className="total-info">
            <label>Total students</label>
            <span>
              100.000
              <span className="change-number">-111</span>
            </span>
          </div>
          <div className="icons-container">
            <div className="icon-image center">
              <BiSolidBusiness className="inside-icon" />
            </div>
            <div className="icon-image teacher">
              <FaChalkboardTeacher className="inside-icon" />
            </div>
            <div className="icon-image student">
              <FaUser className="inside-icon" />
            </div>
          </div>
        </div>
        <div className="section-block each-actor">
          <div className="info-chart">
            <div className="total-info">
              <label>Users</label>
              <span>+520</span>
            </div>
            <div className="chart-display">
              <Line data={increaseData} options={options} />
            </div>
          </div>
          <div className="info-text">
            <label>This month</label>
            <span className="increase">
              +16.45% <TiArrowSortedUp />
            </span>
          </div>
        </div>
        <div className="section-block each-actor">
          <div className="info-chart">
            <div className="total-info">
              <label>Centers</label>
              <span>+111</span>
            </div>
            <div className="chart-display">
              <Line data={decreaseData} options={options} />
            </div>
          </div>
          <div className="info-text">
            <label>This month</label>
            <span className="decrease">
              -16.45% <TiArrowSortedDown />
            </span>
          </div>
        </div>
      </div>
      <div className="bottom-section slide-to-top">
        <div className="bottom-section-block">
          <div className="total-info">
            <label>Total centers</label>
            <span>44.567</span>
          </div>
          <div className="more-info">
            <div className="actor-type">
              <div className="icon-display">
                <BiSolidBusiness className="large-icon" />
                <BiSolidCheckCircle className="small-icon check" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>44.444</span>
                <label>Active Centers</label>
              </div>
            </div>
            <div className="actor-type">
              <div className="icon-display">
                <BiSolidBusiness className="large-icon" />
                <RiLock2Fill className="small-icon lock" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>123</span>
                <label>Locked Centers</label>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-section-block">
          <div className="total-info">
            <label>Total users</label>
            <span>44.567</span>
          </div>
          <div className="more-info">
            <div className="actor-type">
              <div className="icon-display">
                <RiBook2Fill className="large-icon" />
                <RiInfinityFill className="small-icon infinite" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>44.444</span>
                <label>Unlimited Courses</label>
              </div>
            </div>
            <div className="actor-type">
              <div className="icon-display">
                <RiBook2Fill className="large-icon" />
                <RiHourglassFill className="small-icon lock" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>123</span>
                <label>Limited Courses</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
