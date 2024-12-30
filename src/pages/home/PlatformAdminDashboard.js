import React, { useEffect, useState } from "react";
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
import { getPlatformDashboardStatistics } from "../../services/statisticsService";
import { ImSpinner2 } from "react-icons/im";
import { APIStatus } from "../../constants/constants";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const PlatformAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState({});
  const [changePercent, setChangePercent] = useState({
    user: null,
    center: null,
  });

  const fetchPlatformDashboardStatistics = async () => {
    setLoading(true);
    try {
      let response = await getPlatformDashboardStatistics();
      if (response.status === APIStatus.success) {
        setDashboard(response.data);
        setChangePercent({
          user: handleCalculatePercent(
            response.data.userDifference,
            response.data.totalUsers
          ),
          center: handleCalculatePercent(
            response.data.centerDifference,
            response.data.totalActiveCenters
          ),
        });
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculatePercent = (changeNumber, totalNumber) => {
    let percent = (changeNumber / totalNumber) * 100;
    return percent.toFixed(1);
  };

  function getLast6MonthsCounts(stats) {
    const result = Array(6).fill(0);
    const length = stats?.length;

    for (let i = 0; i < Math.min(6, length); i++) {
      result[5 - i] = stats[length - 1 - i].count;
    }

    return result;
  }

  useEffect(() => {
    fetchPlatformDashboardStatistics();
  }, []);

  const labels = [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4",
    "Point 5",
    "Point 6",
  ];
  const userData = {
    labels: labels, // Replace with your labels
    datasets: [
      {
        label: "Smooth Curve",
        data: getLast6MonthsCounts(dashboard.userStatsLast6Months), // Replace with your data points
        fill: false,
        borderColor: changePercent.user >= 0 ? "#397979" : "#C00F0C",
        tension: 0.3, // Controls the curve smoothness
        pointRadius: 0, // Removes the points from the chart
        pointHoverRadius: 0, // Ensures points don't appear on hover
      },
    ],
  };
  const centerData = {
    labels: labels, // Replace with your labels
    datasets: [
      {
        label: "Smooth Curve",
        data: getLast6MonthsCounts(dashboard.centerStatsLast6Months), // Replace with your data points
        fill: false,
        borderColor: changePercent.center >= 0 ? "#397979" : "#C00F0C",
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

  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }
  return (
    <div className="dashboard-container admin-platform">
      <div className="top-section slide-to-bottom">
        <div className="section-block total-user">
          <div className="total-info">
            <label>Total users</label>
            <span>{dashboard.totalUsers}</span>
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
              <span>
                {dashboard.userDifference > 0
                  ? "+"
                  : dashboard.userDifference < 0
                  ? "-"
                  : ""}
                {dashboard.userDifference}
              </span>
            </div>
            <div className="chart-display">
              <Line data={userData} options={options} />
            </div>
          </div>
          <div className="info-text">
            <label>This month</label>
            <span
              className={`${changePercent.user >= 0 ? "increase" : "decrease"}`}
            >
              {changePercent.user > 0 ? "+" : changePercent.user < 0 ? "-" : ""}
              {Math.abs(changePercent.user)}%{" "}
              {changePercent.user > 0 ? (
                <TiArrowSortedUp />
              ) : changePercent.user < 0 ? (
                <TiArrowSortedDown />
              ) : null}
            </span>
          </div>
        </div>
        <div className="section-block each-actor">
          <div className="info-chart">
            <div className="total-info">
              <label>Centers</label>
              <span>
                {dashboard.centerDifference > 0
                  ? "+"
                  : dashboard.centerDifference < 0
                  ? "-"
                  : ""}
                {dashboard.centerDifference}
              </span>
            </div>
            <div className="chart-display">
              <Line data={centerData} options={options} />
            </div>
          </div>
          <div className="info-text">
            <label>This month</label>
            <span
              className={`${
                changePercent.center >= 0 ? "increase" : "decrease"
              }`}
            >
              {changePercent.center > 0
                ? "+"
                : changePercent.center < 0
                ? "-"
                : ""}
              {Math.abs(changePercent.center)}%{" "}
              {changePercent.center > 0 ? (
                <TiArrowSortedUp />
              ) : changePercent.center < 0 ? (
                <TiArrowSortedDown />
              ) : null}
            </span>
          </div>
        </div>
      </div>
      <div className="bottom-section slide-to-top">
        <div className="bottom-section-block">
          <div className="total-info">
            <label>Total centers</label>
            <span>{dashboard.totalCenters}</span>
          </div>
          <div className="more-info">
            <div className="actor-type">
              <div className="icon-display">
                <BiSolidBusiness className="large-icon" />
                <BiSolidCheckCircle className="small-icon check" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalActiveCenters}</span>
                <label>Active Centers</label>
              </div>
            </div>
            <div className="actor-type">
              <div className="icon-display">
                <BiSolidBusiness className="large-icon" />
                <RiLock2Fill className="small-icon lock" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalLockedCenters}</span>
                <label>Locked Centers</label>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-section-block">
          <div className="total-info">
            <label>Total courses</label>
            <span>{dashboard.totalCourses}</span>
          </div>
          <div className="more-info">
            <div className="actor-type">
              <div className="icon-display">
                <RiBook2Fill className="large-icon" />
                <RiInfinityFill className="small-icon infinite" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalUnlimitedCourses}</span>
                <label>Unlimited Courses</label>
              </div>
            </div>
            <div className="actor-type">
              <div className="icon-display">
                <RiBook2Fill className="large-icon" />
                <RiHourglassFill className="small-icon lock" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalLimitedCourses}</span>
                <label>Limit Courses</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
