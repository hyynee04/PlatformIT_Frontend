import React, { useEffect, useState } from "react";
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
import { getCenterDashboardStatistics } from "../../services/statisticsService";
import { APIStatus } from "../../constants/constants";
import { getAllPaymentOfCenter } from "../../services/paymentService";
import { ImSpinner2 } from "react-icons/im";
import { convertToVietnamTime } from "../../functions/function";

// Register necessary chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CenterAdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const idCenter = +localStorage.getItem("idCenter");

  const [dashboard, setDashboard] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  const [revenueList, setRevenueList] = useState([]);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["rgba(217, 217, 217, 1)"],
        backgroundColor: [],
        borderRadius: 8, // Rounded corners for the bars
        barThickness: 45, // Custom bar width
      },
    ],
  });

  const fetchCenterDashboardStatistics = async () => {
    setLoading(true);
    try {
      const respone = await getCenterDashboardStatistics(idCenter);
      if (respone.status === APIStatus.success) {
        setDashboard(respone.data);
        setLabelList(
          respone.data.paymentByTime?.map(
            (item) => `${item.month}/${item.year}`
          )
        );
        // setRevenueList(
        //   respone.data.paymentByTime?.map((item) => item.totalPayment)
        // );
        setRevenueList([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4792000, 0]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    setLoading(true);
    try {
      const response = await getAllPaymentOfCenter(idCenter);
      if (response.status === APIStatus.success) {
        const cutList = response.data
          ?.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
          .slice(0, 8);

        setPaymentList(cutList);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenterDashboardStatistics();
    fetchPayment();
  }, []);

  useEffect(() => {
    setData({
      ...data,
      labels: labelList,
      datasets: [
        {
          ...data.datasets[0],
          data: revenueList,
          backgroundColor: revenueList?.map(
            (_, index) =>
              index === revenueList.length - 1
                ? "rgba(57, 121, 121, 1)" // Highlight the last item
                : "rgba(217, 217, 217, 1)" // Default color for other items
          ),
        },
      ],
    });
  }, [labelList, revenueList]);

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
          stepSize: 500000,
        },
        grid: {
          borderDash: [3, 3], // Dashed horizontal lines
          color: "rgba(0, 0, 0, 0.1)", // Set grid line color
        },
      },
    },
  });
  if (loading) {
    return (
      <div className="loading-page">
        <ImSpinner2 color="#397979" />
      </div>
    ); // Show loading while waiting for API response
  }

  return (
    <div className="dashboard-container admin-center">
      <div className="left-section slide-to-right">
        <div className="left-content-section">
          <label className="section-title">Revenue</label>
          <div className="revenue-statistics">
            <div className="revenue-header">
              <label>Avg per month (12 months)</label>
              <div className="statistics-number">
                <div className="main-number">
                  <span>
                    {dashboard.averagePayment
                      ?.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </span>
                  <span className="currency">đ</span>
                </div>
                <div className="swing-number increase">
                  <span
                    style={{
                      color:
                        dashboard.paymentDiffPercentage >= 0
                          ? "var(--main-color)"
                          : "var(--red-color)",
                    }}
                  >
                    {`${dashboard.paymentDiffPercentage?.toFixed(1)}`}%
                  </span>
                  {dashboard.paymentDiffPercentage > 0 ? (
                    <IoMdArrowDropup />
                  ) : dashboard.paymentDiffPercentage < 0 ? (
                    <IoMdArrowDropdown />
                  ) : null}
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
              <thead>
                <tr className="header-row">
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date Time</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {paymentList?.length > 0 &&
                  paymentList.map((payment, index) => (
                    <tr key={index}>
                      <td className="user-row">
                        <div className="avatar-container">
                          <img
                            src={payment.studdentAvatar || default_ava}
                            alt="avatar"
                          />
                        </div>
                        <span title={payment.studentName}>
                          {payment.studentName}
                        </span>
                      </td>
                      <td title={payment.courseName}>{payment.courseName}</td>
                      <td>{convertToVietnamTime(payment.paymentDate)}</td>
                      <td>
                        {payment.price
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        đ
                      </td>
                    </tr>
                  ))}
              </tbody>
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
            <span>{dashboard.totalStudents}</span>
          </div>
        </div>
        <div className="section-block total-course">
          <div className="total-info">
            <label>Total courses</label>
            <span>{dashboard.totalCourses}</span>
          </div>
          <div className="course-statistics">
            <div className="course-type">
              <div className="icon-show">
                <RiBook2Fill className="svg-large" />
                <RiInfinityFill className="svg-small infinite" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalUnlimitedCourses}</span>
                <label>Unlimited courses</label>
              </div>
            </div>
            <div className="course-type">
              <div className="icon-show">
                <RiBook2Fill className="svg-large" />
                <RiHourglassFill className="svg-small hour-glass" />
              </div>
              <div className="total-info" style={{ marginBottom: "8px" }}>
                <span>{dashboard.totalLimitedCourses}</span>
                <label>Limit courses</label>
              </div>
            </div>
          </div>
        </div>
        <div className="section-block teacher-ranking">
          <label className="section-title">Teacher courses</label>
          <div className="teacher-ranking-table">
            <table>
              <thead>
                <tr className="header-row">
                  <th></th>
                  <th>Total courses</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.teacherRanking?.length > 0 &&
                  dashboard.teacherRanking.map((teacher, index) => (
                    <tr key={index}>
                      <td className="user-row">
                        <div className="avatar-container">
                          <img
                            src={teacher.teacherAvatar || default_ava}
                            alt="avatar"
                          />
                        </div>
                        <span title={teacher.teacherName}>
                          {teacher.teacherName}
                        </span>
                      </td>
                      <td>{teacher.totalCourses}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterAdminDashboard;
