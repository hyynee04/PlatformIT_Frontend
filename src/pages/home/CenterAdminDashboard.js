import React, { useState } from "react";
import "../../assets/css/DashBoard.css";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { RiBook2Fill, RiHourglassFill, RiInfinityFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import default_ava from "../../assets/img/default_ava.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CenterAdminDashboard = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthIndex = new Date().getMonth();

  const [data, setData] = useState({
    labels: months,
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 65, 59, 80, 81, 56, 55],
        // backgroundColor: ["rgba(217, 217, 217, 1)"],
        backgroundColor: months.map(
          (_, index) =>
            index === currentMonthIndex
              ? "rgba(57, 121, 121, 1)" // Highlight current month
              : "rgba(217, 217, 217, 1)" // Default color
        ),
        borderRadius: 8, // Rounded corners for the bars
        barThickness: 45, // Custom bar width
      },
    ],
  });

  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false, // Remove vertical lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 25,
        },
        grid: {
          borderDash: [3, 3], // Dashed horizontal lines
          color: "rgba(0, 0, 0, 0.1)", // Set grid line color
        },
      },
    },
  });

  return (
    <div className="dashboard-container admin-center">
      <div className="left-section slide-to-right">
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
          <div className="chart-container">
            <Bar data={data} options={options} />
          </div>
        </div>
        <div className="left-content-section">
          <label className="section-title">Transactions</label>
          <div className="transaction-table">
            <table>
              <tr className="header-row">
                <th>Student</th>
                <th>Course</th>
                <th>Date Time</th>
                <th>Cost</th>
              </tr>
              <tr>
                <td className="user-row">
                  <div className="avatar-container">
                    <img src={default_ava} alt="avatar" />
                  </div>
                  <span>Ken Adams</span>
                </td>
                <td>Advanced Node.JS</td>
                <td>10/20/2024, 22:30</td>
                <td>300.000.000đ</td>
              </tr>
              <tr>
                <td className="user-row">
                  <div className="avatar-container">
                    <img src={default_ava} alt="avatar" />
                  </div>
                  <span>Ken Adams</span>
                </td>
                <td>Advanced Node.JS</td>
                <td>10/20/2024, 22:30</td>
                <td>300.000đ</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="right-section slide-to-left">
        <div className="section-block total-student">
          <div className="total-info-icon">
            <FaUser />
          </div>
          <div className="total-info">
            <label>Total students</label>
            <span>666.000</span>
          </div>
        </div>
        <div className="section-block total-course">
          <div className="total-info">
            <label>Total courses</label>
            <span>254</span>
          </div>
          <div className="course-statistics">
            <div className="course-type">
              <div className="icon-show">
                <RiBook2Fill className="svg-large" />
                <RiInfinityFill className="svg-small infinite" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>254</span>
                <label>Unlimited courses</label>
              </div>
            </div>
            <div className="course-type">
              <div className="icon-show">
                <RiBook2Fill className="svg-large" />
                <RiHourglassFill className="svg-small hour-glass" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>254</span>
                <label>Limited courses</label>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block teacher-ranking">
          <label className="section-title">Teacher courses</label>
          <div className="teacher-ranking-table">
            <table>
              <tr className="header-row">
                <th></th>
                <th>Total courses</th>
              </tr>
              <tr>
                <td className="user-row">
                  <div className="avatar-container">
                    <img src={default_ava} alt="avatar" />
                  </div>
                  <span>Duc Huy</span>
                </td>
                <td>600</td>
              </tr>
              <tr>
                <td className="user-row">
                  <div className="avatar-container">
                    <img src={default_ava} alt="avatar" />
                  </div>
                  <span>Tuong Vy</span>
                </td>
                <td>400</td>
              </tr>
              <tr>
                <td className="user-row">
                  <div className="avatar-container">
                    <img src={default_ava} alt="avatar" />
                  </div>
                  <span>Nhat Ha</span>
                </td>
                <td>500</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterAdminDashboard;
